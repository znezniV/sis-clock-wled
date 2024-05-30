import express from 'express';
import shared from '../shared.js';
const router = express.Router();

export default function(apiEventEmitter) {
  /* GET home page. */
  router.get('/api', function(req, res, next) {
    res.render('api', {
      title: 'Clock Settings',
      led_duration: shared.led_duration,
      led_id_start: shared.led_id_start,
      led_id_stop: shared.led_id_stop,
      led_id_end: shared.led_id_end
    });
  });

  /* POST home page. */
  router.post('/', function(req, res, next) {
    shared.led_duration = req.body.duration_field;
    shared.led_id_start = req.body.start_field;
    shared.led_id_stop = req.body.stop_field;
    shared.led_id_end = req.body.end_field;

    // Emit the event using the eventEmitter instance
    apiEventEmitter.emit('event:clock_updated', 'test')

    res.render('api', {
      title: 'Clock Settings',
      led_duration: shared.led_duration,
      led_id_start: shared.led_id_start,
      led_id_stop: shared.led_id_stop,
      led_id_end: shared.led_id_end
    });
  });

  return router
}
