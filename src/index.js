const express = require('express');
require('dotenv').config();
const { sequelize } = require('../models')
const cors = require('cors');

// Routes
const authRouter = require('./routes/auth')
const userRouter = require('./routes/user')

// Middlewares
const authMiddleware = require('./middlewares/auth')

// Server configuration
const app = express()
const port = process.env.PORT || 8000;

app.use(express.json())
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*', // Allow all origins by default,
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specific HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
}));

app.use(
  ['/user', '/auth/logout'],
  authMiddleware
);

app.use('/auth', authRouter)

// User routes that require authentication
app.use('/user', userRouter)

// Root route for testing
// This route can be used to check if the server is running
// and to provide a simple welcome message
app.get('/', (req, res) => res.send('Welcome, this is a technical test API for building simple auth frontend applications'));

app.listen(port, async () => {
  // Database connection
  // This section attempts to connect to the database using Sequelize
  // If the connection is successful, a message is logged to the console
  // If there is an error, it is caught and logged
  try{
    await sequelize.authenticate();
    console.log("Database successfully connected")
  }
  catch(err){
    console.error("There was an error with the database execution:",err)
  }
  // Start the server and listen on the specified port
  console.log(`Server up on http://localhost:${port}`)
});