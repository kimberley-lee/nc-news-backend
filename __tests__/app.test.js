const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const endpoints = require("../endpoints.json");

afterAll(() => {
  db.end();
});

beforeEach(() => {
  return seed(data);
});

describe("undeclared endpoints", () => {
  test("GET 404: responds with an error message if endpoint isn't valid or undeclared", () => {
    return request(app)
      .get("/api/topics!")
      .expect(404)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("Not found!");
      });
  });
});

describe("/api/topics", () => {
  test("GET 200: responds with an array of all the topic objects with the properties of slug and description", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
        expect(topics.length).toBe(3);
        topics.forEach((topic) => {
          expect(typeof topic.description).toBe("string");
          expect(typeof topic.slug).toBe("string");
        });
      });
  });
});

describe("/api", () => {
  test("should respond with an object describing all available endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual(endpoints);
      });
  });
});

describe("/api/articles/:article_id", () => {
  test("GET 200: responds with an object with a key of article and a list of properties", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body).toMatchSnapshot({
          article: {
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: expect.any(String),
            votes: 100,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          },
        });
      });
  });
  test("GET 404: responds with an error if passed an article_id that doesn't exist", () => {
    return request(app)
      .get("/api/articles/100")
      .expect(404)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("Not found");
      });
  });
  test("GET 400: responds with an error if passed an incorrect type of article_id", () => {
    return request(app)
      .get("/api/articles/cheese")
      .expect(400)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("Bad request");
      });
  });
});
