"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameServer_1 = __importDefault(require("./models/GameServer"));
const websocket_1 = require("websocket");
const http_1 = require("http");
const Player_1 = __importDefault(require("./models/Player"));
process.title = 'node-spyfall';
const port = 1337;
const httpServer = http_1.createServer();
httpServer.listen(port, () => {
    console.log((new Date()) + ' SpyFall server is listening on port ' + port);
});
const wsServer = new websocket_1.server({
    httpServer: httpServer
});
const gameServer = new GameServer_1.default();
wsServer.on('request', (request) => {
    const player = new Player_1.default(request.accept(null, request.origin));
    player.getConnection().on('message', (message) => {
        if (message.type !== 'utf8') {
            return;
        }
        gameServer.process(player, JSON.parse(message.utf8Data));
    });
});
//# sourceMappingURL=app.js.map