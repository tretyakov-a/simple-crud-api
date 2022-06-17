import supertest from 'supertest';
import server from '../dist/index.test.js';
import { validate as uuidValidate } from 'uuid';

const userData = {
  username: 'Valera',
  age: 30,
  hobbies: ['programming', 'reading'],
}

describe('1: Testing normal flow', () => {
  let id = '';
  const request = supertest(server);

  it('With a GET api/users request, we try to get all users', async () => {
    const response = await request.get('/api/users');
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual([]);
  });

  it('With a POST api/users request, we try to create a new record', async () => {
    const response = await request
      .post('/api/users')
      .set('Content-type', 'application/json')
      .send(JSON.stringify(userData));

    expect(response.status).toBe(201);
    id = response.body.id;
    expect(id).toBeDefined();
    expect(uuidValidate(id)).toBe(true);
  });

  it('With a GET api/user/{userId} request, we try to get the created record by its id', async () => {
    const response = await request.get(`/api/users/${id}`);
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual({ ...userData, id });
  });

  it('With a PUT api/users/{userId} request, we try to update the created record', async () => {
    const response = await request
      .put(`/api/users/${id}`)
      .set('Content-type', 'application/json')
      .send(JSON.stringify({ age: 50 }));

    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual({ ...userData, id, age: 50 });
  });

  it('With a DELETE api/users/{userId} request, we delete the created object by id', async () => {
    const response = await request.delete(`/api/users/${id}`);
    expect(response.status).toBe(204);
  });

  it('With a GET api/users/{userId} request, we are trying to get a deleted object by id', async () => {
    const response = await request.get(`/api/users/${id}`);
    expect(response.status).toBe(404);
  });
});

describe('2: Testing userId errors', () => {
  const request = supertest(server);
  const nonExistingId = 'a97fac64-0ccb-4cba-9014-37b65ed28ea7';
  const invalidId = 'a97fac64-0ccb-4cba-9014';

  it('With a GET api/user/{userId} request, we try to get existing record', async () => {
    const response = await request.get(`/api/users/${nonExistingId}`);
    expect(response.status).toBe(404);
    expect(response.text).toBe(`Record with userId 'a97fac64-0ccb-4cba-9014-37b65ed28ea7' doesn't exist`);
  });

  it('With a GET api/user/{userId} request, we try to get record using invalid id', async () => {
    const response = await request.get(`/api/users/${invalidId}`);
    expect(response.status).toBe(400);
    expect(response.text).toBe(`Invalid userId: 'a97fac64-0ccb-4cba-9014'`);
  });

  it('With a PUT api/users/{userId} request, we try to update non existing record', async () => {
    const response = await request
      .put(`/api/users/${nonExistingId}`)
      .set('Content-type', 'application/json')
      .send(JSON.stringify({ age: 50 }));

    expect(response.status).toBe(404);
    expect(response.text).toBe(`Record with userId 'a97fac64-0ccb-4cba-9014-37b65ed28ea7' doesn't exist`);
  });

  it('With a PUT api/users/{userId} request, we try to update record using invalid id', async () => {
    const response = await request
      .put(`/api/users/${invalidId}`)
      .set('Content-type', 'application/json')
      .send(JSON.stringify({ age: 50 }));

    expect(response.status).toBe(400);
    expect(response.text).toBe(`Invalid userId: 'a97fac64-0ccb-4cba-9014'`);
  });

  it('With a DELETE api/users/{userId} request, we try to delete non existing record', async () => {
    const response = await request.delete(`/api/users/${nonExistingId}`);

    expect(response.status).toBe(404);
    expect(response.text).toBe(`Record with userId 'a97fac64-0ccb-4cba-9014-37b65ed28ea7' doesn't exist`);
  });

  it('With a DELETE api/users/{userId} request, we try to delete record using invalid id', async () => {
    const response = await request.delete(`/api/users/${invalidId}`);

    expect(response.status).toBe(400);
    expect(response.text).toBe(`Invalid userId: 'a97fac64-0ccb-4cba-9014'`);
  });
});


describe('3: Testing data errors', () => {
  const request = supertest(server);

  const notFullyFilledUserData = {
    username: 'Valera',
  }

  it('With a POST api/users request, we try to create new record with not filled required field', async () => {
    const response = await request
      .post('/api/users')
      .set('Content-type', 'application/json')
      .send(JSON.stringify(notFullyFilledUserData));
    expect(response.status).toBe(400);
    expect(response.text).toBe(`Request should contain required fields in json format: 'username, age, hobbies'`);
  });

  it('With a GET api/users request, we try to get all records after wrong POST', async () => {
    const response = await request.get('/api/users');
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual([]);
  });

  it('With a POST api/users request, we try to create new record using invalid Content-type', async () => {
    const response = await request
      .post('/api/users')
      .set('Content-type', 'text/plain')
      .send(JSON.stringify(userData));
    expect(response.status).toBe(400);
    expect(response.text).toBe(`Request should contain required fields in json format: 'username, age, hobbies'`);
  });

  it('With a PUT api/users/{userId} request, we try to update record using invalid Content-type', async () => {
    const response = await request
      .post('/api/users/a97fac64-0ccb-4cba-9014-37b65ed28ea7')
      .set('Content-type', 'text/plain')
      .send(JSON.stringify(userData));
    expect(response.status).toBe(400);
    expect(response.text).toBe(`Request should contain required fields in json format: 'username, age, hobbies'`);
  });
});


describe('4: Testing invalid endpoints', () => {
  let id = '';
  const request = supertest(server);

  it('With a POST api/users request, we create a new record', async () => {
    const response = await request
      .post('/api/users')
      .set('Content-type', 'application/json')
      .send(JSON.stringify(userData));

    expect(response.status).toBe(201);
    id = response.body.id;
    expect(id).toBeDefined();
    expect(uuidValidate(id)).toBe(true);
  });

  it('With a wrong GET api/person request, we try to get all records', async () => {
    const response = await request.get('/api/person');
    expect(response.status).toBe(404);
    expect(response.text).toBe(`Endpoint '/api/person' doesn't exist`);
  });

  it('With a wrong GET api/users/{userId}/something request, we try to get record with userId', async () => {
    const response = await request.get(`/api/users/${id}/something`);
    expect(response.status).toBe(404);
    expect(response.text).toBe(`Endpoint '/api/users/${id}/something' doesn't exist`);
  });
});