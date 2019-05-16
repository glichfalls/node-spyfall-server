"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GameLobby_1 = require("./GameLobby");
const crypto = require('crypto');
class SpyfallServer {
    constructor() {
        this.lobbies = [];
        this.locations = [];
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
    }
    /**
     * Get a game lobby by id
     * @param id
     */
    getLobby(id) {
        let lobby = this.lobbies.find((lobby) => lobby.getId() === id);
        if (lobby !== undefined) {
            return lobby;
        }
        throw new Error('Lobby ' + id + ' does not exist');
    }
    /**
     * Check if a lobby exist
     * @param id
     */
    lobbyExist(id) {
        if (!id) {
            return false;
        }
        return this.lobbies.find((lobby) => lobby.getId() === id) !== undefined;
    }
    /**
     * Create a new game lobby and add the creator as admin to the lobby
     * @param client
     */
    create(client) {
        let id = undefined;
        while (!id || this.lobbyExist(id)) {
            id = crypto.randomBytes(8).toString('hex').slice(0, 8);
        }
        let lobby = new GameLobby_1.default(id, client);
        this.lobbies.push(lobby);
        this.configure(client, id, 10);
        return lobby;
    }
    /**
     * Add a client to a lobby, returns false if lobby does not exist or client already joined
     * @param client
     * @param id
     */
    join(client, id) {
        if (this.lobbyExist(id)) {
            return this.getLobby(id).connect(client);
        }
        return false;
    }
    /**
     * Remove a client to a lobby, returns false if lobby does not exist or client is not listed
     * @param client
     * @param id
     */
    leave(client, id) {
        if (this.lobbyExist(id)) {
            return this.getLobby(id).disconnect(client);
        }
        return false;
    }
    /**
     *
     * @param client
     * @param id
     * @param duration
     */
    configure(client, id, duration) {
        if (this.lobbyExist(id)) {
            return this.getLobby(id).configure(client, this.locations, duration);
        }
        return false;
    }
    /**
     *
     * @param client
     * @param id
     */
    start(client, id) {
        if (this.lobbyExist(id)) {
            return this.getLobby(id).start(client);
        }
        return false;
    }
}
exports.default = SpyfallServer;
//# sourceMappingURL=SpyfallServer.js.map