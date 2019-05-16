"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GameLobby {
    constructor(id, client) {
        this.clients = [];
        this.locations = [];
        this.id = id;
        this.admin = client;
        this.isConfigured = false;
        this.connect(client);
    }
    configure(client, locations, duration) {
        if (client.getId() !== this.admin.getId()) {
            console.log('cant configure, client no admin');
            return false;
        }
        if (isNaN(duration) || duration <= 0) {
            console.log('cant configure, duration is not a positive number');
            return false;
        }
        this.locations = locations;
        this.duration = duration;
        this.timeLeft = duration * 60;
        this.isConfigured = true;
        return true;
    }
    getId() {
        return this.id;
    }
    connect(client) {
        if (!this.isConnected(client)) {
            this.clients.push(client);
            this.updateClients();
            return true;
        }
        return false;
    }
    isConnected(new_client) {
        return this.clients.find((client) => client.getId() === new_client.getId()) !== undefined;
    }
    /**
     * Remove client from client list
     * @param client
     * @return boolean
     */
    disconnect(client) {
        let index = this.clients.indexOf(client);
        if (index !== -1) {
            this.clients.splice(index, 1);
            this.updateClients();
            return true;
        }
        return false;
    }
    isAdmin(client) {
        return client.getId() == this.admin.getId();
    }
    /**
     * Update all clients with the latest game status
     */
    updateClients() {
        console.log('updating clients ...');
        this.clients.map((client) => {
            client.send(JSON.stringify({
                type: 'update',
                id: this.id,
                clients: this.clients.map(client => client.getName()),
                spy: this.spy ? this.spy.getName() : null,
                location: this.location,
                locations: this.locations,
                startTime: this.startTime,
                duration: this.duration,
                timeLeft: this.timeLeft,
                isAdmin: this.isAdmin(client)
            }));
        });
    }
    start(client) {
        if (!this.isConfigured || client.getId() !== this.admin.getId()) {
            console.log('cant start game, not configured');
            console.log('admin id: ' + this.admin.getId() + ', client id: ' + client.getId());
            return false;
        }
        this.spy = this.clients[Math.floor(Math.random() * this.clients.length) + 1];
        this.location = this.locations[Math.floor(Math.random() * this.locations.length) + 1];
        this.interval = setInterval(() => {
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
        this.updateClients();
    }
}
exports.default = GameLobby;
//# sourceMappingURL=GameLobby.js.map