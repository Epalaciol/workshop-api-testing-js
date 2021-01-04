const agent = require('superagent');
const statusCode = require('http-status-codes');
const chai = require('chai');
const { it } = require('mocha');

const { expect } = chai;

describe('First Api Tests', () => {
  // Consumiendo servicios GET
  it('Consume Get Service', async () => {
    const response = await agent.get('https://httpbin.org/ip');

    expect(response.status).to.equal(statusCode.OK);
    expect(response.body).to.have.property('origin');
  });

  it('Consume GET Service with query parameters', async () => {
    const query = {
      name: 'John',
      age: '31',
      city: 'New York'
    };

    const response = await agent.get('https://httpbin.org/get').query(query);

    expect(response.status).to.equal(statusCode.OK);
    expect(response.body.args).to.eql(query);
  });

  // Consumiendo servicios HEAD
  it('Consume HEAD Service', async () => {
    const response = await agent.head('https://httpbin.org/ip');

    expect(response.status).to.equal(statusCode.OK);
    expect(response.header).to.have.property('connection');
  });

  it('Consume PATCH Service', async () => {
    const body = {
      name: 'John',
      age: '31',
      city: 'New York'
    };

    const response = await agent.patch('https://httpbin.org/patch').send(body);

    expect(response.status).to.equal(statusCode.OK);
    expect(response.body.json).to.eql(body);
  });

  it('Consume PUT Service', async () => {
    const body = {
      name: 'John',
      age: '31',
      city: 'New York'
    };

    const response = await agent.put('https://httpbin.org/put').send(body);

    expect(response.status).to.equal(statusCode.OK);
    expect(response.body.json).to.eql(body);
  });

  it('Consume DELETE Service', async () => {
    const body = {
      name: 'John',
      age: '31',
      city: 'New York'
    };

    const response = await agent.delete('https://httpbin.org/delete').send(body);

    expect(response.status).to.equal(statusCode.OK);
    expect(response.body.json).to.eql(body);
  });
});
