const express = require("express")
const {
    getTopics, 
    getEndpoints,
    getArticleById,
    getAllArticles,
    getComments,
    addComments,
    getUpdatedArticles
} = require("./controllers/controller")

const app = express()

app.use(express.json())


app.get("/api/topics", getTopics)

app.get("/api/", getEndpoints)

app.get("/api/articles/:article_id", getArticleById)

app.get("/api/articles", getAllArticles)

app.get("/api/articles/:article_id/comments", getComments)

app.post("/api/articles/:article_id/comments", addComments)

app.patch("/api/articles/:article_id", getUpdatedArticles);


app.use((err, req, res, next) => {
    if(err.status && err.msg) {
        res.status(err.status).send({message: err.msg})
    } 
    next(err)
})

app.use((err, req, res, next) => {
       if (err.code === "22P02" || err.code === "23503") {
         res.status(400).send({ message: "bad request" });
       }
       next(err)
})


app.all(`*`, (request, response, next) => {
	 response.status(404).send({message: "Path does not exist"})
})



module.exports = app