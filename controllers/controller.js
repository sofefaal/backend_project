const endpoint = require("../endpoints.json")
const {
    fetchTopics,
    fetchArticleId
} = require("../models/model")

function getTopics(req, res, next) {
    const topicArr = req.params
    return fetchTopics(topicArr)
    .then((topics) => {
        res.status(200).send({topics})
    })
    .catch((err) => {
        next(err)
    })
}

function getEndpoints(req, res, next) {
  res.status(200).send({ endpoint });
}

function getArticleById(req, res, next) {
    const articleArr = req.params
    return fetchArticleId(articleArr.article_id)
    .then((articles) => {
        res.status(200).send({articles: articles})
    })
    .catch((err) => {
        next(err)
    })
} 

module.exports = {
    getTopics, 
    getEndpoints,
    getArticleById
}