'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    person_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: true
    },
    username: DataTypes.TEXT,
    password: DataTypes.TEXT,
  }, {
    sequelize,
    modelName: 'User',
    timestamps: true,
    paranoid: true,
    hooks: {
      beforeCreate: async (user, options) => {
        // Here the password is hashed before saving
        if(user.password) {
          const bcrypt = require('bcrypt');
          const saltRounds = 10;
          user.password = await bcrypt.hash(user.password, saltRounds);
        }
      },
      beforeUpdate: async (user, options) => {
        // Here it is checked if the password has changed before hashing
        // This prevents re-hashing the password if it hasn't changed
        if(user.changed('password')) {
          const bcrypt = require('bcrypt');
          const saltRounds = 10;
          user.password = await bcrypt.hash(user.password, saltRounds);
        }
      }
    }
  });
  
  // Associations with Person model
  User.associate = function(models) {
    User.belongsTo(models.Person, {
      foreignKey: 'person_id',
    })
  }

  // Validate password method
  User.prototype.validatePassword = async function(password) {
    const bcrypt = require('bcrypt');
    return await bcrypt.compare(password, this.password);
  };

  // Generate JWT token method
  User.prototype.generateAuthToken = function() {
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ id: this.person_id }, process.env.JWT_SECRET, {
      expiresIn: '1h' // Token expiration time
    });
    return token;
  };
  
  return User;
};