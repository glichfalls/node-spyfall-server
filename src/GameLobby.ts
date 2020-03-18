import Player from "./Player";

const STATUS_WAITING = 0;
const STATUS_RUNNING = 1;
const STATUS_FINISHED = 2;

class GameLobby {

    private readonly id : string;
    private players : Array<Player> = [];
    private admin : Player;
    private spy : Player;
    private location : string;
    private locations : Array<any> = [];
    private duration : number;
    private timeLeft : number;
    private interval : any;
    private status : number;

    constructor(id: string, client: Player) {
        this.id = id;
        client.setIsAdmin(true);
        this.connect(client);
        this.admin = client;
        this.status = STATUS_WAITING;
    }

    public getId(): string
    {
        return this.id;
    }

    public connect(player : Player) : void
    {
        if(this.isConnected(player)) {
            throw new Error('You are already connected');
        }
        this.players.push(player);
        this.updateClients();
    }

    public disconnect(player: Player) : void
    {
        this.players = this.players.filter((connected : Player) => connected.getId() != player.getId());
        this.updateClients();
    }

    public isConnected = (player : Player) : boolean => this.players.find(
        (connected : Player) => connected.getId() === player.getId()
    ) !== undefined;

    private updateClients = () => this.players.map((player : Player) => {
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

    public start(player: Player): boolean
    {

        if(!player.isAdmin()) {
            throw new Error('You are not admin of this lobby');
        }

        this.status = STATUS_RUNNING;

        this.players.map((player : Player) => {
            player.setRole('random');
        });

        this.spy = this.players[Math.floor(Math.random() * this.players.length)];
        this.spy.setRole('spy');

        this.location = this.locations[Math.floor(Math.random() * this.locations.length) + 1];

        this.interval = setInterval(() => {
            if(this.players.length == 0) {
                this.finish();
            }
            if(this.timeLeft > 0) {
                this.timeLeft = this.timeLeft - 1;
                this.updateClients();
            } else {
                this.finish();
            }
        }, 1000);

        return true;
    }

    public finish()
    {
        clearInterval(this.interval);
        this.status = STATUS_FINISHED;
        this.updateClients();
    }

}

export default GameLobby;