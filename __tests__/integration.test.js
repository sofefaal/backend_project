const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const app = require("../app");
const expectedContents = require("../endpoints.json");



beforeEach(() => seed(data));
afterAll(() => db.end());

describe("GET: /api/topics", () => {
  test("GET: responds with a 200 status code and an array of topic objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body.topics.length).toBe(3);
        body.topics.forEach((topic) => {
          expect(typeof topic.description).toBe("string");
          expect(typeof topic.slug).toBe("string");
        });
      });
  });
});
describe("GET: /api/invalid_endpoint", () => {
  test("GET: responds with a 404 status code when provided the wrong endpoint", () => {
    return request(app)
      .get("/api/topicz")
      .expect(404)
      .then((response) => {
        expect(response.body).toEqual({ message: "Path does not exist" });
      });
  });
});
describe("GET: /api", () => {
  test("Should return a JSON object for all articles", () => {
    return request(app)
    .get("/api/")
    .expect(200)
    .then(({body}) => {
        expect(body.endpoint).toEqual(expectedContents)
    })

    
  });
});
