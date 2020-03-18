"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const STATUS_WAITING = 0;
const STATUS_RUNNING = 1;
const STATUS_FINISHED = 2;
class GameLobby {
    constructor(id, client) {
        this.players = [];
        this.locations = [];
        this.isConnected = (player) => this.players.find((connected) => connected.getId() === player.getId()) !== undefined;
        this.updateClients = () => this.players.map((player) => {
            player.getConnection().send(JSON.stringify({
                status: 200,
                message: 'OK',
                game: {
                    id: this.id,
                    time: this.duration,
                    status: this.status,
                    location: this.location,
                    players: this.players.map(player => player.getName()),
                },
                player: {
                    name: player.getName(),
                    admin: player.isAdmin(),
                    role: player.getRole()
                },
                locations: this.locations
            }));
        });
        this.id = id;
        client.setIsAdmin(true);
        this.connect(client);
        this.admin = client;
        this.status = STATUS_WAITING;
    }
    getId() {
        return this.id;
    }
    connect(player) {
        if (this.isConnected(player)) {
            throw new Error('You are already connected');
        }
        this.players.push(player);
        this.updateClients();
    }
    disconnect(player) {
        this.players = this.players.filter((connected) => connected.getId() != player.getId());
        this.updateClients();
    }
    start(player) {
        if (!player.isAdmin()) {
            throw new Error('You are not admin of this lobby');
        }
        this.status = STATUS_RUNNING;
        this.players.map((player) => {
            player.setRole('random');
        });
        this.spy = this.players[Math.floor(Math.random() * this.players.length)];
        this.spy.setRole('spy');
        this.location = this.locations[Math.floor(Math.random() * this.locations.length) + 1];
        this.interval = setInterval(() => {
            if (this.players.length == 0) {
                this.finish();
            }
            if (this.timeLeft > 0) {
                this.timeLeft = this.timeLeft - 1;
                this.updateClients();
            }
            else {
                this.finish();
            }
        }, 1000);
        return true;
    }
    finish() {
        clearInterval(this.interval);
        this.status = STATUS_FINISHED;
        this.updateClients();
    }
}
exports.default = GameLobby;
//# sourceMappingURL=GameLobby.js.map