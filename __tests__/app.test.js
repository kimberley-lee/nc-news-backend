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
  test("POST 201: responds with an object with specific properties", () => {
    const newTopic = { description: "Dune 2", slug: "science-fiction" };
    return request(app)
      .post("/api/topics")
      .expect(201)
      .send(newTopic)
      .then(({ body }) => {
        const { topic } = body;
        expect(topic.length).toBe(1);
        topic.forEach((topic) => {
          expect(topic.description).toBe("Dune 2");
          expect(topic.slug).toBe("science-fiction");
        });
      });
  });
  test("POST 400: responds with an error message if the posted comment doesn't have required properties", () => {
    const newTopic = { description: "Dogs are cooler than cats" };
    return request(app)
      .post("/api/topics")
      .expect(400)
      .send(newTopic)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("Bad request");
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
        const { article } = body;
        expect(article).toMatchObject({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: expect.any(String),
          votes: 100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
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
  test("GET 200: responds with an object that also includes comment_count", () => {
    return request(app)
      .get("/api/articles/5")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toMatchObject({
          title: "UNCOVERED: catspiracy to bring down democracy",
          topic: "cats",
          author: "rogersop",
          body: "Bastet walks amongst us, and the cats are taking arms!",
          created_at: expect.any(String),
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          comment_count: 2,
        });
      });
  });
  test("DELETE 204: responds with no content from associated article_id and an error message when retrieving comments with associated article_id", () => {
    return request(app)
      .delete("/api/articles/1")
      .expect(204)
      .then(() => {
        return request(app)
          .get("/api/articles/1/comments")
          .expect(404)
          .then(({ body }) => {
            const { message } = body;
            expect(message).toBe("Article ID not found");
          });
      });
  });
  test("DELETE 404: responds with an error message if article_id isn't found", () => {
    return request(app)
      .delete("/api/articles/100")
      .expect(404)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("Not found");
      });
  });
  test("DELETE 400: responds with an error message if article_id is invalid or of the incorrect type", () => {
    return request(app)
      .delete("/api/articles/chocolate")
      .expect(400)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("Bad request");
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
        expect(articles.length).toBe(10);
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
  test("GET 200: responds with an array of objects filtered by a topic query", () => {
    return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles.length).toBe(1);
        articles.forEach((article) => {
          expect(article.title).toBe(
            "UNCOVERED: catspiracy to bring down democracy"
          ),
            expect(article.topic).toBe("cats"),
            expect(article.author).toBe("rogersop"),
            expect(article.created_at).toEqual(expect.any(String));
          expect(article.article_img_url).toBe(
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
          );
        });
      });
  });
  test("GET 200: responds with an empty array when given a valid topic without any articles", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles.length).toBe(0);
      });
  });
  test("GET 404: responds with an error message if the topic is not found", () => {
    return request(app)
      .get("/api/articles?topic=dogs")
      .expect(404)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("Not found");
      });
  });
  test("GET 200: responds with an article object sorted by specified column", () => {
    return request(app)
      .get("/api/articles?sort_by=title")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSortedBy("title", { descending: true });
      });
  });
  test("GET 200: responds with an article object ordered by ascending or descending", () => {
    return request(app)
      .get("/api/articles?order=asc")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSortedBy("created_at", { descending: false });
      });
  });
  test("GET 404: responds with an error message if an incorrect column is queried", () => {
    return request(app)
      .get("/api/articles?sort_by=txpic")
      .expect(400)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("Invalid input");
      });
  });
  test("POST 201: responds with a new article including extra specific properties", () => {
    const newArticle = {
      author: "lurker",
      title: "Catam Ondra climbs world's hardest route",
      topic: "cats",
      body: "How does he do it? The man is a beast.",
      article_img_url:
        "https://www.lasportiva.com/media/mageplaza/blog/post/a/o/ao-2_1.jpg",
    };
    return request(app)
      .post("/api/articles")
      .expect(201)
      .send(newArticle)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toEqual({
          author: "lurker",
          title: "Catam Ondra climbs world's hardest route",
          topic: "cats",
          body: "How does he do it? The man is a beast.",
          article_img_url:
            "https://www.lasportiva.com/media/mageplaza/blog/post/a/o/ao-2_1.jpg",
          article_id: 14,
          votes: 0,
          created_at: expect.any(String),
          comment_count: 0,
        });
      });
  });
  test("POST 400: responds with an error message when given an object without a required property", () => {
    const newArticle = {
      author: "lurker",
      topic: "cats",
      body: "How does he do it? The man is a beast.",
      article_img_url:
        "https://www.lasportiva.com/media/mageplaza/blog/post/a/o/ao-2_1.jpg",
    };
    return request(app)
      .post("/api/articles")
      .expect(400)
      .send(newArticle)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("Bad request");
      });
  });
  test("POST 201: responds with a new article with a default url_img if not given one", () => {
    const newArticle = {
      author: "lurker",
      title: "Catam Ondra climbs world's hardest route",
      topic: "cats",
      body: "How does he do it? The man is a beast.",
    };
    return request(app)
      .post("/api/articles")
      .expect(201)
      .send(newArticle)
      .then(({ body }) => {
        const { article } = body;
        expect(article.article_img_url).toBe(
          "https://images.pexels.com/photos/6045017/pexels-photo-6045017.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        );
      });
  });
  test("POST 404: responds with an error message if the author is not found", () => {
    const newArticle = {
      author: "climbing_cat",
      title: "Catam Ondra climbs world's hardest route",
      topic: "cats",
      body: "How does he do it? The man is a beast.",
    };
    return request(app)
      .post("/api/articles")
      .expect(404)
      .send(newArticle)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("Not found");
      });
  });
  test("GET 200: responds with a number of articles limited by the query", () => {
    return request(app)
      .get("/api/articles?limit=4")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles.length).toBe(4);
        articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            author: expect.any(String),
            votes: expect.any(Number),
            created_at: expect.any(String),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
        });
      });
  });
  test("GET 200: responds with a number of articles limited to a default of 10 if not passed a number", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles.length).toBe(10);
        articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            author: expect.any(String),
            votes: expect.any(Number),
            created_at: expect.any(String),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
        });
      });
  });
  test("GET 400: responds with an error message if query limit is invalid", () => {
    return request(app)
      .get("/api/articles?limit=biscuits")
      .expect(400)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("Bad request");
      });
  });
  test("GET 200: responds with a page of articles from specified p query", () => {
    return request(app)
      .get("/api/articles?p=2")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles.length).toBe(3);
      });
  });
  test("GET 200: responds with an article object and empty array if p query exceeds pages of articles", () => {
    return request(app)
      .get("/api/articles?p=6")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles.length).toBe(0);
      });
  });
  test("GET 200: responds with an object with a total_count property of all articles", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.total_count).toBe(13);
      });
  });
  test("GET 200: responds with an object with a total_count property that displays the total of relevant articles", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body }) => {
        expect(body.total_count).toBe(12);
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
  test("GET 200: responds with a number of comments limited by a default of 10", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments.length).toBe(10);
        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            body: expect.any(String),
            votes: expect.any(Number),
            author: expect.any(String),
            article_id: expect.any(Number),
            created_at: expect.any(String),
          });
        });
      });
  });
  test("GET 200: responds with a number of comments limited by the query", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=5")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments.length).toBe(5);
      });
  });
  test("GET 400: responds with an error message if query limit is invalid", () => {
    return request(app)
      .get("/api/articles/2/comments?limit=merlin")
      .expect(400)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("Bad request");
      });
  });
  test("GET 200: responds with a page of comments from specified p query", () => {
    return request(app)
      .get("/api/articles/1/comments?p=2")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments.length).toBe(1);
      });
  });
  test("GET 200: responds with an comments object and empty array if p query exceeds pages of comments", () => {
    return request(app)
      .get("/api/articles/1/comments?p=3")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments.length).toBe(0);
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
  test("PATCH 200: responds with an updated numbers of votes in comment", () => {
    const updateVotes = { inc_votes: 4 };
    return request(app)
      .patch("/api/comments/1")
      .send(updateVotes)
      .expect(200)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment).toMatchObject({ votes: 20 });
      });
  });
  test("PATCH 400: responds with an error message if comment_id is invalid", () => {
    const updateVotes = { inc_votes: 1 };
    return request(app)
      .patch("/api/comments/crackers")
      .send(updateVotes)
      .expect(400)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("Bad request");
      });
  });
  test("PATCH 404: responds with an error message if comment_id is not found", () => {
    const updateVotes = { inc_votes: 1 };
    return request(app)
      .patch("/api/comments/200")
      .send(updateVotes)
      .expect(404)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("Not found");
      });
  });
});

describe("/api/users", () => {
  test("GET 200: responds with an array of objects with specific properties", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(users.length).toBe(4);
        users.forEach((user) => {
          expect(typeof user.username).toBe("string"),
            expect(typeof user.name).toBe("string"),
            expect(typeof user.avatar_url).toBe("string");
        });
      });
  });
});

describe("/api/users/:username", () => {
  test("GET 200: responds with a user object with specific properties", () => {
    return request(app)
      .get("/api/users/butter_bridge")
      .expect(200)
      .then(({ body }) => {
        const { user } = body;
        expect(user).toMatchObject({
          username: "butter_bridge",
          name: "jonny",
          avatar_url:
            "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
        });
      });
  });
  test("GET 404: responds with an error message if the username is not found", () => {
    return request(app)
      .get("/api/users/cat_lady52")
      .expect(404)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("Not found");
      });
  });
});
