import express from 'express';
const router = express.Router();
let led_duration = 5
let led_id_start = 1
let led_id_stop = null
let led_id_end = 100

/* GET home page. */
router.get('/api', function(req, res, next) {
  res.render('api', {
    title: 'Clock Settings',
    led_duration,
    led_id_start,
    led_id_stop,
    led_id_end
   });
});

/* POST home page. */
router.post('/', function(req, res, next) {
  led_duration = req.body.duration_field
  led_id_start = req.body.start_field
  led_id_stop = req.body.stop_field
  led_id_end = req.body.end_field
  res.render('api', {
    title: 'Clock Settings',
    led_duration,
    led_id_start,
    led_id_stop,
    led_id_end
  });
});

export default router;
