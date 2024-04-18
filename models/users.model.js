const db = require("../db/connection")

function fetchAllUsers() {
    return db
    .query(`SELECT * FROM users;`)
    .then(({ rows }) => rows);

}

module.exports = fetchAllUsers