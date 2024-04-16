// const { sort } = require("../db/data/development-data/topics")
const db = require("../db/connection")

function fetchTopics() {
    return db.query(`SELECT * FROM topics;`)
    .then(({rows}) => rows)
    
}

function fetchArticleId(article_id) {
    return db.query(`SELECT * FROM articles WHERE article_id=$1;`, [article_id])
    .then(({rows: articles}) => {
        if(!articles[0]) {
            return Promise.reject({status: 404, msg: "article_id not found"})
        }
        return articles
    })
}

module.exports = {
    fetchTopics,
    fetchArticleId
}