const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const endpoints = require("../endpoints.json");

afterAll(() => {
  return db.end();
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
        expect(body).toMatchObject({
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
  test("PATCH 200: responds with an object of an updated article", () => {
    const update = {
      inc_votes: 1,
    };
    return request(app)
      .patch("/api/articles/1")
      .expect(200)
      .send(update)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toMatchObject({
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: expect.any(String),
          votes: 101,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("PATCH 200: responds with an object of an updated article when decrementing votes", () => {
    const update = {
      inc_votes: -50,
    };
    return request(app)
      .patch("/api/articles/2")
      .expect(200)
      .send(update)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toMatchObject({
          title: "Sony Vaio; or, The Laptop",
          topic: "mitch",
          author: "icellusedkars",
          body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
          created_at: expect.any(String),
          votes: -50,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("PATCH 400: responds with an error message if article_id is invalid", () => {
    const update = {
      inc_votes: 10,
    };
    return request(app)
      .patch("/api/articles/cat")
      .expect(400)
      .send(update)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("Bad request");
      });
  });
  test("PATCH 404: responds with an error message if article_id is not found", () => {
    const update = {
      inc_votes: 10,
    };
    return request(app)
      .patch("/api/articles/200")
      .expect(404)
      .send(update)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("Not found");
      });
  });
});

describe("/api/articles", () => {
  test("GET 200: responds with an array of article objects with specific properties", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles.length).toBe(13);
        articles.forEach((article) => {
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.author).toBe("string");
          expect(typeof article.title).toBe("string");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.article_img_url).toBe("string");
          expect(typeof article.votes).toBe("number");
          expect(typeof article.comment_count).toBe("number");
        });
      });
  });
  test("GET 200: responds with an array of article objects sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("GET 200: responds with the correct number of comments", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        const firstArticle = articles.find((article) => {
          return article.article_id === 9;
        });
        expect(firstArticle.comment_count).toBe(2);
      });
  });
  test("GET 200: responds with an array of object properties without the 'body' property", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).not.toHaveProperty("body");
      });
  });
});

describe("/api/articles/:article_id/comments", () => {
  test("GET 200: responds with an array of comments of the given article_id with specific properties", () => {
    return request(app)
      .get("/api/articles/5/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        comments.forEach((comment) => {
          expect(typeof comment.comment_id).toBe("number");
          expect(typeof comment.votes).toBe("number");
          expect(typeof comment.created_at).toBe("string");
          expect(typeof comment.author).toBe("string");
          expect(typeof comment.body).toBe("string");
          expect(typeof comment.article_id).toBe("number");
        });
      });
  });
  test("GET 200: responds with an array of most recent comments", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("GET 404: responds with an error message if article_id isn't found or is non-existant", () => {
    return request(app)
      .get("/api/articles/1000/comments")
      .expect(404)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("Article ID not found");
      });
  });
  test("GET 400: responds with an error message if article_id is an invalid type", () => {
    return request(app)
      .get("/api/articles/hello/comments")
      .expect(400)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("Bad request");
      });
  });
  test("GET 200: responds with an empty array if article_id exists but has no comments associated with it", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments.length).toBe(0);
      });
  });
  test("POST 201: responds with an object of specific properties", () => {
    const newComment = {
      body: "I'm not actually a fan of cats.",
      author: "butter_bridge",
    };
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment).toEqual({
          article_id: 2,
          comment_id: 19,
          votes: 0,
          created_at: expect.any(String),
          body: "I'm not actually a fan of cats.",
          author: "butter_bridge",
        });
      });
  });
  test("POST 400: responds with an error message if user tries to post comment without body or author property", () => {
    const newComment = {
      body: "I'm a huge fan of cats.",
    };
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("Bad request");
      });
  });
  test("POST 400: responds with an error message if user tries to post in the incorrect format", () => {
    const newComment = {
      author: 5,
    };
    return request(app)
      .post("/api/articles/6/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("Bad request");
      });
  });
  test("POST 400: responds with an error message if user tries to post an invalid id", () => {
    const newComment = {
      body: "I love butter.",
      author: "butter_bridge",
    };
    return request(app)
      .post("/api/articles/lemons/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("Bad request");
      });
  });
  test("POST 404: responds with an error message if user tries to post an id that isn't found", () => {
    const newComment = {
      body: "I love butter.",
      author: "butter_bridge",
    };
    return request(app)
      .post("/api/articles/1000/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("Not found");
      });
  });
});

describe("/api/comments/:comment_id", () => {
  test("DELETE 204: responds with no content", () => {
    return request(app).delete("/api/comments/4").expect(204);
  });
  test("DELETE 404: responds with an error if comment_id is not found", () => {
    return request(app)
      .delete("/api/comments/14000")
      .expect(404)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("Not found");
      });
  });
  test("DELETE 400: responds with an error if comment_id is of the wrong type or invalid", () => {
    return request(app)
      .delete("/api/comments/dogs")
      .expect(400)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("Bad request");
      });
  });
});
