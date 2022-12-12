const { authJwt } = require("../middleware");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
    const products = require("../controllers/product.controller.js");
  
    // Create a new Product
    app.post("/api/products/create", [authJwt.verifyToken, authJwt.isAdmin], products.create);

    // Retrieve all products
    app.get("/api/products/",[authJwt.verifyToken], products.findAll);
  
    // Retrieve a single product with id
    app.get("/api/products/:id",[authJwt.verifyToken], products.findOne);
  
  };
  