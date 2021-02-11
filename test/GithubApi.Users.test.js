const agent = require('superagent');
const statusCode = require('http-status-codes');
const { expect/* , assert */ } = require('chai');

const urlBase = 'https://api.github.com';

describe('Query parameters test ', () => {
  describe('Get defect users', () => {
    it('Verify the number of users defect', async () => {
      const response = await agent.get(`${urlBase}/users`)
        .auth('token', process.env.ACCESS_EXPORT)
        .set('User-Agent', 'agent');

      expect(response.status).to.equal(statusCode.OK);
      expect(response.body.length).to.equal(30);
    });
  });

  describe('Get 10 users', () => {
    it('Verify the number of users (10)', async () => {
      const response = await agent.get(`${urlBase}/users`)
        .auth('token', process.env.ACCESS_EXPORT)
        .set('User-Agent', 'agent')
        .query({ per_page: 10 });

      expect(response.status).to.equal(statusCode.OK);
      expect(response.body.length).to.equal(10);
    });
  });

  describe('Get 50 users', () => {
    it('Verify the number of users (50)', async () => {
      const response = await agent.get(`${urlBase}/users`)
        .auth('token', process.env.ACCESS_EXPORT)
        .set('User-Agent', 'agent')
        .query({ per_page: 50 });

      expect(response.status).to.equal(statusCode.OK);
      expect(response.body.length).to.equal(50);
    });
  });
});
