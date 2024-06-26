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
const fetchAllUsers = require("../models/users.model");

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
  const articleCommentCount = req.query.comment_count
  const article = req.params;

  return fetchArticleId(article.article_id, articleCommentCount)
    .then((article) => {
      res.status(200).send({ article: article });
    })
    .catch((err) => {
      next(err);
    });
}

function getAllArticles(req, res, next) {
  const articleTopicRequest = req.query.topic
  const sortByQuery = req.query.sort_by
  const orderByQuery = req.query.order_by

  return fetchAllArticles(articleTopicRequest, sortByQuery, orderByQuery)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err)
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

function getUsers(req, res, next) {
   return fetchAllUsers()
     .then((users) => {
       res.status(200).send({ users });
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
  addComments,
  getUpdatedArticles,
  deleteCommentById,
  getUsers
};
