const express = require('express');
const { YTSearcher } = require('ytsearcher');
const ytdl = require('ytdl-core');

const auth = require('../../middlewares/Authentication');

const router = new express.Router();

const searcher = new YTSearcher({
  key: process.env.YT_API
});

const generateSearchResponse = async (searchResult, searchQuery) => {

  const promises = searchResult.currentPage.map((item) => {
    return ytdl.getBasicInfo(item.url);
  })

  const basicInfo = await Promise.all(promises);

  const searchData = [];

  basicInfo.forEach((item, index) => {
    searchData.push({
      url: searchResult.currentPage[index].url,
      thumbnail: searchResult.currentPage[index].thumbnails.medium.url,
      title: searchResult.currentPage[index].title,
      channelName: searchResult.currentPage[index].channelTitle,
      duration: item.videoDetails.lengthSeconds
    })
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
      const generatedResponse = await generateSearchResponse(searchResult, searchQuery);
      res.status(200).send(generatedResponse);
      return;
    }

    const searchResult = await searcher.search(searchQuery, {
      type: 'video',
      pageToken
    });
    const generatedResponse = await generateSearchResponse(searchResult, searchQuery);
    res.status(200).send(generatedResponse);
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
