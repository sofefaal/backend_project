const express = require("express")
const app = express()
const {
    getTopics, 
    getEndpoints,
    getArticleById,
    getAllArticles
} = require("./controllers/controller")

app.get("/api/topics", getTopics)

app.get("/api/", getEndpoints)

app.get("/api/articles/:article_id", getArticleById)

app.get("/api/articles", getAllArticles)


app.use((err, req, res, next) => {
    if(err.status && err.msg) {
        res.status(err.status).send({message: err.msg})
    } 
    next(err)
})

app.use((err, req, res, next) => {
       if (err.code === "22P02") {
         res.status(400).send({ message: "invalid article_id, bad request" });
       }
       next(err)
})

app.all(`*`, (request, response, next) => {
	 response.status(404).send({message: "Path does not exist"})
})



module.exports = app