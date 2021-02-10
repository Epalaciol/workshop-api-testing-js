const agent = require('superagent');
const statusCode = require('http-status-codes');
const { expect/* , assert */ } = require('chai');
const chai = require('chai');
chai.use(require('chai-subset'));

const urlBase = 'https://api.github.com';

describe('Delete method Consumed', () => {
  describe('Create a gist and a promise', () => {
    const promesa = `new Promise((resolve) => {
          setTimeout(() => {
            resolve('Hola, soy un test!');
          }, 4000);
        })`;
    const crearGist = {
      description: 'Este es el gist para un test',
      public: true,
      files: {
        'promise.js': {
          content: promesa
        }
      }
    };
    let firstGist;
    it('Post gist created and expect answer', async () => {
      const response = await agent.post(`${urlBase}/gists`, crearGist)
        .auth('token', process.env.ACCESS_TOKEN)
        .set('User-Agent', 'agent');

      firstGist = response.body;
      expect(response.status).to.equal(statusCode.CREATED);
      expect(response.body).containSubset(crearGist);
    });

    describe('Verify gist created', () => {
      it('test gist exist', async () => {
        const response = await agent.get(firstGist.url)
          .auth('token', process.env.ACCESS_TOKEN)
          .set('User-Agent', 'agent');

        expect(response.status).to.equal(statusCode.OK);
      });
    });
    describe('Delete gist', () => {
      it('gist deleted', async () => {
        const response = await agent.delete(firstGist.url)
          .auth('token', process.env.ACCESS_TOKEN)
          .set('User-Agent', 'agent');

        expect(response.status).to.equal(statusCode.NO_CONTENT);
      });
    });
    describe('Verify the gist was deleted successfully', () => {
      let response;
      before(async () => {
        try {
          await agent.get(firstGist.url)
            .auth('token', process.env.ACCESS_TOKEN)
            .set('User-Agent', 'agent');
        } catch (error) {
          response = error.status;
        }
      });
      it('Gist not exist', async () => {
        expect(response).to.equal(statusCode.NOT_FOUND);
      });
    });
  });
});
