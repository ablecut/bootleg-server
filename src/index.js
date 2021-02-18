const express = require('express');
const cors = require('cors');

const app = express();

app.use(express.json());

if (process.env.MODE === 'PROD') {
  app.use(cors());
}

app.listen(process.env.PORT || 8080);