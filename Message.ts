import SpyfallServer from "./SpyfallServer";
import Client from "./Client";

class Message {

    private readonly connection: any;
    private readonly message: any;
    private readonly client: Client;

    constructor(connection: any, message: any)
    {
        this.message = JSON.parse(message);
        this.connection = connection;
        this.client = new Client(this.connection, this.message.name);
    }

    public getType(): string
    {
        return this.message.type;
    }

    public process(server: SpyfallServer)
    {
        switch(this.getType()) {

            case 'create': {
                return server.create(this.client);
            }

            case 'join': {
                return server.join(this.client, this.message.lobbyid);
            }

            case 'leave': {
                return server.leave(this.client, this.message.clientid);
            }

            case 'configure': {
                return server.configure(this.client, this.message.lobbyid, this.message.duration);
            }

            case 'start': {
                return server.start(this.client, this.message.lobbyid);
            }

            default: {
                throw new Error('Unknown message type');
            }

        }
    }

}

export default Message;