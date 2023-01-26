module.exports = (sequelize, Sequelize) => {
    const ChannelUsers = sequelize.define("channel_users", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      channelId: {
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER
      }
    });
  
    return ChannelUsers;
  };
  