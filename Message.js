"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Client_1 = require("./Client");
class Message {
    constructor(connection, message) {
        this.message = JSON.parse(message);
        this.connection = connection;
        this.client = new Client_1.default(this.connection, this.message.name);
    }
    getType() {
        return this.message.type;
    }
    process(server) {
        switch (this.getType()) {
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
exports.default = Message;
//# sourceMappingURL=Message.js.map