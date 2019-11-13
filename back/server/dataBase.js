const mysql = require('mysql');
const config = require('../config');

module.exports = class DataBase {
  constructor(params = {}){
    this.init();
  }

  init(){
    this.connection = mysql.createConnection(config.mysql);
  }

  async saveUser(user){
    let {id, email, first_name, last_name, avatar} = user;
    let sql = 'INSERT INTO users(id, email, first_name, last_name, avatar) VALUES (?) ON DUPLICATE KEY UPDATE email = VALUES(email)';

    return this.request(sql, [[id, email, first_name, last_name, avatar]]);
  }

  async getUserBy(key, value){
    let sql = `SELECT * FROM users WHERE ${key} = ?`;

    return await this.request(sql, [value]);
  }

  async getUserByFirstAndLastName(firstName, lastName){
    let sql = 'SELECT * FROM users WHERE first_name = ? AND last_name = ?';
    return await this.request(sql, [firstName, lastName]);
  }

  async request(sql, data) {
    return await new Promise((resolve, reject) => {
      this.connection.query(sql, data, function (error, results, fields) {
        if (error) reject(error);
        resolve(results);
      });
    })
  }

};