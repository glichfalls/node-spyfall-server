"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameLobby_1 = __importDefault(require("./GameLobby"));
const crypto_1 = require("crypto");
const COMMAND_JOIN = 0;
const COMMAND_CREATE = 1;
const COMMAND_LEAVE = 2;
const COMMAND_START = 3;
class GameServer {
    constructor() {
        this.lobbies = [];
        this.locations = [
            'Mt. Everest',
            'Florida beach',
            '1st World War',
            'Afghanistan',
            'North Korea',
            'Tijuana',
            'Moscow',
            'Berlin',
            '200 before Christ',
            'Crusades',
            'Hitler\'s bunker',
            'Year 3254',
            'Mars',
            'Atlantis',
            'Ancient Greece',
            'Shisha bar',
            'Somalia',
            'Space shuttle',
            'Texas'
        ];
        this.process = (player, command) => {
            let lobby;
            try {
                if (command.game.id) {
                    lobby = this.getLobby(command.game.id);
                }
                if (command.player.name) {
                    player.setName(command.player.name);
                }
                switch (command.command) {
                    case COMMAND_CREATE:
                        lobby = this.createLobby(player);
                        break;
                    case COMMAND_JOIN:
                        lobby.connect(player);
                        break;
                    case COMMAND_LEAVE:
                        lobby.disconnect(player);
                        break;
                    case COMMAND_START:
                        lobby.start(player);
                        break;
                }
            }
            catch (e) {
                player.getConnection().send(JSON.stringify({
                    status: 500,
                    message: e.message
                }));
            }
        };
        this.createLobby = (admin) => {
            let id;
            while (!id || this.lobbyExist(id)) {
                id = crypto_1.randomBytes(8).toString('hex').slice(0, 8);
            }
            const lobby = new GameLobby_1.default(id, admin);
            this.lobbies.push(lobby);
            return lobby;
        };
        this.lobbyExist = (id) => this.lobbies.find((lobby) => lobby.getId() === id) !== undefined;
        this.getLobby = (id) => {
            const lobby = this.lobbies.find((lobby) => lobby.getId() === id);
            if (lobby === undefined) {
                throw new Error('Lobby ' + id + ' does not exist');
            }
            return lobby;
        };
    }
}
exports.default = GameServer;
//# sourceMappingURL=GameServer.js.map