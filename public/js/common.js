/* jshint node: true */
'use strict';

var signaller = require('rtc-signaller');
var socket = Primus.connect('http://localhost:1337/');
var scope = signaller(socket);

var me = 'sender1';
var peer = 'sender2';
var connectTime;
var messageList = document.getElementById('messageList');
var commandInput = document.getElementById('commandInput');

socket.once('open', function() {
  // create a room
  console.log('announcing self');
  connectTime = Date.now();
  scope.announce({ role: me, room: 'test', time: connectTime });
});

// catch announce message from partner
scope.on('peer:announce', function(data) {

  console.log('received announce : ' + JSON.stringify(data));
  // when both announce themselves, but we have been later, re-announce ourselves
  if (data.role === me) {
    if (data.time > connectTime) {
      me = 'sender2';
      console.log('clashed roles, reannouncing as sender2.');
      scope.announce({ role: me, room: 'test', time: connectTime });
      console.log('connected');
      writeChat("..connected", false);
    }
  } else {
    peer = data.role;
    console.log('connected');
    writeChat("..connected", false);
  }
  return;
});

scope.on('peer:leave', function(data) {
  console.log('received leave : ' + JSON.stringify(data));
  writeChat("..peer disconnected", false);
  peer = me;

});

function writeChat(text, local) {
  var row = document.createElement("tr");
  var date = new Date;
  var hour = date.getHours();
  var minutes = date.getMinutes();
  (minutes < 10) && (minutes = '0' + minutes);

  if (me === 'teacher' && local || me === 'student' && !local) {
    row.innerHTML += "<td>" + hour + ":" + minutes + "</td>";
    row.innerHTML += "<td style='text-color:red'>" + text + "</td>";
  } else {
    row.innerHTML += "<td>" + hour + ":" + minutes + "</td>";
    row.innerHTML += "<td style='text-color:green'>" + text + "</td>";
  }

  messageList.appendChild(row);
  messageList.scrollTop = messageList.scrollHeight;
}

// handle input string
function handleCommand(evt) {
  if (evt && evt.keyCode === 13 && commandInput.value != '') {
    scope.send('/chat', {
      room: 'test',
      text: commandInput.value
    });

    writeChat(commandInput.value, true);
    commandInput.value = '';
  }
}
commandInput.addEventListener('keydown', handleCommand);

// handle receiving input string
scope.on('chat', function(srcState, data) {
  // if the chat message is not for this room ignore
  if (data.room !== 'test') {
    return;
  }

  writeChat(data.text, false);
});
