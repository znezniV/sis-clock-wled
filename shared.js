// shared.js
let _led_duration = 5;
let _led_id_start = 1;
let _led_id_stop = null;
let _led_id_end = 100;

const shared = {
  get led_duration() {
    return _led_duration;
  },
  set led_duration(value) {
    _led_duration = value;
  },
  get led_id_start() {
    return _led_id_start;
  },
  set led_id_start(value) {
    _led_id_start = value;
  },
  get led_id_stop() {
    return _led_id_stop;
  },
  set led_id_stop(value) {
    _led_id_stop = value;
  },
  get led_id_end() {
    return _led_id_end;
  },
  set led_id_end(value) {
    _led_id_end = value;
  }
};

export default shared;
