# rtc-signaller demo

This is a demonstration application that illustrates how [`rtc-signaller`](https://github.com/rtc-io/rtc-signaller) can be used as a standalone package to send messages between multiple participants using WebSocket connections to [`rtc-switchboard`](https://github.com/rtc-io/rtc-switchboard).

## Running the Demo

If you wish to run this demo locally, then you can run the following:

```
npm install beefy browserify -g
git clone https://github.com/rtc-io/rtcio-demo-signaller.git demo-signaller
cd demo-signaller
beefy index.js:bundle.js
```

You should now be able to open a browser window to
http://localhost:9966/ (or alternatively
http://rtc-io.github.io/rtcio-demo-mesh/ if you don't want to run
the demo locally).  Either way you'll join the `rtcio-demo-mesh` room on the
switchboard and should be able to move around a couple of objects that are
attempting to share state across the established peer connections.
