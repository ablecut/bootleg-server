const express = require('express');
const ytdl = require('ytdl-core');

const auth = require('../../middlewares/Authentication');

const router = new express.Router();

router.post('/play', auth, async (req, res) => {
  try {
    const link = req.body.url;  

    if (!link) {
      throw {
        customMessage: 'URL must be provided',
        statsCode: 400
      }
    }

    const stream = await ytdl(link, {
      filter: 'audioonly'
    })

    stream.on('data', (chunk) => {
      res.write(chunk);
    })

    stream.on('end', () => {
      res.end();
    })

  }
  catch(err) {
    console.log('Error occured in play', err);
    const errResponse = {
      error: err.customMessage || "Internal Server Error"
    }
    res.status(err.statusCode || 500).send(errResponse);
  }
})

module.exports = router;