const { authJwt } = require("../middleware");
const controller = require("../controllers/message.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get(
    "/api/channels/:channelId/messages",
    [authJwt.verifyToken],
    controller.getMessagesFromChannel
  );

  app.get(
    "/api/message/sender/:userId",
    [authJwt.verifyToken],
    controller.getSender
  );

  app.post(
    "/api/channels/:channelId/sendMessage",
    [authJwt.verifyToken],
    controller.sendMessage
  );

  app.delete(
    "/api/messages/deleteMessage",
    [authJwt.verifyToken],
    controller.deleteMessage
  );

};