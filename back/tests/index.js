const chai = require('chai');
const expect = chai.expect;
const Server = require('../server');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

describe('server', () => {
  let server;

  before(async function () {
    server = new Server();

    await server.init();

    server.start();
  });

  it('should start server', async function () {
    expect(server.status).to.be.equal(Server.getStatusId('running'));
  });

  it('should fetch users', async function () {
    let response = await server.fetchUsers();

    expect(response).to.be.a('String');

    response = JSON.parse(response);
    expect(response).to.have.property('data');

    expect(response.data).to.have.lengthOf.least(0);
    for (let user of response.data){
      expect(user).to.have.property('id');
      expect(user).to.have.property('email');
      expect(user).to.have.property('first_name');
      expect(user).to.have.property('last_name');
      expect(user).to.have.property('avatar');
    }
  });

  it('should get users by first name', async function () {
    let users = await server.getUserByFirstName('George');

    expect(users).to.have.lengthOf.least(0);
    for (let user of users){
      expect(user).to.have.property('id');
      expect(user).to.have.property('email');
      expect(user).to.have.property('first_name');
      expect(user).to.have.property('last_name');
      expect(user).to.have.property('avatar');
    }
  });

  it('should get users by last name', async function () {
    let users = await server.getUserByLastName('Morris');

    expect(users).to.have.lengthOf.least(0);
    for (let user of users){
      expect(user).to.have.property('id');
      expect(user).to.have.property('email');
      expect(user).to.have.property('first_name');
      expect(user).to.have.property('last_name');
      expect(user).to.have.property('avatar');
    }
  });

  it('should get users by first and last name', async function () {
    let users = await server.getUserByFirstAndLastName('Tracey', 'Ramos');

    expect(users).to.have.lengthOf.least(0);
    for (let user of users){
      expect(user).to.have.property('id');
      expect(user).to.have.property('email');
      expect(user).to.have.property('first_name');
      expect(user).to.have.property('avatar');
    }
  });
});