"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GameLobby_1 = require("./GameLobby");
var crypto_1 = require("crypto");
var COMMAND_JOIN = 0;
var COMMAND_CREATE = 1;
var COMMAND_LEAVE = 2;
var COMMAND_START = 3;
var GameServer = /** @class */ (function () {
    function GameServer() {
        var _this = this;
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
        this.process = function (player, command) {
            var lobby;
            try {
                console.log('player:', player);
                console.log('command:', command);
                console.log('lobbies:', _this.lobbies);
                if (command.game.id) {
                    lobby = _this.getLobby(command.game.id);
                }
                if (command.player.name) {
                    player.setName(command.player.name);
                }
                switch (command.command) {
                    case COMMAND_CREATE:
                        lobby = _this.createLobby(player);
                        console.log('created: ', lobby);
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
                console.log('error!', e.message);
                player.getConnection().send(JSON.stringify({
                    status: 500,
                    message: e.message
                }));
            }
        };
        this.createLobby = function (admin) {
            var id;
            while (!id || _this.lobbyExist(id)) {
                id = crypto_1.randomBytes(8).toString('hex').slice(0, 8);
            }
            var lobby = new GameLobby_1.default(id, admin);
            _this.lobbies.push(lobby);
            return lobby;
        };
        this.lobbyExist = function (id) { return _this.lobbies.find(function (lobby) { return lobby.getId() === id; }) !== undefined; };
        this.getLobby = function (id) {
            var lobby = _this.lobbies.find(function (lobby) { return lobby.getId() === id; });
            if (lobby === undefined) {
                throw new Error('Lobby ' + id + ' does not exist');
            }
            return lobby;
        };
    }
    return GameServer;
}());
exports.default = GameServer;
