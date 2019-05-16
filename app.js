"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SpyfallServer_1 = require("./SpyfallServer");
const Message_1 = require("./Message");
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
const gameServer = new SpyfallServer_1.default();
const connections = [];
wsServer.on('request', (request) => {
    let connection = request.accept(null, request.origin);
    connection.id = crypto.randomBytes(64).toString('hex');
    connections.push(connection);
    connection.on('message', (message) => {
        console.log(message.utf8Data);
        let handler = new Message_1.default(connection, message.utf8Data);
        try {
            if (handler.process(gameServer)) {
                connection.send(JSON.stringify({
                    type: 'response',
                    action: handler.getType(),
                    status: 200
                }));
            }
            else {
                connection.send(JSON.stringify({
                    type: 'response',
                    action: handler.getType(),
                    status: 400
                }));
            }
        }
        catch (e) {
            connection.send(JSON.stringify({
                type: 'response',
                action: handler.getType(),
                status: 500
            }));
        }
    });
});
//# sourceMappingURL=app.js.map