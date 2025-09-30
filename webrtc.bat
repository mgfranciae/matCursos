@echo off
mkdir WEBRTC_DEMO
cd WEBRTC_DEMO
type nul > .env
type nul > package.json
mkdir src
cd src
type nul > main.js
mkdir controllers
type nul > controllers\roomController.js
mkdir routes
type nul > routes\index.js
mkdir models
type nul > models\room.js
mkdir views
type nul > views\index.ejs
type nul > views\room.ejs
mkdir public
mkdir public\styles
type nul > public\styles\style.css
mkdir public\scripts
type nul > public\scripts\client.js