"use strict";

process.title = 'node-chat';

let webSocketsServerPort = 1337;

// websocket and http servers
let webSocketServer = require('websocket').server;
let http = require('http');

let history = [];
let clients = [];

/**
 * HTTP server
 */
let server = http.createServer(function(request, response) {});
server.listen(webSocketsServerPort, function() {
    console.log((new Date()) + " SpyfallServer is listening on port "
        + webSocketsServerPort);
});

/**
 * WebSocket server
 */
let wsServer = new webSocketServer({
    httpServer: server
});

const messageToAll = (self, message) => {
    clients.map(client => {
        if(client !== self) {
            client.send(message);
        }
    });
};

wsServer.on('request', request => {

    console.log((new Date()) + ' Connection from origin '
        + request.origin + '.');

    let connection = request.accept(null, request.origin);
    let index = clients.push(connection) - 1;

    console.log((new Date()) + ' Connection accepted.');

    connection.on('message', message => {

        history.push(message);

        messageToAll(connection, message.utf8Data);

    });

    connection.on('close', connection => {
        messageToAll(connection, JSON.stringify({
            from: 'system',
            message: 'Someone has left'
        }));
    });

});