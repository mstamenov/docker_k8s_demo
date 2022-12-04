var express = require("express");
const ejs = require("ejs");
var redis = require("redis");

let srv = process.env.REDIS_SERVER || "localhost";
let port = process.env.REDIS_PORT || 6379;
console.log("Connecting to redis server: " + srv + ":" + port);
var app = express();

let redisClient;

(async () => {
  redisClient = redis.createClient({
    url: `redis://${srv}:${port}`
  });

  redisClient.on("error", (error) => console.error(`Error : ${error}`));

  await redisClient.connect();
})();

app.set("view engine", "ejs");

app.get("/", async function (_req, res) {
  let score = {
    umis: (await redisClient.get("umis")) || 0,
    nims: (await redisClient.get("nims")) || 0,
  };
  res.render("index", score);
});

app.get("/addOne", async function (req, res) {
  if (req.query.team) {
    try {
      let cacheResults = await redisClient.get(req.query.team);
      if (cacheResults) {
        cacheResults++;
      } else {
        cacheResults = 1;
      }
      await redisClient.set(req.query.team, cacheResults);
    } catch (err) {
      console.log(err);
    }
  }
  res.redirect("/");
});

var server = app.listen(8081, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log("Example app listening at http://%s:%s", host, port);
});
