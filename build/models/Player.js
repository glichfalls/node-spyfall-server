"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
class Player {
    constructor(connection) {
        this.id = crypto_1.randomBytes(64).toString('hex');
        this.connection = connection;
    }
    getId() {
        return this.id;
    }
    getConnection() {
        return this.connection;
    }
    setName(name) {
        this.name = name;
    }
    getName() {
        return this.name;
    }
    setRole(role) {
        this.role = role;
    }
    getRole() {
        return this.role;
    }
    setIsAdmin(admin) {
        this.admin = admin;
    }
    isAdmin() {
        return this.admin;
    }
}
exports.default = Player;
//# sourceMappingURL=Player.js.map