const endpoint = require("../endpoints.json")
const fetchTopics = require("../models/topics.model")
const {fetchArticleId, fetchAllArticles} = require("../models/articles.model")

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
    const article = req.params
    return fetchArticleId(article.article_id)
    .then((article) => {
        res.status(200).send({article: article})
    })
    .catch((err) => {
        next(err)
    })
} 

function getAllArticles(req, res, next) {
    return fetchAllArticles()
    .then((articles) => {
        res.status(200).send({articles})
    })
    .catch((err) => {
        console.log(err)
        next(err)
    })
}

module.exports = {
    getTopics, 
    getEndpoints,
    getArticleById,
    getAllArticles
}