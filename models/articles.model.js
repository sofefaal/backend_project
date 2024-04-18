const db = require("../db/connection")

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

function fetchAllArticles() {
    return db
      .query(
        `SELECT 
    articles.article_id, 
    articles.title, 
    articles.topic, 
    articles.author,  
    articles.created_at,
    articles.votes,
    articles.article_img_url,
    COUNT(comments.comment_id)::INTEGER AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC;`
      )
      .then(({ rows: articles }) => {
        return articles;
      });

}

function fetchUpdatedArticles(articleVotes, article_id) {
  const { inc_votes } = articleVotes
  
  return db
  .query(
    `UPDATE articles
    SET votes = votes + $2
    WHERE article_id = $1
    RETURNING *;`,
    [article_id, inc_votes]
  )
  .then(({rows}) => {
     if (!rows[0]) {
       return Promise.reject({ status: 404, msg: "article_id not found" });
     }
    return rows[0]
  })


}

module.exports = {
  fetchArticleId,
  fetchAllArticles,
  fetchUpdatedArticles
  }