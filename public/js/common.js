/* jshint node: true */
'use strict';

var crel = require('crel');
var moment = require('moment');
var signaller = require('rtc-signaller');
var socket = Primus.connect('http://localhost:1337/');
var scope = signaller(socket);
var friends = {};

var messageList = document.getElementById('messageList');
var commandInput = document.getElementById('commandInput');

socket.once('open', function() {
  // create a room
  console.log('announcing self');
  scope.announce({ room: 'test' });
});

// catch announce message from partner
scope.on('peer:announce', function(data) {
  // we've got a new friend
  friends[data.id] = data;
  writeChat('new friend connected', data.id);
});

scope.on('peer:leave', function(id) {
  if (friends[id]) {
    writeChat('friend left', id);
    friends[id] = undefined;
  }
});

function writeChat(text, id) {
  messageList.appendChild(crel('tr', {
      class: id === scope.id ? 'local' : 'remote',
      'data-sender': id
    },
    crel('td', moment().format('MM:SS')),
    crel('td', text),
    crel('td', '(' + id + ')')
  ));

  messageList.scrollTop = messageList.scrollHeight;
}

// handle input string
function handleCommand(evt) {
  if (evt && evt.keyCode === 13 && commandInput.value != '') {
    // broadcast a 'chat' message
    scope.send('/chat', {
      text: commandInput.value,
      sender: scope.id
    });

    // To send to particular friend, use:
    //scope.send('/to', otherId, '/chat', {text: commandInput.value, sender: scope.id});

    writeChat(commandInput.value, scope.id);
    commandInput.value = '';
  }
}

commandInput.addEventListener('keydown', handleCommand);

// handle received chat message
scope.on('chat', function(srcState, data) {
  writeChat(data.text, data.sender);
});