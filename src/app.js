"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GameServer_1 = require("./GameServer");
var websocket_1 = require("websocket");
var http_1 = require("http");
var Player_1 = require("./Player");
process.title = 'node-spyfall';
var port = 1337;
var httpServer = http_1.createServer();
httpServer.listen(port, function () {
    console.log((new Date()) + ' Spyfall server is listening on port ' + port);
});
var wsServer = new websocket_1.server({
    httpServer: httpServer
});
var gameServer = new GameServer_1.default();
wsServer.on('request', function (request) {
    var player = new Player_1.default(request.accept(null, request.origin));
    player.getConnection().on('message', function (message) {
        if (message.type !== 'utf8') {
            return;
        }
        gameServer.process(player, JSON.parse(message.utf8Data));
    });
});
