import {connection} from "websocket";
import {randomBytes} from "crypto";

class Player {

    private readonly id : string;
    private readonly connection : connection;
    private name: string | undefined;
    private admin : boolean | undefined;
    private role: string | undefined;

    constructor(connection : connection)
    {
        this.id = randomBytes(64).toString('hex');
        this.connection = connection;
    }

    public getId() : string
    {
        return this.id;
    }

    public getConnection() : connection
    {
        return this.connection;
    }

    public setName(name : string) : void
    {
        this.name = name;
    }

    public getName() : string
    {
        return this.name;
    }

    public setRole(role : string) : void
    {
        this.role = role;
    }

    public getRole() : string | undefined
    {
        return this.role;
    }

    public setIsAdmin(admin : boolean) : void
    {
        this.admin = admin;
    }

    public isAdmin() : boolean
    {
        return this.admin;
    }

}

export default Player;