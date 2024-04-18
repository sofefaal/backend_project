const db = require("../db/connection");
const data = require("../db/data/development-data/index");
const checkExists = require("../check_exists/checkExist")


function fetchAllComments(article_id) {
  return checkExists("articles", "article_id", article_id)
  .then(() => {
    return db
      .query(
        `SELECT * FROM comments WHERE comments.article_id=$1 ORDER BY comments.created_at DESC;`,
        [article_id]
      )
      .then(({ rows }) => {
        return rows;
      });
  })
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

function removeCommentById(comment_id) {
  return db
  .query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *;`,[comment_id])
  .then(({rows}) => {
    if(rows.length === 0) {
      return Promise.reject({
        status: 404,
        msg: "Comment cannot be removed since comment_id does not exist, please try again",
      });
    }
    return rows
  })

}

module.exports = {
  fetchAllComments,
  insertComment,
  removeCommentById
};
