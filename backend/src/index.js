const express = require('express');
const { Pool } = require('pg');
const cors = require('cors'); // Importe le middleware CORS
const app = express();
const port = 3000;

const pool = new Pool({
    user: 'postgres',
    host: 'db',
    database: 'todo',
    password: 'password',
    port: 5432,
});

app.use(cors({
    origin: 'http://localhost:8080', 
    methods: ['GET', 'POST', 'DELETE', 'PUT'], 
}));

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

app.delete('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
        res.status(204).send(); // 204 = No Content (succès sans retour de données)
    } catch (error) {
        console.error('Erreur lors de la suppression de la tâche:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

app.listen(port, () => {
    console.log(`Backend running on http://localhost:${port}`);
});