const agent = require('superagent');
// const statusCode = require('http-status-codes');
const { expect/* , assert */ } = require('chai');

const urlBase = 'https://api.github.com';

describe('Obtain the logged user', () => {
  let usuario;
  it('Should have a public repositorie', async () => {
    const response = await agent.get(`${urlBase}/user`)
      .auth('token', process.env.ACCESS_TOKEN)
      .set('User-Agent', 'agent');
    usuario = response.body;
    expect(usuario.public_repos).not.equal(0);
  });

  describe('Get all repositories', () => {
    let randomRepository;

    it('Should have a repository', async () => {
      const response = await agent.get(usuario.repos_url)
        .set('User-Agent', 'agent')
        .auth('token', process.env.ACCESS_TOKEN);
      // const tamRepos = (response.body).length;
      // const escogencia = Math.floor(Math.random() * tamRepos);
      randomRepository = (response.body)[0];

      expect(randomRepository).not.equal(undefined);
    });

    describe('Creat an issue', () => {
      const nuevaIssue = { title: 'Esta es una issue' };
      let issue;

      it('Issue should be created (POST)', async () => {
        const response = await agent.post(`${randomRepository.url}/issues`, nuevaIssue)
          .auth('token', process.env.ACCESS_TOKEN)
          .set('User-Agent', 'agent');

        issue = response.body;

        expect(issue.title).to.equal(nuevaIssue.title);
        expect(issue.body).to.equal(null);
      });

      describe('Modify issue (PATCH)', () => {
        const actualizarIssue = { body: 'Este es el cuerpo nuevo' };

        it('Verify body added', async () => {
          const response = await agent.patch(`${randomRepository.url}/issues/${issue.number}`, actualizarIssue)
            .auth('token', process.env.ACCESS_TOKEN)
            .set('User-Agent', 'agent');

          expect(response.body.title).to.equal(nuevaIssue.title);
          expect(response.body.body).to.equal(actualizarIssue.body);
        });
      });
    });
  });
});
