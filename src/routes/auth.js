const express = require('express');
const router = express.Router();
const { User, Person } = require('../../models');
const { Op } = require('sequelize');

router.post('/register', async (req, res) => {
  try{
    const {
      name,
      lastname,
      email,
      gender,
      birthdate,
      username,
      password 
    } = req.body;

    // Validate request body
    if (
      !name || !lastname ||
      !email || !gender ||
      !birthdate ||
      !username || !password
    ) {
      return res.status(400).json({ error: 'Please complete the required fields' });
    }

    // Validate email format
    if(!email.includes('@') || !email.includes('.')) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      where: { username },
      paranoid: false // Include soft-deleted records in the search
    });

    const existingEmail = await Person.findOne({
      where: { email },
      paranoid: false, // Include soft-deleted records in the search
    });

    if (existingEmail) {
      return res.status(409).json({ error: 'Email already exists' });
    }

    if (existingUser) {
      return res.status(409).json({ error: 'Username already exists' });
    }
    // Create person first
    const person = await Person.create({
      name,
      lastname,
      email,
      gender,
      birthdate
    });

    // Create user with the person_id from the created person
    // This ensures that the user is linked to the person record
    const user = await User.create({ person_id: person.id, username, password });

    // Generate JWT token for the new user
    // This token can be used for subsequent authenticated requests
    // The token is generated using the user's information and a secret key
    // The secret key should be stored securely in environment variables or a secure vault
    const token = user.generateAuthToken();

    res.status(201).json({ success: true , token, user: {
      person_id: user.person_id,
      name: person.name,
      lastname: person.lastname,
      email: person.email
    }});
  }
  catch(err)
  {
    res.status(500).json({ error: err.message });
  }
})

router.post('/login', async (req, res) => {
  try{
    // Validate request body
    // Ensure that username and password are provided
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Check if user exists and validate password
    const user = await User.findOne({
      where: { username },
      include: [{ model: Person, attributes: ['name', 'lastname', 'email'] }]
    });

    if (!user) {
      return res.status(400).json({ error: 'User does not exists' });
    }

    const isValidUser = await user.validatePassword(password);
    
    if (!isValidUser)
      return res.status(401).json({ error: 'Invalid credentials' });

    // Generate JWT token
    const token = user.generateAuthToken();

    res.status(200)
    .json({
      success: true, token,
      user: {
        person_id: user.person_id,
        name: user.Person.name,
        lastname: user.Person.lastname,
        email: user.Person.email
      }
    });
  }
  catch(err)
  {
    // Handle any errors that occur during the login process
    res.status(500).json({ error: err.message });
  }
})

router.post('/logout', (req, res) => {
  // Invalidate the token on the client side
  // This is a placeholder as actual token invalidation logic would depend on your authentication strategy
  res.status(200).json({ success: true, message: 'Logged out successfully' });
})

module.exports = router