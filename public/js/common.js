/* jshint node: true */
'use strict';

var crel = require('crel');
var moment = require('moment');
var signaller = require('rtc-signaller')('http://localhost:1337/');
var friends = {};

var messageList = document.getElementById('messageList');
var commandInput = document.getElementById('commandInput');

// catch announce message from partner
signaller.on('peer:announce', function(data) {
  // we've got a new friend
  friends[data.id] = data;
  writeChat('new friend connected', data.id);
});

signaller.on('peer:leave', function(id) {
  if (friends[id]) {
    writeChat('friend left', id);
    friends[id] = undefined;
  }
});

signaller.announce({ room: 'test' });

function writeChat(text, id) {
  messageList.appendChild(crel('tr', {
      class: id === signaller.id ? 'local' : 'remote',
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
    signaller.send('/chat', {
      text: commandInput.value,
      sender: signaller.id
    });

    // To send to particular friend, use:
    //signaller.send('/to', otherId, '/chat', {text: commandInput.value, sender: signaller.id});

    writeChat(commandInput.value, signaller.id);
    commandInput.value = '';
  }
}

commandInput.addEventListener('keydown', handleCommand);

// handle received chat message
signaller.on('chat', function(data, srcState) {
  writeChat(data.text, data.sender);
});