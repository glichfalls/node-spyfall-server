"use strict";

import SpyfallServer from "./SpyfallServer";
import Message from "./Message";

const crypto = require('crypto');

process.title = 'node-spyfall';

const port = 1337;
const socketServer = require('websocket').server;
const http = require('http');

const server = http.createServer();
server.listen(port, () => {
    console.log((new Date()) + ' Spyfall server is listening on port ' + port);
});

const wsServer = new socketServer({
    httpServer: server
});

const gameServer = new SpyfallServer();

const connections: Array<any> = [];

wsServer.on('request', (request: any) => {

    let connection = request.accept(null, request.origin);

    connection.id = crypto.randomBytes(64).toString('hex');

    connections.push(connection);

    connection.on('message', (message: any) => {

        console.log(message.utf8Data);

        let handler = new Message(connection, message.utf8Data);

        try {
            if (handler.process(gameServer)) {
                connection.send(JSON.stringify({
                    type: 'response',
                    action: handler.getType(),
                    status: 200
                }));
            } else {
                connection.send(JSON.stringify({
                    type: 'response',
                    action: handler.getType(),
                    status: 400
                }));
            }
        } catch (e) {
            connection.send(JSON.stringify({
                type: 'response',
                action: handler.getType(),
                status: 500
            }));
        }

    });
});