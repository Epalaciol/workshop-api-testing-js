const agent = require('superagent');
const statusCode = require('http-status-codes');
const { expect, assert } = require('chai');
const chai = require('chai');
const chaiSubset = require('chai-subset');

chai.use(chaiSubset);
const md5 = require('md5');

const urlBase = 'https://api.github.com';
const githubUserName = 'aperdomob';

describe('Consumiendo Recursos Get', () => {
  let response;
  let repositorioExpected;
  let repositorios;
  let repositorio;
  describe(`Loading ${githubUserName} data`, () => {
    before(async () => {
      response = await agent.get(`${urlBase}/users/${githubUserName}`)
        .auth('token', process.env.ACCESS_TOKEN)
        .set('User-Agent', 'agent');
    });

    it('Aperdomob Services', () => {
      expect(response.status).to.equal(statusCode.OK);
      expect(response.body.name).to.equal('Alejandro Perdomo');
      expect(response.body.company).to.equal('PSL');
      expect(response.body.location).to.equal('Colombia');
    });
  });
  describe(`Getting specific repo from ${githubUserName}`, () => {
    before(async () => {
      repositorioExpected = 'jasmine-awesome-report';
      response = await agent.get(`${urlBase}/users/${githubUserName}/repos`)
        .set('User-Agent', 'agent');

      repositorios = response.body;
      repositorio = repositorios.find((repos) => repos.name === repositorioExpected);
    });
    it('Aperdomob Repositories', () => {
      expect(response.status).to.equal(statusCode.OK);
      expect(repositorio.name).to.equal(repositorioExpected);
      expect(repositorio.private).to.equal(false);
      expect(repositorio.description).to.equal('An awesome html report for Jasmine');
    });
  });
  describe('Download and verify repository', () => {
    let archivoZip;

    before(async () => {
      repositorioExpected = 'jasmine-awesome-report';

      response = await agent.get(`${urlBase}/users/${githubUserName}/repos`)
        .set('User-Agent', 'agent');
      repositorios = response.body;
      repositorio = repositorios.find((repos) => repos.name === repositorioExpected);
      const descargaRepositorio = await agent.get(`${repositorio.svn_url}/archive/${repositorio.default_branch}.zip`)
        .auth('token', process.env.ACCESS_TOKEN)
        .set('User-Agent', 'agent')
        .buffer(true);

      archivoZip = descargaRepositorio.text;

      it(' Repository had been downloaded', async () => {
        expect(md5(archivoZip)).to.not.equal('');
      });
    });
    describe('Verify README.md information ', async () => {
      const datosEsperados = {
        name: 'README.md',
        path: 'README.md',
        sha: '1eb7c4c6f8746fcb3d8767eca780d4f6c393c484'
      };
      let archivos;
      let readme;
      before(async () => {
        const readmeConsulta = await agent.get(`${repositorio.url}/contents`)
          .auth('token', process.env.ACCESS_TOKEN)
          .set('User-Agent', 'agent');

        archivos = readmeConsulta.body;
        readme = archivos.find((archivo) => archivo.name === 'README.md');
      });

      it('repo should contain README.md', () => {
        assert.exists(readme);
        expect(readme).containSubset(datosEsperados);
      });

      describe('when get the file content', () => {
        const expectedMd5 = '97ee7616a991aa6535f24053957596b1';
        let fileContent;

        before(async () => {
          const downloadReadmeQuery = await agent.get(readme.download_url);
          fileContent = downloadReadmeQuery.text;
        });

        it('then the file should be downloaded', () => {
          expect(md5(fileContent)).to.equal(expectedMd5);
        });
      });
    });
  });
});
