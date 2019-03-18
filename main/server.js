const express = require('express')
// const path = require('path')
// const next = require('next')
// const { parse } = require('url')
const app = express()
const http = require('http').Server(app);
const io = require('socket.io')(http);
const bodyParser = require("body-parser")

// const {handleDisconnect, handleGetAvailableUsers, handleJoin, handleGetChatrooms, handleLeave, handleMessage, handleRegister} = require("/socket-client.js")

//static files

app.use(express.static('public'))
app.use(bodyParser.json())
// app.use('/_next', express.static(path.join(__dirname, '.next')))
// app.get('/', (req, res) => {
//     app.render(req, res, '/')
//     res.sendFile(__dirname + '/react/index.html');

// })

app.post('/chats')


http.listen(3000, function(){
    console.log('listening on *:3000');
  });
