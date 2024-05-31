# How to use
Excuse me for the spaghetti code. It had to be done, rather than beautiful.

## Deployment on Raspberry Pi (made with 3 B+)
Note: incomplete

1. Connect through SSH
2. Setup MQTT broker and make sure to start a service on boot [Mosquitto](https://mosquitto.org/download/) [Nice Tutorial](https://randomnerdtutorials.com/how-to-install-mosquitto-broker-on-raspberry-pi/)
3. Clone the repository
4. [Install nvm](https://www.jemrf.com/pages/how-to-install-nvm-and-node-js-on-raspberry-pi)
5. Navigate into repository folder
6. Install and use correct npm version with `nvm use`
7. Copy and rename `.env.example` to `.env`, and add correct values to .env
8. Install dependencies `npm install`
9. Test with `npm run dev`
10. Install pm2 globally with `npm install -g pm2` (to run the script on startup)
11. `pm2 startup`
12. Paste in the resulting command as instructed.
13. Type `pm2 start ./bin/www`
14. `pm2 save`
15. Reboot Raspberry and test if webapp is running on `https://raspberrypi.local/api`
16. Alternatively, there is a .service file that somebody could make work

