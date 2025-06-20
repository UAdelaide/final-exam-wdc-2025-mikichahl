const express = require('express');
const mysql = require('mysql');
const app = express();
const port = 8080;

let db;
async function connectDB() {
    db = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        database: 'DogWalkService'
    });
    console.log('Connected to DB');

    app.get('/api/dogs', async (req, res) => {
        try {
            const [rows] = await db.query(`
                SELECT d.name AS dog_name, d.size, u.username AS owner_username
            `)
        }
    })


}

