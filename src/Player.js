"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var crypto_1 = require("crypto");
var Player = /** @class */ (function () {
    function Player(connection) {
        this.id = crypto_1.randomBytes(64).toString('hex');
        this.connection = connection;
    }
    Player.prototype.getId = function () {
        return this.id;
    };
    Player.prototype.getConnection = function () {
        return this.connection;
    };
    Player.prototype.setName = function (name) {
        this.name = name;
    };
    Player.prototype.getName = function () {
        return this.name;
    };
    Player.prototype.setRole = function (role) {
        this.role = role;
    };
    Player.prototype.getRole = function () {
        return this.role;
    };
    Player.prototype.setIsAdmin = function (admin) {
        this.admin = admin;
    };
    Player.prototype.isAdmin = function () {
        return this.admin;
    };
    return Player;
}());
exports.default = Player;
