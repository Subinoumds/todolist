const express = require('express');
const { Pool } = require('pg');
const app = express();
const port = 3000;

const pool = new Pool({
    user: 'postgres',
    host: 'db',
    database: 'todo',
    password: 'password',
    port: 5432,
});

app.use(express.json());

app.get('/tasks', async (req, res) => {
    const { rows } = await pool.query('SELECT * FROM tasks');
    res.json(rows);
});

app.post('/tasks', async (req, res) => {
    const { description } = req.body;
    await pool.query('INSERT INTO tasks (description) VALUES ($1)', [description]);
    res.status(201).send();
});

app.listen(port, () => {
    console.log(`Backend running on http://localhost:${port}`);
});