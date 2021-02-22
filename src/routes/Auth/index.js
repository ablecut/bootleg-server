const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { EXPIRE } = require('../../config/constants');
const User = require('../../models/User');
const Token = require('../../models/Token');

const router = new express.Router();

router.post('/signup', async (req, res) => {
  try {
    const { username, password, signupSecret } = req.body;
    if (signupSecret !== process.env.SIGNUP_SECRET) {
      throw ({
        customMessage: 'Invalid Signup Secret',
        statusCode: 400
      });
    }
    const saltRounds = 10;
    const passHash = await bcrypt.hash(password, saltRounds);
    const user = new User({
      username,
      password: passHash
    });
    await user.save();
    const responseData = {
      message: 'User Created Successfully'
    };
    res.status(200).send(responseData);
  }
  catch(err) {
    const responseData = {
      error:err.customMessage || 'INTERNAL SERVER ERROR'
    };
    res.status(err.statusCode || 500).send(responseData);
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({username});
    
    if (!user) throw({
      customMessage: 'User not found',
      statusCode: 400
    });
    
    const isPassValid = await bcrypt.compare(password, user.password);

    if (!isPassValid) throw({
      customMessage: 'Invalid Password',
      statusCode: 400
    });

    const authToken = await jwt.sign({
      id: user._id,
      username
    }, process.env.JWT_SECRET);

    const token = new Token({
      value: authToken,
      owner: user._id
    });

    await token.save();

    const responseData = {
      message: 'Login Successfull',
      data: {
        username
      }
    }

    res.cookie('Authentication', token, {maxAge: new Date(EXPIRE)});
    res.status(200).send(responseData);
  }
  catch(err){
    const responseData = {
      customMessage: err.customMessage || 'INTERNAL SERVER ERROR'
    };

    res.status(err.statusCode || 500).send(responseData);
  }
})

module.exports = router;