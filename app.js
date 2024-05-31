const express = require("express");
const {
  getTopics,
  getEndpoints,
  getArticleById,
  getAllArticles,
  getComments,
  addComments,
  getUpdatedArticles,
  deleteCommentById,
  getUsers,
} = require("./controllers/controller");
const cors = require("cors");

const app = express();

app.use(cors());

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/", getEndpoints);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id/comments", getComments);

app.post("/api/articles/:article_id/comments", addComments);

app.patch("/api/articles/:article_id", getUpdatedArticles);

app.delete("/api/comments/:comment_id", deleteCommentById);

app.get("/api/users", getUsers);

app.use((err, req, res, next) => {
  if (err.status && err.message) {
    res.status(err.status).send({ message: err.message });
  }
  next(err);
});

app.use((err, req, res, next) => {
  if (err.code === "22P02" || err.code === "23503") {
    res.status(400).send({ message: "bad request" });
  }
  next(err);
});

app.all(`*`, (request, response, next) => {
  response.status(404).send({ message: "Path does not exist" });
});

module.exports = app;
