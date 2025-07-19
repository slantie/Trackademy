/*
* @file index.ts
* @description This file is the entry point of the application.
*/

import { env } from 'process';
import express from 'express';

const app = express();

if (env.NODE_ENV !== 'production') {
    const port = env.PORT || 4000;
    
    app.get('/', (req, res) => {
        res.send('NodeJS Backend running!');
    });
    
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}
else{
    app.get('/', (req, res) => {
        res.send('NodeJS Backend running in production!');
    });
    console.log('NodeJS Backend running in production!');
}