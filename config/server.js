import express from "express";
import routes from "../app/routes/routes.js";
import { connectToDatabase } from './db.js';
import dotenv from 'dotenv';
import cors from 'cors';
import fetch from 'node-fetch';

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.use('/', routes);

export const startServer = async () => {
    await connectToDatabase();
    app.listen(port, () => {
        console.log(`Server started on port ${port}`);
        setInterval(() => {
        fetch(process.env.URL)
            .then(() => console.log('Self-ping sent'))
            .catch(err => console.error('Ping failed:', err));
        }, 14 * 60 * 1000);
    });
};
