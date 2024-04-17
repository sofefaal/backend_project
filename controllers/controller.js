const endpoint = require("../endpoints.json");
const fetchTopics = require("../models/topics.model");
const {
  fetchArticleId,
  fetchAllArticles,
} = require("../models/articles.model");
const fetchAllComments = require("../models/comments.model");

function getTopics(req, res, next) {
  return fetchTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => {
      next(err);
    });
}

function getEndpoints(req, res, next) {
  res.status(200).send({ endpoint });
}

function getArticleById(req, res, next) {
  const article = req.params;
  return fetchArticleId(article.article_id)
    .then((article) => {
      res.status(200).send({ article: article });
    })
    .catch((err) => {
      next(err);
    });
}

function getAllArticles(req, res, next) {
  return fetchAllArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
}

function getComments(req, res, next) {
    const comment = req.params
  return fetchAllComments(comment.article_id)
    .then((comments) => {
      res.status(200).send({ comments });
      
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = {
  getTopics,
  getEndpoints,
  getArticleById,
  getAllArticles,
  getComments,
};
