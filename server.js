const express = require('express')
const path = require('path')
const api = require('./routes')

const port = 3001
const app = express();

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended:true }));
app.use('/api', api);

app.use(express.static('public'));

app.get('/', (req, res) => (
    res.sendFile(path.join(__dirname,'/public/index.js'))
))

app.listen(port, () =>
  console.log(`App listening at http://localhost:${port}`)
);
