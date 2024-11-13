const express = require('express');

const router = express.Router();
const User = require('../models/user');

// this will only pull the profile for the person that is
// signed in
router.get('/currentUser', async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error('Profile not found.');
    }
    res.json({ user });
  } catch (error) {
    if (res.statusCode === 404) {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// Allow all signed in users to view other people's profiles
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      res.status(404);
      throw new Error('Profile not found.');
    }
    res.json({ user });
  } catch (error) {
    if (res.statusCode === 404) {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// Allow all signed in users to view other people's profiles
router.get('/:userId/mine-only', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (req.user._id !== req.params.userId) {
      // check the ID of the user!
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!user) {
      res.status(404);
      throw new Error('Profile not found.');
    }
    res.json({ user });
  } catch (error) {
    if (res.statusCode === 404) {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

module.exports = router;