const { authJwt } = require("../middleware");
const controller = require("../controllers/channel.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get(
    "/api/channels",
    [authJwt.verifyToken],
    controller.getChannels
  );

  app.get(
    "/api/channels/:channelId",
    [authJwt.verifyToken],
    controller.getChannel
  );

  app.post("/api/channels/createChannel",
  [authJwt.verifyToken],
  controller.createChannel
  );

  app.post("/api/channels/search",
  [authJwt.verifyToken],
  controller.searchChannel
  );

};