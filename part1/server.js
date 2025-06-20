const express = require('express');
const mysql = require('mysql');
const app = express();
const port = 8080;

let db;
async function connectDB() {
    db = await mysql.
}