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
        expect(body).toEqual({ message: "bad request" });
      });
  });
});

describe("GET: /api/articles", () => {
  test("GET: responds with a 200 status code and with an array of articles objects, including the comment_count", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        articles.forEach((article) => {
          expect(Object.keys(article).length).toBe(8);
          expect(typeof article.author).toBe("string");
          expect(typeof article.title).toBe("string");
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.votes).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
          expect(typeof article.comment_count).toBe("number");
        });
      });
  });
});

describe("GET: /api/articles/:article_id/comments", () => {
  test("GET: responds with a 200 status code, with an array of comments objects for the given article_id", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const commentsArticleId = body.comments;
        commentsArticleId.forEach((comment) => {
          expect(Object.keys(comment).length).toBe(6);
          expect(typeof comment.comment_id).toBe("number");
          expect(typeof comment.body).toBe("string");
          expect(typeof comment.article_id).toBe("number");
          expect(typeof comment.author).toBe("string");
          expect(typeof comment.votes).toBe("number");
          expect(typeof comment.created_at).toBe("string");
        });
      });
  });
  test("GET: responds with a 200 status when article_id exists but no comment present", () => {
    return request(app)
      .get("/api/articles/13/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toHaveLength(0);
      });
  });

  test("GET: responds with a 404 status code when passed an ID which does not exist in the database", () => {
    return request(app)
      .get("/api/articles/200/comments")
      .expect(404)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual({ message: "Resource not found" });
      });
  });
  test("GET: responds with a 400 status code when passed an invalid ID", () => {
    return request(app)
      .get("/api/articles/hello/comments")
      .expect(400)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual({ message: "bad request" });
      });
  });
});
describe("POST: /api/articles/:article_id/comments", () => {
  test("POST: responds with a 201 status code when a new comment is added", () => {
    const newComment = {
      username: "butter_bridge",
      body: "This was okay, wasn't super intrigued when I was reading this article",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        const { newComment } = body;

        expect(Object.keys(newComment).length).toBe(6);
        expect(typeof newComment.comment_id).toBe("number");
        expect(typeof newComment.body).toBe("string");
        expect(typeof newComment.article_id).toBe("number");
        expect(typeof newComment.author).toBe("string");
        expect(typeof newComment.votes).toBe("number");
        expect(typeof newComment.created_at).toBe("string");
      });
  });
  test("POST: responds with a 201 status code, with the correct object structure", () => {
    const newComment = {
      username: "butter_bridge",
      body: "This article is amazing, 100% recommend",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .then(({ body }) => {
        const { newComment } = body;
        expect(newComment.comment_id).toBe(19);
        expect(newComment.body).toBe("This article is amazing, 100% recommend");
        expect(newComment.article_id).toBe(1);
        expect(newComment.author).toBe("butter_bridge");
        expect(newComment.votes).toBe(0);
        expect(typeof newComment.created_at).toBe("string");
      });
  });
  test("POST: responds with a 400 status code when provided an ID which does not exist in the database", () => {
    return request(app)
      .post("/api/articles/11111/comments")
      .send({
        username: "Do_not_exist",
        body: "hello",
      })
      .expect(400)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual({ message: "bad request" });
      });
  });
  test("POST: responds with a 404 status code no ID is provided", () => {
    return request(app)
      .post("/api/articles//comments")
      .send({
        username: "Do_not_exist",
        body: "hello",
      })
      .expect(404)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual({ message: "Path does not exist" });
      });
  });
});
describe("PATCH: /api/articles/:article_id", () => {
  test("PATCH: responds with a 200 status code when updated votes by increment of 1", () => {
    let newVote = 1;
    const articleVotes = { inc_votes: newVote };
    return request(app)
      .patch("/api/articles/1")
      .send(articleVotes)
      .expect(200)
      .then(({ body }) => {
        expect(body.articleVotes.votes).toBe(101);
      });
  });
  test("PATCH: responds with a 200 status code when updated votes by decrement of 100", () => {
    let newVote = -100;
    const articleVotes = { inc_votes: newVote };
    return request(app)
      .patch("/api/articles/1")
      .send(articleVotes)
      .expect(200)
      .then(({ body }) => {
        expect(body.articleVotes.votes).toBe(0);
      });
  });
  test("PATCH: responds with a 404 when provided article_id which does not exist in the database", () => {
    let newVote = -100;
    const articleVotes = { inc_votes: newVote };
    return request(app)
      .patch("/api/articles/12345")
      .send(articleVotes)
      .expect(404)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual({ message: "article_id not found" });
      });
  });
  test("PATCH: responds with a 400 when provided an invalid ID", () => {
    let newVote = -100;
    const articleVotes = { inc_votes: newVote };
    return request(app)
      .patch("/api/articles/hello-there")
      .send(articleVotes)
      .expect(400)
      .then((response) => {
        const { body } = response;
        expect(body).toEqual({ message: "bad request" });
      });
  });
    test("PATCH: responds with a 400 when provided an invalid vote value", () => {
      let newVote = "this is great!";
      const articleVotes = { inc_votes: newVote };
      return request(app)
        .patch("/api/articles/1")
        .send(articleVotes)
        .expect(400)
        .then((response) => {
          const { body } = response;
          expect(body).toEqual({ message: "bad request" });
        });
    });
});
