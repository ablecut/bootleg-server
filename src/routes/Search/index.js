const express = require('express');
const { YTSearcher } = require('ytsearcher');

const auth = require('../../middlewares/Authentication');

const router = new express.Router();

const searcher = new YTSearcher({
  key: process.env.YT_API
});

const generateSearchResponse = (searchResult, searchQuery) => {

  const searchData = searchResult.currentPage.map((item) => {
    return {
      url: item.url,
      thumbnail: item.thumbnails.high.url,
      title: item.title,
      channelName: item.channelTitle
    }
  })

  const searchResponse = {
    nextPageToken: searchResult.nextPageToken,
    searchData,
    searchQuery
  }

  return searchResponse;
}

router.get('/search', auth ,async (req, res) => {
  try {
    const { searchQuery, pageToken } = req.query;

    if (!searchQuery) {
      throw {
        customMessage: 'Search Query Required',
        statusCode: 400
      }
    }

    if (!pageToken) {
      const searchResult = await searcher.search(searchQuery, {type:'video'});
      res.status(200).send(generateSearchResponse(searchResult, searchQuery));
    }

    const searchResult = await searcher.search(searchQuery, {
      type: 'video',
      pageToken
    });
    res.status(200).send(generateSearchResponse(searchResult, searchQuery));
  }
  catch (err) {
    console.log('Error In Search', err);
    const errResponse = {
      error: err.customMessage || 'Internal Server Error'
    }
    res.status(err.statusCode || 500).send(errResponse);
  }
});

module.exports = router;
