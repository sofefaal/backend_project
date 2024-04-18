const endpoint = require("../endpoints.json");
const fetchTopics = require("../models/topics.model");
const {
  fetchArticleId,
  fetchAllArticles,
  fetchUpdatedArticles
} = require("../models/articles.model");

const {
  fetchAllComments,
  insertComment,
  removeCommentById
} = require("../models/comments.model");

const checkExists = require("../check_exists/checkExist");

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
    const {article_id} = req.params
    
  return checkExists("articles", "article_id", article_id)
    .then(() => {
      return fetchAllComments(article_id)
    })
    .then((comments) => {
      res.status(200).send({ comments })
    })
    .catch((err) => {
      next(err);
    });
}

function addComments(req, res, next) {
  const {article_id} = req.params

  insertComment(req.body, article_id)
  .then((newComment) => {
    res.status(201).send({ newComment })
  
  })
  .catch((err) => {
    next(err)
  })
}

function getUpdatedArticles(req, res, next) {
  const { article_id } = req.params

  fetchUpdatedArticles(req.body, article_id)
  .then((articleVotes) => {
    res.status(200).send({ articleVotes })
  })
  .catch((err) => {
    next(err)
  })
}

function deleteCommentById(req, res, next) {
  const { comment_id } = req.params
  removeCommentById(comment_id)
  .then(() => {
    res.status(204).send()
  })
  .catch((err) => {
    next(err)
  })

}

module.exports = {
  getTopics,
  getEndpoints,
  getArticleById,
  getAllArticles,
  getComments,
  addComments,
  getUpdatedArticles,
  deleteCommentById
};
