const express = require('express');
const bcrypt = require('bcrypt');

const User = require('../../models/User');

const router = new express.Router();

router.post('/signup', async (req, res) => {
  try {
    const { username, password } = req.body;
    const saltRounds = 10;
    const passHash = await bcrypt.hash(password, saltRounds);
    const user = new User({
      username,
      password: passHash
    });
    await user.save();
    const responseBody = {
      message: 'User Created Successfully'
    };
    res.status(200).send(responseBody);
  }
  catch(err) {
    const responseBody = {
      error:err
    };
    res.status(500).send(responseBody);
  }
});

module.exports = router;