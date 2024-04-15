const express = require("express")
const app = express()
const {getTopics} = require("./controllers/topics.controller")

app.get("/api/topics", getTopics)

app.all(`*`, (request, response, next) => {
	 response.status(404).send({message: "Path does not exist"})
})



module.exports = app