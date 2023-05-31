const path = require('path');
const request = require('supertest');
const app = require('../server'); // Remplacez 'votre-app' par le chemin correct vers votre application Express

describe('Home Controller', () => {
  let agent;

  beforeAll(() => {
    agent = request.agent(app);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render the home page', async () => {
    const response = await agent.get('/');
    expect(response.status).toBe(200);

    const $ = cheerio.load(response.text);
    const pageTitle = $('title').text();
    expect(pageTitle).toBe('Unlock');

    expect(response.text).toContain('home.html');
    // Add additional assertions if necessary
  });

  it('should proceed to the next middleware if the game exists', async () => {
    const response = await agent.get('/build?game=example');
    expect(response.status).toBe(200);
    // Add additional assertions if necessary
  });

  it('should render the building page if the game does not exist', async () => {
    const response = await agent.get('/build?game=nonexistent');
    expect(response.status).toBe(200);
    expect(response.text).toContain('buildingpage.html');
    // Add additional assertions if necessary
  });

  it('should render the playground page', async () => {
    const response = await agent.get('/playground');
    expect(response.status).toBe(200);
    expect(response.text).toContain('playground.html');
    // Add additional assertions if necessary
  });

  afterAll(() => {
    app.close();
  });

});
