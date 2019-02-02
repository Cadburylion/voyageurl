import express from 'express';
import path from 'path';
import http from 'http';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import message from '../routes/message.js';
import URL from '../models/url';
import URLroute from '../routes/url';
import Counter from '../models/counter';
import atob from 'atob';
import btoa from 'btoa';
let promise;

dotenv.config();
const app = express();

// Env variables
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// DB setup
promise = mongoose.connect(
  MONGODB_URI,
  { useNewUrlParser: true }
);

promise.then(db => {
  console.log('connected!');
  URL.deleteOne({}, () => {
    console.log('URL collection removed');
  });
  Counter.deleteOne({}, () => {
    console.log('Counter collection removed');
    let counter = new Counter({ _id: 'url_count', count: 10000 });
    counter.save(err => {
      if (err) return console.error(err);
      console.log('counter inserted');
    });
  });
});

// mongoose.connect(
//   MONGODB_URI,
//   { useNewUrlParser: true }
// );

// App setup
app.use(cors());
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../../build')));

// API endpoints
app.use('/api', message);
app.use('/shorten', URLroute);
app.get('/:hash', (req, res) => {
  let baseid = req.params.hash;
  // let id = atob(baseid);
  console.log('baseid: ', baseid);
  let id = Buffer.from(baseid.toString(), 'base64').toString('binary');
  console.log('id: ', id);
  URL.findOne({ _id: id }, (err, doc) => {
    if (doc) {
      console.log('***DOC.URL: ', doc.url);
      res.redirect(`http://${doc.url}`);
    } else {
      res.redirect('/');
    }
  });
});
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/../../build', 'index.html'));
});

const server = http.createServer(app);
server.listen(PORT, () => {
  console.log(`***SERVER UP AT PORT: ${PORT}`);
});
