const endpoint = require("../endpoints.json")
const {fetchTopics} = require("../models/model")

function getTopics(req, res, next) {
    const topicArr = req.params
    return fetchTopics(topicArr)
    .then((topics) => {
        res.status(200).send({topics})
    })
    .catch((err) => {
        next(err)
    })
}

function getEndpoints(req, res, next) {
  res.status(200).send({ endpoint });
}

module.exports = {getTopics, getEndpoints}