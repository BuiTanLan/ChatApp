var express = require('express');
var socket = require('socket.io');
const https = require('https');
process.env.NODE_TLS_REJECT_UNAUTHORIZED='0'


const options = {
    host: '127.0.0.1',
    port: 5001,
    path: '/message',
    method: 'POST',
    headers: {
        'content-type': 'application/json',
        'accept': 'application/json'
    }
};
// App setup
var app = express();
var server = app.listen(3000, function(){
    console.log('listening for requests on port 3000');
});

// Socket setup and cors policy
const io = require("socket.io")(server, {
    cors: {
      origin: "http://localhost:4200",
      methods: ["GET", "POST"],
      allowedHeaders: ["my-custom-header"],
      credentials: true
    }
  });

// Listen for new connection and print a message in console 
io.on('connection', (socket) => {

    console.log(`New connection ${socket.id}`)

    // Listening for chat event
    socket.on('chat', function(data){
        // console.log('chat event trigged at server');
        // console.log('need to notify all the clients about this event');
        io.sockets.emit('chat', data);
        var postData = JSON.stringify(data);
        const req = https.request(options, (res) => {
            res.setEncoding('utf8');
            res.on('data', (chunk) => {
                console.log(`BODY: ${chunk}`);
            });
            res.on('end', () => {
                console.log('No more data in response.');
            });
        });
        
        req.on('error', (e) => {
            console.error(`problem with request: ${e.message}`);
        });
        
        // write data to request body
        req.write(postData);
        req.end();

    });

    // Listening for typing event
    socket.on('typing', function(data){
        // console.log(`Server received ${data} is typing`);
        // console.log('need to inform all the clients about this');
        io.sockets.emit('typing', data);
        //socket.broadcast.emit('typing', data);
    });

});
