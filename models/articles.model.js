const db = require("../db/connection");

function fetchArticleId(article_id) {
  return db
    .query(`SELECT * FROM articles WHERE article_id=$1;`, [article_id])
    .then(({ rows: article }) => {
      if (!article[0]) {
        return Promise.reject({ status: 404, msg: "article_id not found" });
      }
      return article;
    });
}

function fetchAllArticles(topic) {
  let sqlQuery = `SELECT 
  articles.article_id, 
  articles.title, 
  articles.topic, 
  articles.author,  
  articles.created_at,
  articles.votes,
  articles.article_img_url,
  COUNT(comments.comment_id)::INTEGER AS comment_count
  FROM articles
  LEFT JOIN comments ON articles.article_id = comments.article_id`;

  const articleTopic = [];
  if (topic) {
    const topicQuery = ` WHERE articles.topic=$1`;
    sqlQuery += topicQuery;
    articleTopic.push(topic);
  }

  sqlQuery += ` GROUP BY articles.article_id`;

  return db.query(sqlQuery, articleTopic)
  .then(({ rows: articles }) => {
    if (articles.length === 0) {
      return Promise.reject({
        status: 404,
        msg: "Sorry topic not found"
      });
    }
    return articles;
  });
}

function fetchUpdatedArticles(articleVotes, article_id) {
  const { inc_votes } = articleVotes;

  return db
    .query(
      `UPDATE articles
    SET votes = votes + $2
    WHERE article_id = $1
    RETURNING *;`,
      [article_id, inc_votes]
    )
    .then(({ rows }) => {
      if (!rows[0]) {
        return Promise.reject({ status: 404, msg: "article_id not found" });
      }
      return rows[0];
    });
}

module.exports = {
  fetchArticleId,
  fetchAllArticles,
  fetchUpdatedArticles,
};
