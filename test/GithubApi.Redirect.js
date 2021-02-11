const agent = require('superagent');
const statusCode = require('http-status-codes');
const { expect/* , assert */ } = require('chai');

describe('HEAD Method will consumed ', () => {
  const redirectUrl = 'https://github.com/aperdomob/redirect-test';
  const answerUrl = 'https://github.com/aperdomob/new-redirect-test';
  let response;

  it('Head to the repo given', async () => {
    try {
      await agent.head(redirectUrl);
    } catch (error) {
      response = error;
    }
    expect(response.response.headers.location).to.equal(answerUrl);
    expect(response.status).to.equal(statusCode.MOVED_PERMANENTLY);
  });
  describe('Consume the new URL ', () => {
    it('the url is redirect to the new', async () => {
      response = await agent.get(redirectUrl);
      expect(response.status).to.equal(statusCode.OK);
    });
  });
});
