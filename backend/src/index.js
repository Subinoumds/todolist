require('dotenv').config(); 
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const app = express();

const port = process.env.BACKEND_PORT || 3000;

const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT,
});

app.use(cors({
    origin: process.env.FRONTEND_URL.replace(/\/$/, ''),
    methods: ['GET', 'POST', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type']
}));

app.use(express.json());

app.get('/tasks', async (req, res) => {
    const { filter } = req.query;
    let query = 'SELECT * FROM tasks';
    if (filter === 'active') query += ' WHERE completed = false';
    if (filter === 'completed') query += ' WHERE completed = true';
    const { rows } = await pool.query(query);
    res.json(rows);
});

app.post('/tasks', async (req, res) => {
    const { description } = req.body;
    await pool.query('INSERT INTO tasks (description) VALUES ($1)', [description]);
    res.status(201).send();
});

app.delete('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
    res.status(204).send();
});

app.patch('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    const { completed } = req.body;
    await pool.query('UPDATE tasks SET completed = $1 WHERE id = $2', [completed, id]);
    res.status(200).send();
});

app.listen(port, () => {
    console.log(`Backend running on http://localhost:${port}`);
});