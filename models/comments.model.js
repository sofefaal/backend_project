const db = require("../db/connection")

function fetchAllComments(article_id) {
    return db.query(`SELECT * FROM comments WHERE comments.article_id=$1 ORDER BY comments.created_at DESC;`, [article_id])
    .then(({rows: comments}) => {
        if(comments.length === 0) {
            return Promise.reject({status: 404, msg: "comment not found"})
        }
        return comments
    })

}

module.exports = fetchAllComments