import GameServer from "./models/GameServer";
import {IMessage, request, server} from "websocket";
import {Server, createServer} from "http";
import Player from "./models/Player";

process.title = 'node-spyfall';

const port : number = 1337;
const httpServer : Server = createServer();

httpServer.listen(port, () => {
    console.log((new Date()) + ' SpyFall server is listening on port ' + port);
});

const wsServer : server = new server({
    httpServer: httpServer
});

const gameServer = new GameServer();

wsServer.on('request', (request : request) => {

    const player = new Player(request.accept(null, request.origin));

    player.getConnection().on('message', (message: IMessage) => {

        if(message.type !== 'utf8') {
            return;
        }

        gameServer.process(player, JSON.parse(message.utf8Data));

    });
});