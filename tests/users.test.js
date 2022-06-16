import supertest from 'supertest';
import server from '../dist/index.test.js';
import { validate as uuidValidate } from 'uuid';

const userData = {
  username: 'Valera',
  age: 30,
  hobbies: ['programming', 'reading'],
}

describe('Users test scenario 1', () => {
  let id = '';

  it('Get all records with a GET api/users request', async () => {
    const response = await supertest(server)
      .get('/api/users');
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual([]);
  });

  it('A new object is created by a POST api/users request', async () => {
    const response = await supertest(server)
      .post('/api/users')
      .set('Content-type', 'application/json')
      .send(JSON.stringify(userData));

    expect(response.status).toBe(201);
    id = response.body.id;
    expect(id).toBeDefined();
    expect(uuidValidate(id)).toBe(true);
  });

  it('With a GET api/user/{userId} request, we try to get the created record by its id', async () => {
    const response = await supertest(server)
      .get(`/api/users/${id}`);
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual({ ...userData, id });
  });

  it('We try to update the created record with a PUT api/users/{userId} request', async () => {
    const response = await supertest(server)
      .put(`/api/users/${id}`)
      .set('Content-type', 'application/json')
      .send(JSON.stringify({ age: 50 }));

    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual({ ...userData, id, age: 50 });
  });

  it('With a DELETE api/users/{userId} request, we delete the created object by id', async () => {
    const response = await supertest(server)
      .delete(`/api/users/${id}`);
    expect(response.status).toBe(204);
  });

  it('With a GET api/users/{userId} request, we are trying to get a deleted object by id', async () => {
    const response = await supertest(server)
      .get(`/api/users/${id}`);
    expect(response.status).toBe(404);
  });
});