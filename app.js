const express = require("express")
const app = express()
const {
    getTopics, 
    getEndpoints
} = require("./controllers/controller")

app.get("/api/topics", getTopics)
app.get("/api/", getEndpoints)

app.all(`*`, (request, response, next) => {
	 response.status(404).send({message: "Path does not exist"})
})



module.exports = app