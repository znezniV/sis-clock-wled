import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { EventEmitter } from 'events';
import createError from 'http-errors';
import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import mqtt from 'mqtt'
import { intervalToDuration } from 'date-fns'

import apiRounter from './routes/api.js';
import shared from './shared.js';

const app = express();
const eventEmitter = new EventEmitter();
// Convert the current module URL to a file path
const __filename = fileURLToPath(import.meta.url);
// Derive the directory name from the file path
const __dirname = dirname(__filename);

function minutesToMilliseconds (minutes) {
  return minutes * 60 * 1000
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'dist')));

app.use('/', apiRounter(eventEmitter));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// define a random client id to connect to the mqtt broker
const clientId = 'mqttjs_' + Math.random().toString(8).substr(2, 4)

// define mqtt client with environment variables
const client = mqtt.connect(process.env.BROKER_URL, {
  clientId: clientId,
  clean: false,
  username: process.env.BROKER_USR,
  password: process.env.BROKER_PWD
})

// define mqtt topics
const topicCountdown = 'wled/countdown/api'
const topicValue = 'wled/value/api'
const topicSolarFlares = 'wled/solarflares/api'
const topicCircle = 'wled/circle/api'

// define countdown variables and default value
const endDate = new Date(2024, 5, 11, 17, 0, 0, 0) // 11.6.2024 17:00:00:00 -> months start with 0, so 0 for January

// connect to mqtt broker
client.on("connect", function(connack) {
  console.log("client connected", connack)

  // on client connection publish messages to the topic on the server/broker
  const payload = {
    seg: [
      {
        n: `SIS 2024`
      }
    ]
  }
})

// define countdown publish
function publishCountdown() {
  // calculate countdown string
  const now = new Date()
  const difference = intervalToDuration({ end: endDate, start: now })
  const countdown = `${((difference.days ? difference.days : 0))}:${('0' + (difference.hours ? difference.hours : 0)).slice(-2)}:${('0' + (difference.minutes ? difference.minutes : 0)).slice(-2)}:${('0' + (difference.seconds ? difference.seconds : 0)).slice(-2)}`

  // define the overwrite segment name which then is displayed as text in the 'Scrolling Text' effect of WLED
  const payload = {seg: [
    {
      n: `${countdown}`
    }
  ]}

  // mqtt publish payload to topic
  client.publish(topicCountdown, JSON.stringify(payload), {qos: 1, retain: true}, (PacketCallback, err) => {
    if(err) {
        console.log(err, 'MQTT publish packet')
    }
  })
}

// define circle default positions (and colors)
const circleCurrent = {
  color: '0000FF',
  position: shared.led_id_start - 1
}
const circleEnd = {
  color: 'FF0000',
  position: shared.led_id_end - 1
}

// define circle default speed
let circleSpeed = minutesToMilliseconds(shared.led_duration) / shared.led_id_end

// define circle publish
function publishCircle() {
  // define circle variables and default values

  const circleDefaultColor = '000000'

  // define (WLED) segment variable with array of individual leds ('i' for individual)
  let seg = { "i": []}

  // loop through all the LEDs of the circle
  for (let index = 0; index < shared.led_id_end; index++) {
    // fill the individual LED array with index number and color
    seg.i[index] = [
    // if it is the LED of the current LED or the one of the end, color it with the correct color, otherwise default color
      index, circleCurrent.position === index ? circleCurrent.color
      : circleEnd.position === index ? circleEnd.color
      : circleDefaultColor
    ]
  }

  // flatten the array to one dimension
  seg.i = seg.i.flat()

  // add the (WLED) segment variable to the payload
  const payload = {
    seg
  }

  // mqtt publish payload to topic
  client.publish(topicCircle, JSON.stringify(payload), {qos: 1, retain: true}, (PacketCallback, err) => {
    if(err) {
      console.log(err, 'MQTT publish packet')
    }
  })

  // move the position of the LED of the circle forward or reset current circle position before it touches the end position
  if (circleCurrent.position < shared.led_id_end - 2) {
    circleCurrent.position++
  } else {
    circleCurrent.position = 0
  }
}

// start all the publish intervals
let countdownInterval = setInterval(() => publishCountdown(), 1000)
let circleInterval = setInterval(() => publishCircle(), circleSpeed)

eventEmitter.on('event:clock_updated', handleClockUpdated);

function handleClockUpdated() {
  clearInterval(circleInterval)
  console.log('circle stopped')
  circleSpeed = minutesToMilliseconds(shared.led_duration) / shared.led_id_end
  circleCurrent.position = shared.led_id_start - 1
  circleEnd.position = shared.led_id_end - 1
  circleInterval = setInterval(() => publishCircle(), circleSpeed)
  console.log('circle restarted')
}

client.on("error", function(err) {
  console.log("Error: " + err)
  if(err.code == "ENOTFOUND") {
      console.log("Network error, make sure you have an active internet connection")
  }
})

client.on("close", function() {
  console.log("Connection closed by client")
})

client.on("reconnect", function() {
  console.log("Client trying a reconnection")
})

client.on("offline", function() {
  console.log("Client is currently offline")
})

export { app, eventEmitter };
