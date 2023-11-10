const express = require('express');
const cors = require('cors');
const path = require('path');
// const morgan = require('morgan');

const connection = require('./config/database');
const router = require('./api/routes');
const { sendErr } = require('./api/helpers/response');

const app = express();
const port = process.env.PORT || 8080;

// cors
const corsOptions = {
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
};
app.use(cors(corsOptions));

// json parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// static routes
app.use('/images', express.static(path.join(__dirname, '/uploads')));

// logger
// app.use(morgan('dev'));

// routes
app.use('/api', router);

// handle errors
app.use((err, req, res, next) => {
  const status = err.status ? err.status : 500;
  const message = err.message ? err.message : 'Internal Server Error';
  sendErr(res, { status, message });
});

connection().then(
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  }),
);
