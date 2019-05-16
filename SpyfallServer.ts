import GameLobby from "./GameLobby";
import Client from "./Client";

const crypto = require('crypto');

class SpyfallServer {

    private lobbies: Array<GameLobby> = [];
    private readonly locations: Array<string> = [];

    constructor()
    {
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
    public getLobby(id: string): GameLobby
    {
        let lobby = this.lobbies.find((lobby: GameLobby) => lobby.getId() === id);
        if(lobby !== undefined) {
            return lobby;
        }
        throw new Error('Lobby ' + id + ' does not exist');
    }

    /**
     * Check if a lobby exist
     * @param id
     */
    public lobbyExist(id: string): boolean
    {
        if(!id) {
            return false;
        }
        return this.lobbies.find((lobby: GameLobby) => lobby.getId() === id) !== undefined;
    }

    /**
     * Create a new game lobby and add the creator as admin to the lobby
     * @param client
     */
    public create(client: Client): GameLobby
    {
        let id = undefined;
        while(!id || this.lobbyExist(id)) {
            id = crypto.randomBytes(8).toString('hex').slice(0, 8);
        }
        let lobby = new GameLobby(id, client);
        this.lobbies.push(lobby);
        this.configure(client, id, 10);
        return lobby;
    }

    /**
     * Add a client to a lobby, returns false if lobby does not exist or client already joined
     * @param client
     * @param id
     */
    public join(client: Client, id: string): boolean
    {
        if(this.lobbyExist(id)) {
            return this.getLobby(id).connect(client);
        }
        return false;
    }

    /**
     * Remove a client to a lobby, returns false if lobby does not exist or client is not listed
     * @param client
     * @param id
     */
    public leave(client: Client, id: string): boolean
    {
        if(this.lobbyExist(id)) {
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
    public configure(client: Client, id: string, duration: number)
    {
        if(this.lobbyExist(id)) {
            return this.getLobby(id).configure(client, this.locations, duration);
        }
        return false;
    }

    /**
     *
     * @param client
     * @param id
     */
    public start(client: Client, id: string): boolean
    {
        if(this.lobbyExist(id)) {
            return this.getLobby(id).start(client);
        }
        return false;
    }


}

export default SpyfallServer;