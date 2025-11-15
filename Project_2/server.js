const express = require('express');
const { Pool } = require('pg');
const app = express();
const port = 3000;

const pool = new Pool({
  user: 'postgres',       
  host: 'localhost',
  database: 'my_database',      
  password: 'your_password',   
  port: 5432,
});


app.get('/data', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM your_table'); 
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error accessing database');
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
