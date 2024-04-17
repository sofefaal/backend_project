const db = require("../db/connection")
const format = require("pg-format")

const checkExists = (table, column, value) => {
    
    const querySql = format(`SELECT * FROM %I WHERE %I = $1;`, table, column);
    return db.query(querySql, [value])
    .then((sqlOutput) => {

        if (sqlOutput.rows.length === 0) {
            return Promise.reject({status: 404, msg: "Resource not found"})
        }
    })
}




module.exports = checkExists