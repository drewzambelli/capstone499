// server.js

const express = require('express');
const mysql = require('mysql');

const app = express();
const port = 5173; //port number

// MySQL Connection
//TEAM! PLEASE NOTE, YOU MAY NEED TO USE YOUR OWN CREDENTIALS FOR THIS NEXT PART
//I"VE LABELED LINES 14, 15, 16 JUST IN CASE YOU NEED TO INSERT YOUR OWN STUFF
const db = mysql.createConnection({
  host: 'localhost',
  user: 'dzambelli', //MySQL username
  password: 'cappy499', // MySQL password
  database: 'capstone' // MySQL database name
});

// Connection to MySQL
db.connect(err => {
  if (err) {
    throw err;
  }
  console.log('Connected to MySQL database');
});

// Endpoint to check if user exists
app.get('/checkUserExists/:username', (req, res) => {
  const username = req.params.username;
  const sql = 'SELECT COUNT(*) AS count FROM locallyusers WHERE username = ?'; //need to insert my variable here regarding the user's name.

  db.query(sql, [username], (err, result) => {
    if (err) {
      console.error('Error checking user:', err);
      res.status(500).send({ error: 'Database error' });
    } else {
      const exists = result[0].count > 0;
      res.send({ exists });
    }
  });
});

// Attemp to start server up
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
