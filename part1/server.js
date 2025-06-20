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
}

async function seedData() {
    try {
        const [users] = await db.query("SELECT COUNT(*) AS count FROM Users");
        if (users[0].count === 0) {
            await.db.query(`
            INSERT INTO Users (username, email, password_hash, role) VALUES
            ('alice123', 'alice@example.com', 'hashed123', 'owner'),
('bobwalker', 'bob@example.com', 'hashed456', 'walker'),
('carol123', 'carol@example.com', 'hashed321', 'owner'),
            `)
        }
    }
}