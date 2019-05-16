import * as SocketIO from "socket.io";

class Client {

    private connection: any;
    private readonly name: string;

    constructor(connection: any, name: string)
    {
        this.connection = connection;
        this.name = name;
    }

    public getId(): number
    {
        return this.connection.id;
    }

    public getName(): string
    {
        return this.name;
    }

    public send(message: string): void
    {
        console.log('sending message `'+message+'` to `'+this.name+'`');
        this.connection.send(message);
    }

}

export default Client;