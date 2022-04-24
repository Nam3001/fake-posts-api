const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

const queryString = require("query-string");
const casual = require("casual").functions();

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares);

// Add custom routes before JSON Server router
server.get("/echo", (req, res) => {
  res.jsonp(req.query);
});

// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
server.use(jsonServer.bodyParser);
server.use((req, res, next) => {
  req.body.id = casual.uuid();

  if (req.method === "POST") {
    req.body.createdAt = Date.now();
    req.body.updatedAt = Date.now();
  }
  if (req.method === "PATCH" || req.method === "PUT") {
    req.body.updatedAt = Date.now();
  }
  next();
});

// Use default router
server.use("/api", router);
server.listen(3000, () => {
  console.log("JSON Server is running");
});

router.render = (req, res) => {
  const headers = res.getHeaders();
  const totalCount = headers["x-total-count"];
  const queryParams = queryString.parse(req._parsedUrl.query);

  if (req.method === "GET" && totalCount) {
    return res.jsonp({
      data: res.locals.data,
      pagination: {
        _page: Number.parseInt(queryParams._page),
        _limit: Number.parseInt(queryParams._limit),
        _totalRows: totalCount,
      },
    });
  }

  res.jsonp(res.locals.data);
};
