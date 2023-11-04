const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.DB_URI
  ? process.env.DB_URI
  : process.env.DB_URI_LOCAL + process.env.DB_NAME;
const db_name = process.env.DB_NAME;

const connection = async () => {
  try {
    await mongoose.connect(`${uri}/${db_name}`);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};

module.exports = connection;
