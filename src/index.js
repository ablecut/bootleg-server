const express = require('express');
const cors = require('cors');

require('./config/database');
const Auth = require('./routes/Auth');

const app = express();

app.use(express.json());
app.use(Auth);

if (process.env.MODE === 'PROD') {
  app.use(cors());
}

app.listen(process.env.PORT || 8080);