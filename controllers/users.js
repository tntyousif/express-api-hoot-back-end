const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const router = express.Router();

router.post('/signup', async (req, res) => {
  try {
    const userInDatabase = await User.findOne({ username: req.body.username });

    if (userInDatabase) throw new Error('Username already taken.');

    // if user doesnt exist, create a user
    const user = await User.create({
      username: req.body.username,
      hashedPassword: bcrypt.hashSync(req.body.password, parseInt(process.env.SALT_ROUNDS)),
    });

    const token = jwt.sign({ username: user.username, _id: user._id }, process.env.JWT_SECRET);

    res.status(201).json({ user, token });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Something Went wrong!' });
  }
});

router.post('/signin', async (req, res) => {
  try {
    // look up user to see if they exist
    const user = await User.findOne({ username: req.body.username });

    // check if user is there and password is good
    if (user && bcrypt.compareSync(req.body.password, user.hashedPassword)) {
      const token = jwt.sign({ username: user.username, _id: user._id }, process.env.JWT_SECRET);

      res.json({ token });
    } else {
      throw new Error('Invalid Credentials');
    }
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ error: 'Invalid Credentials' });
  }
});

module.exports = router;