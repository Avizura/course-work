Sequelize = require('sequelize');
var sequelize = new Sequelize('track_db', 'root', 'prosport', {
  host: 'localhost',
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
});
var browsers = sequelize.define('browsers', {
  browser_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true
      // get      : function()  {
      //   var title = this.getDataValue('title');
      //   // 'this' allows you to access attributes of the instance
      //   return this.getDataValue('name') + ' (' + title + ')';
      // },
  },
  browser_name: {
    type: Sequelize.STRING,
    allowNull: true
    // set: function(val) {
    //   this.setDataValue('title', val.toUpperCase());
    // }
  }
},
{
  timestamps: false,
  freezeTableName: true
});

module.exports = browsers;
