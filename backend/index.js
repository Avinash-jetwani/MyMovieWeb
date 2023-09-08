// To set up basic Express server
const express = require('express');
const app = express();
const port = 3001;  // You can choose any port number

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

// To connect to MongoDB
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb://localhost:27017/myMovieDB";  // Replace with your MongoDB URI

MongoClient.connect(uri, function(err, client) {
    if(err) {
      console.log('Error occurred while connecting to MongoDB Atlas...\n', err);
    }
    console.log('Connected...');
    client.close();
  });
  

// API endpoint
app.get('/movies', (req, res) => {
    // For now, let's return a static array
    res.json([
      { title: 'Inception', year: 2010 },
      { title: 'Interstellar', year: 2014 }
    ]);
  });
  
  