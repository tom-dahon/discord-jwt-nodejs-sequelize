const db = require("../models");
const Message = db.message;

exports.sendMessage = (req, res) => { 
    Message.create({
        text: req.body.text,
        userId: req.body.userId,
        channelId: req.params.channelId 
    }).then(message => {
        return res.status(200).send(message);
    });
};

exports.deleteMessage = (req, res) => {
    Message.findByPk(req.body.id).then(message => {
        if (!message) {
            return res.status(404).send({ message: "Aucun message n'a été trouvé." });
        }
        message.destroy();
        return res.status(200).send("Message supprimé");
    });
};