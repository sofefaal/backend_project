const db = require("../db/connection");
const data = require("../db/data/development-data/index");
const format = require("pg-format");

function fetchAllComments(article_id) {
  return db
    .query(
      `SELECT * FROM comments WHERE comments.article_id=$1 ORDER BY comments.created_at DESC;`,
      [article_id]
    )
    .then(({ rows: comments }) => {
      if (comments.length === 0) {
        return Promise.reject({ status: 404, msg: "comment not found" });
      }
      return comments;
    });
}

function insertComment(newComment, article_id) {
  const { username, body } = newComment;

  return db
    .query(
      `INSERT INTO comments 
      (article_id, author, body) 
      VALUES ($1, $2, $3) 
      RETURNING * ;`,
      [article_id, username, body]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "article_id not found" });
      }
      return rows[0];
    });
}

module.exports = {
  fetchAllComments,
  insertComment,
};
