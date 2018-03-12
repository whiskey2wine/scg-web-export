// import open from 'open';

const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const query = require('./db/query');

const port = 3000;
const publicPath = path.join(__dirname, '../public');
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('New user connected');
});

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/public/index.html`);
});

app.get('/getdata', (req, res) => {
  query
    .data()
    .then((data) => {
      res.send(data);
    })
    .catch((e) => {
      console.log(e);
    });
});

app.get('/getdata/:pm', (req, res) => {
  // res.send(req.params);
  query.q(`
    select * from [Export_Transaction]
    where location = '${req.params.pm}'
  `);
  query
    .data()
    .then((data) => {
      res.send(data);
    })
    .catch((e) => {
      console.log(e);
    });
});

server.listen(port, (err) => {
  if (err) {
    console.log('error', err);
  } else {
    console.log(`http://localhost:${port}`);
  }
});
