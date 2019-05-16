"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Client {
    constructor(connection, name) {
        this.connection = connection;
        this.name = name;
    }
    getId() {
        return this.connection.id;
    }
    getName() {
        return this.name;
    }
    send(message) {
        console.log('sending message `' + message + '` to `' + this.name + '`');
        this.connection.send(message);
    }
}
exports.default = Client;
//# sourceMappingURL=Client.js.map