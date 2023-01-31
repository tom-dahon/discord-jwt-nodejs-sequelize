const db = require("../models");
const Message = db.message;

exports.getMessagesFromChannel = (req, res) => {
    Message.findAll({
        where: {
            channelId: req.params.channelId
        },
        order: [
            ['createdAt', 'DESC'],
        ],
    }).then(messages => {
        if(!messages) {
            return res.status(404).send({message: "Aucun message n'a été trouvé."})
        }
        return res.status(200).send(messages);
    });
};

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