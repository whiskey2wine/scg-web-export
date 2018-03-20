// import open from 'open';

const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const bodyParser = require('body-parser');
const moment = require('moment');

const query = require('./db/query');

const port = 3000;
const publicPath = path.join(__dirname, '../public');
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(publicPath));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

io.on('connection', (socket) => {
  console.log(`New user connected [${socket.request.connection.remoteAddress}]`);

  socket.on('triggerUpdate', (data) => {
    console.log('Data has been updated.');
    io.emit('updateChart', data);
  });
});

app.get('/', (req, res) => {
  // res.sendFile(`${__dirname}/public/index.html`);
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
    select * from [Export_Transaction] as t1
    where location = '${req.params.pm}'
    and load_date = '${moment().format('YYYY-MM-DD')}'
    and t1.timestamp = (select max(t2.timestamp) from [Export_Transaction] as t2 where t2.PINo = t1.PINo);
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

app.post('/update', (req, res) => {
  if (req.body.completed / req.body.total === 1) {
    req.body.complete_status = 1;
  } else {
    req.body.complete_status = 0;
  }
  query.updateQ(`
  insert into [Export_Transaction] (PINo, location, shipping, single, mix, booked, noaction, loading, completed, comment, load_date, excel_date, complete_status)
  values ('${req.body.PINo}', '${req.body.location}', '${req.body.shipping}', ${req.body.single}, ${
  req.body.mix
}, ${req.body.booked}, ${req.body.noaction}, 
  ${req.body.loading}, ${req.body.completed}, REPLACE('${req.body.comment}', 'null', ''), '${
  req.body.load_date
}', '${req.body.excel_date}', ${req.body.complete_status});
`);
  query
    .update()
    .then((response) => {
      res.send('updated');
    })
    .catch((e) => {
      console.log(e);
    });
});

server.listen(port, (err) => {
  if (err) {
    console.log('error', err);
  } else {
    console.log(`Server is running on port ${port}`);
  }
});
