
const {fetchTopics} = require("../models/topics.model")

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

module.exports = {getTopics}