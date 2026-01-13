"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseMiddleware = void 0;
const db_1 = require("../lib/db");
const databaseMiddleware = (req, res, next) => {
    req.db = db_1.db;
    next();
};
exports.databaseMiddleware = databaseMiddleware;
