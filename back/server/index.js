const express = require('express');
const DataBase = require('./dataBase');
const config = require('../config');
const request = require('request-promise');
const _ = require('lodash');

module.exports = class Server{
  constructor(){
    this.db = new DataBase();
    this.status = 0;

    this.app = express();

    this.updateUsers();
    this.initUserUpdateInterval();
    this.initRoutes();
  }

  initRoutes(){
    this.app.use(function(req, res, next) {
      res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
      res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
      res.setHeader('Access-Control-Allow-Credentials', true);
      next();
    });

    this.app.get('/getUsers', async (req, res) => {
      let firstName = req.query.firstName;
      let lastName = req.query.lastName;

      if (firstName && lastName) {
        res.send(await this.getUserByFirstAndLastName(firstName, lastName))
      } else if (firstName){
        res.send(await this.getUserByFirstName(firstName));
      } else if (lastName){
        res.send(await this.getUserByLastName(lastName));
      } else {
        res.send([]);
      }
    });
  }

  initUserUpdateInterval() {
    setInterval(async ()=> {
      await this.updateUsers()
    }, config.userUpdateInterval)
  }

  async updateUsers(){
    let usersData = JSON.parse(await this.fetchUsers());

    for (let user of usersData.data){
      this.db.saveUser(user);
    }
  }

  async start(){
    return new Promise((resolve, reject) => {
      this.app.listen(config.port, () => {
        this.setStatus('running');
        resolve();
      });
    });
  }

  async fetchUsers(){
    return request('https://reqres.in/api/users')
      .catch(function (err) {
        // todo обработать
        console.log('err', err);
      });
  }

  async getUserByLastName(lastName){
    return this.db.getUserBy('last_name', lastName);
  }

  async getUserByFirstName(firstName){
    return this.db.getUserBy('first_name', firstName);
  }

  async getUserByFirstAndLastName(firstName, lastName){
    return this.db.getUserByFirstAndLastName(firstName, lastName);
  }

  static getStatusId (statusName) {
    let list = Server.getStatusList();
    if (!(statusName in list)) throw new Error('Unknown status '+statusName);
    return list[statusName];
  }

  static getStatusName (statusId) {
    let list = Server.getStatusList();
    if (!(statusId in list)) throw new Error('Unknown status '+statusId);
    return list[statusId];
  }

  setStatus(statusName) {
    let statusId = Server.getStatusId(statusName);
    if (_.isUndefined(statusId)) throw new Error(status + ' is not in status list');

    this.status = statusId;
  }

  static getStatusList(){
    return {
      down: 0,
      running: 1
    }
  }
};