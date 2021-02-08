const agent = require('superagent');
const statusCode = require('http-status-codes');
const { expect/* , assert */ } = require('chai');

const urlBase = 'https://api.github.com';
// const githubUserName = 'Epalaciol';
const githubUserFollow = 'aperdomob';
describe('Consumiendo recursos PUT', () => {
  describe(`Start follow user ${githubUserFollow}`, () => {
    let response;

    before(async () => {
      response = await agent.put(`${urlBase}/user/following/${githubUserFollow}`)
        .set('User-Agent', 'agent')
        .auth('token', process.env.ACCESS_TOKEN);
    });

    it('Expected answer 204 and empty content', () => {
      expect(response.status).to.eql(statusCode.NO_CONTENT);
      expect(response.body).to.eql({});
    });
    describe(`verify that the user is followed ${githubUserFollow}`, () => {
      let usuariosSeguidos;

      before(async () => {
        const responseFollowing = await agent.get(`${urlBase}/user/following`)
          .set('User-Agent', 'agent')
          .auth('token', process.env.ACCESS_TOKEN);

        usuariosSeguidos = responseFollowing.body.find(
          (usuario) => usuario.login === githubUserFollow
        );
      });

      it(`user ${githubUserFollow} is in the list`, () => {
        expect(usuariosSeguidos.login).to.eql(githubUserFollow);
      });
    });
  });
  describe('Follow user again', () => {
    let responseAgain;

    before(async () => {
      responseAgain = await agent.put(`${urlBase}/user/following/${githubUserFollow}`)
        .set('User-Agent', 'agent')
        .auth('token', process.env.ACCESS_TOKEN);
    });

    it('Expected answer 204 and empty content again', () => {
      expect(responseAgain.status).to.eql(statusCode.NO_CONTENT);
      expect(responseAgain.body).to.eql({});
    });
    describe(`verify that the user is followed ${githubUserFollow} again`, () => {
      let usuariosSeguidos;

      before(async () => {
        const responseAgainFollowing = await agent.get(`${urlBase}/user/following`)
          .set('User-Agent', 'agent')
          .auth('token', process.env.ACCESS_TOKEN);

        usuariosSeguidos = responseAgainFollowing.body.find(
          (usuario) => usuario.login === githubUserFollow
        );
      });

      it(`user ${githubUserFollow} is in the list again`, () => {
        expect(usuariosSeguidos.login).to.eql(githubUserFollow);
      });
    });
  });
});
