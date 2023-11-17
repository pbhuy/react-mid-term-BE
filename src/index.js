const express = require('express');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');

const connection = require('./config/database');
const router = require('./api/routes');
const { sendErr } = require('./api/helpers/response');

const app = express();
const port = process.env.PORT || 8080;

connection();

// cors
const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  exposedHeaders: 'Authorization',
};
app.use(cors(corsOptions));

// json parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// static routes
app.use('/images', express.static(path.join(__dirname, '/uploads')));

// logger
app.use(morgan('dev'));

// routes
app.use('/api', router);

// welcome
app.get('/', (req, res) => {
  res.send('<h1 style="text-align:center">Welcome to react-mid-term-api</h1>');
});

// handle errors
app.use((err, req, res, next) => {
  const status = err.status ? err.status : 500;
  const message = err.message ? err.message : 'Internal Server Error';
  sendErr(res, { status, message });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
