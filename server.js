require('dotenv').config();
require('./config/database');
const express = require('express');
const morgan = require('morgan');
const verifyToken = require('./middleware/verify-token');
const cors = require('cors');


// Controllers
const testJWTRouter = require('./controllers/test-jwt');
const usersRouter = require('./controllers/users');
const profilesRouter = require('./controllers/profiles');

const app = express();
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

// Public Routes
app.use('/test-jwt', testJWTRouter);
app.use('/users', usersRouter);

// Protected Routes
app.use(verifyToken);
app.use('/profiles', profilesRouter);

app.listen(3000, () => {
  console.log('The express app is ready!');
});