import GameLobby from "./GameLobby";
import Player from "./Player";
import {Command} from "../interfaces/CommandInterface";
import {randomBytes} from "crypto";

const COMMAND_JOIN : number = 0;
const COMMAND_CREATE : number = 1;
const COMMAND_LEAVE : number = 2;
const COMMAND_START : number = 3;

class GameServer {

    private lobbies: Array<GameLobby> = [];
    private readonly locations: Array<string> = [
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

    public process = (player : Player, command : Command) : void => {

        let lobby : GameLobby;

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


        } catch (e) {
            player.getConnection().send(JSON.stringify({
                status: 500,
                message: e.message
            }));
        }

    };

    private createLobby = (admin : Player) => {
        let id : string;
        while(!id || this.lobbyExist(id)) {
            id = randomBytes(8).toString('hex').slice(0, 8);
        }
        const lobby : GameLobby = new GameLobby(id, admin);
        this.lobbies.push(lobby);
        return lobby;
    };

    public lobbyExist = (id : string) : boolean => this.lobbies.find((lobby: GameLobby) => lobby.getId() === id) !== undefined;

    public getLobby = (id : string): GameLobby => {
        const lobby = this.lobbies.find((lobby: GameLobby) => lobby.getId() === id);
        if(lobby === undefined) {
            throw new Error('Lobby ' + id + ' does not exist');
        }
        return lobby;
    };

}

export default GameServer;