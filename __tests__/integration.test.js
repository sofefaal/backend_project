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
  test("Should return a JSON object for all endpoints", () => {
    return request(app)
      .get("/api/")
      .expect(200)
      .then(({ body }) => {
        expect(body.endpoint).toEqual(expectedContents);
      });
  });
});
describe("GET: /api/articles/:article_id", () => {
  test("GET: responds with a 200 status code and a nested object", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeInstanceOf(Object);
        expect(body.article).toBeInstanceOf(Object);
      });
  });
  test("GET: responds with an object with the expected properties", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        article.forEach((article) => {
          expect(typeof article.author).toBe("string");
          expect(typeof article.title).toBe("string");
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.body).toBe("string");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.votes).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
        });
      });
  });
  test("GET: responds with a 404 when passed an ID that does not exist in the database", () => {
    return request(app)
      .get("/api/articles/20")
      .expect(404)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual({ message: "article_id not found" });
      });
  });
  test("GET: responds with a 400 when passed an invalid ID", () => {
    return request(app)
      .get("/api/articles/not-a-number")
      .expect(400)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual({ message: "invalid article_id, bad request" });
      });
  });
});

describe("GET: /api/articles", () => {
  test("GET: responds with a 200 status code and with an array of articles objects, including the comment_count", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const articles  = body.articles;
        articles.forEach((article) => {
          expect(Object.keys(article).length).toBe(8)
          expect(typeof article.author).toBe("string");
          expect(typeof article.title).toBe("string");
          expect(typeof article.article_id).toBe("number")
          expect(typeof article.topic).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.votes).toBe("number");
          expect(typeof article.article_img_url).toBe("string")
          expect(typeof article.comment_count).toBe("string")
        });
      });
  });
});
