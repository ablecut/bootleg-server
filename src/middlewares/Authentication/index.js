const jwt = require('jsonwebtoken');

const Token = require('../../models/Token');

const auth = async (req, res, next) => {
  try{
    const token = req.header('Authentication');
    
    const {id, username} = jwt.verify(token, process.env.JWT_SECRET);

    const tokenData = await Token.findOne({ value:token }).select({ owner:1 });

    if (tokenData?.owner.toString() !== id.toString()) {
      throw new Error;
    }

    req.authData = {
      id: id,
      username: username,
      token: token
    }

    next();
  }
  catch(err) {
    const response = {
      error: 'Not Authorized'
    }

    res.clearCookie('Authentication');
    res.clearCookie('username');
    res.status(401).send(response);
  }
}

module.exports = auth;