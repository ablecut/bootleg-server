const express = require('express');
const cors = require('cors');

require('./config/database');
const Auth = require('./routes/Auth');
const Search = require('./routes/Search');
const Play = require('./routes/Play');

const app = express();

app.use(express.json());
app.use(Auth);
app.use(Search);
app.use(Play);

if (process.env.MODE === 'PROD') {
  app.use(cors());
}

app.listen(process.env.PORT || 8080);