module.exports = (sequelize, Sequelize) => {
    const Message = sequelize.define("messages", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      text: {
        type: Sequelize.STRING
      },
      userId: {
        type: Sequelize.INTEGER
      },
      channelId: {
        type: Sequelize.INTEGER
      }
    });
  
    return Message;
  };
  