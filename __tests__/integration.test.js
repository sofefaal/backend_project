const request = require("supertest")
const db = require("../db/connection")
const seed = require("../db/seeds/seed")
const data = require("../db/data/test-data/index");
const app = require("../app")

beforeEach(() => seed(data));
afterAll(() => db.end())

describe("GET: /api/topics", () => {
    test("GET: responds with a 200 status code and an array of topic objects", () => {
        return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({body}) => {
            expect(body.topics.length).toBe(3)
            body.topics.forEach((topic) => {
                expect(typeof topic.description).toBe("string")
                expect(typeof topic.slug).toBe("string")
            })
        })
    }) 
    test("GET: responds with a 404 status code when provided the wrong endpoint", () => {
        return request(app)
        .get("/api/topicz")
        .expect(404)
        .then((response) => {
            console.log(response.rows)
            expect(response.body).toEqual({message: 'Path does not exist'})
        })
    })
})