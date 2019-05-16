import Client from "./Client";

class GameLobby {

    private readonly id: string;
    private isConfigured: boolean;
    private clients: Array<Client> = [];
    private admin: Client;
    private spy: Client;
    private location: string;
    private locations: Array<any> = [];
    private startTime: string;
    private duration: number;
    private timeLeft: number;
    private interval: any;

    constructor(id: string, client: Client) {
        this.id = id;
        this.admin = client;
        this.isConfigured = false;
        this.connect(client);
    }

    public configure(client: Client, locations: Array<string>, duration: number): boolean
    {
        if(client.getId() !== this.admin.getId()) {
            console.log('cant configure, client no admin');
            return false;
        }
        if(isNaN(duration) || duration <= 0) {
            console.log('cant configure, duration is not a positive number');
            return false;
        }
        this.locations = locations;
        this.duration = duration;
        this.timeLeft = duration * 60;
        this.isConfigured = true;
        return true;
    }

    public getId(): string
    {
        return this.id;
    }

    public connect(client: Client): boolean
    {
        if(!this.isConnected(client)) {
            this.clients.push(client);
            this.updateClients();
            return true;
        }
        return false;
    }

    public isConnected(new_client: Client)
    {
        return this.clients.find((client: Client) => client.getId() === new_client.getId()) !== undefined;
    }

    /**
     * Remove client from client list
     * @param client
     * @return boolean
     */
    public disconnect(client: Client): boolean
    {
        let index = this.clients.indexOf(client);
        if(index !== -1){
            this.clients.splice(index, 1);
            this.updateClients();
            return true;
        }
        return false;
    }

    private isAdmin(client: Client): boolean
    {
        return client.getId() == this.admin.getId();
    }

    /**
     * Update all clients with the latest game status
     */
    public updateClients()
    {
        console.log('updating clients ...');
        this.clients.map((client: Client) => {
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

    public start(client: Client): boolean
    {
        if(!this.isConfigured || client.getId() !== this.admin.getId()) {
            console.log('cant start game, not configured');
            console.log('admin id: '+ this.admin.getId() + ', client id: '+client.getId());
            return false;
        }
        this.spy = this.clients[Math.floor(Math.random() * this.clients.length) + 1];
        this.location = this.locations[Math.floor(Math.random() * this.locations.length) + 1];
        this.interval = setInterval(() => {
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
        this.updateClients();
    }

}

export default GameLobby;