"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var STATUS_WAITING = 0;
var STATUS_RUNNING = 1;
var STATUS_FINISHED = 2;
var GameLobby = /** @class */ (function () {
    function GameLobby(id, client) {
        var _this = this;
        this.players = [];
        this.locations = [];
        this.isConnected = function (player) { return _this.players.find(function (connected) { return connected.getId() === player.getId(); }) !== undefined; };
        this.updateClients = function () { return _this.players.map(function (player) {
            player.getConnection().send(JSON.stringify({
                status: 200,
                message: 'OK',
                game: {
                    id: _this.id,
                    time: _this.duration,
                    status: _this.status,
                    location: _this.location,
                    players: _this.players.map(function (player) { return player.getName(); }),
                },
                player: {
                    name: player.getName(),
                    admin: player.isAdmin(),
                    role: player.getRole()
                },
                locations: _this.locations
            }));
        }); };
        this.id = id;
        client.setIsAdmin(true);
        this.connect(client);
        this.admin = client;
        this.status = STATUS_WAITING;
    }
    GameLobby.prototype.getId = function () {
        return this.id;
    };
    GameLobby.prototype.connect = function (player) {
        if (this.isConnected(player)) {
            throw new Error('You are already connected');
        }
        this.players.push(player);
        this.updateClients();
    };
    GameLobby.prototype.disconnect = function (player) {
        this.players = this.players.filter(function (connected) { return connected.getId() != player.getId(); });
        this.updateClients();
    };
    GameLobby.prototype.start = function (player) {
        var _this = this;
        if (!player.isAdmin()) {
            throw new Error('You are not admin of this lobby');
        }
        this.status = STATUS_RUNNING;
        this.players.map(function (player) {
            player.setRole('random');
        });
        this.spy = this.players[Math.floor(Math.random() * this.players.length)];
        this.spy.setRole('spy');
        this.location = this.locations[Math.floor(Math.random() * this.locations.length) + 1];
        this.interval = setInterval(function () {
            if (_this.players.length == 0) {
                _this.finish();
            }
            if (_this.timeLeft > 0) {
                _this.timeLeft = _this.timeLeft - 1;
                _this.updateClients();
            }
            else {
                _this.finish();
            }
        }, 1000);
        return true;
    };
    GameLobby.prototype.finish = function () {
        clearInterval(this.interval);
        this.status = STATUS_FINISHED;
        this.updateClients();
    };
    return GameLobby;
}());
exports.default = GameLobby;
