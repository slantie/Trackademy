"use strict";
/*
* @file index.ts
* @description This file is the entry point of the application.
*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const process_1 = require("process");
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
if (process_1.env.NODE_ENV !== 'production') {
    const port = process_1.env.PORT || 4000;
    app.get('/', (req, res) => {
        res.send('NodeJS Backend running!');
    });
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}
else {
    app.get('/', (req, res) => {
        res.send('NodeJS Backend running in production!');
    });
    console.log('NodeJS Backend running in production!');
}
