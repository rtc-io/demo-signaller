rtcio-demo-signaller
====================

An example app showing how to use [rtc-switchboard](https://github.com/rtc-io/rtc-switchboard) to set up a signalling server and [rtc-signaller](https://github.com/rtc-io/rtc-signaller) on the client to exchange messages via the server.

Getting started:

1. Clone the repo:
    ```
    git clone https://github.com/rtc-io/rtcio-demo-signalling.git
    ```

2. Install node dependencies (it's assumed you have node installed):
    ```
    npm install
    ```

3. Run the server:
    ```
    npm start
    ```

4. Find the application at the following url:
    ```
    http://localhost:3000/index.html
    ```

5. Load the URL in a second browser to establish the video conference:
    ```
    http://localhost:3000/index.html
    ```

To start the app on a different port, run it as:
    ```
    NODE_PORT=3020 npm start
    ```

Make sure to also change the port that your client file public/js/common.js is connecting to.

To debug the server, run it as:
    ```
    DEBUG=rtc* npm start
    ```

