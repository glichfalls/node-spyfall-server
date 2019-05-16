"use strict";

process.title = 'node-spyfall';

const crypto = require('crypto');

let port = 1337;
let socketServer = require('websocket').server;
let http = require('http');

let server = http.createServer();
server.listen(port, () => {
    console.log((new Date()) + ' SpyfallServer is listening on port ' + port);
});

let wsServer = new socketServer({
    httpServer: server
});

let games = {};

wsServer.on('request', request => {

    let connection = request.accept(null, request.origin);

    connection.on('message', message => {

        let data = JSON.parse(message.utf8Data);

        switch(data.type) {

            case 'create': {

                // Generate a random game id, make sure its unique
                let gameID = null;
                while(!gameID || gameID in games) {
                    gameID = crypto.randomBytes(16).toString('hex');
                }

                let clients = {};
                clients[data.name] = connection;

                // add lobby to the open games
                games.gameID = {
                    id: gameID,
                    connections: clients
                };

                // send a response to the client
                connection.send(JSON.stringify({
                    type: 'create',
                    status: 200,
                    id: gameID,
                    clients: Object.keys(clients)
                }));

                break;
            }

            case 'join': {

                let gameID = data.id;
                let name = data.name;

                if(!gameID in games) {
                    connection.send(JSON.stringify({
                        type: 'error',
                        status: 400,
                        message: 'Game with id ' + gameID + ' does not exist'
                    }));
                }

                let lobby = games.gameID;

                if(!connection in lobby.connections) {
                    lobby.connections.send(JSON.stringify({
                        type: 'message',
                        message: 'User joined game'
                    }));
                    lobby.connections[name] = connection;
                }

                connection.send(JSON.stringify({
                    type: 'join',
                    status: 200,
                    id: gameID,
                    clients: Object.keys(lobby.connections)
                }));



                updateClients(gameID, {
                    type: 'update',
                    clients: clients
                })
                Object.values(lobby.connections).map(client => {
                    client.send(JSON.stringify({
                        type: 'update',
                        clients: Object.keys(lobby.connections)
                    }));
                });

                break;

            }


            default: {

                connection.send(JSON.stringify({
                    type: 'error',
                    message: 'unknown message type "' + data.type + '"'
                }));

            }


        }

    });

});

function updateClients(gameID) {
    let lobby = games[gameID];
    Object.values(lobby.connections).map(client => {
        client.send(JSON.stringify({
            type: 'update',
            clients: Object.keys(lobby.connections)
        }));
    });
}
