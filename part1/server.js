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
        
    }
}