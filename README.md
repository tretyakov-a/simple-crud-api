# CRUD API
Simple CRUD API using in-memory database underneath

[Assignment](https://github.com/AlreadyBored/nodejs-assignments/blob/main/assignments/crud-api/assignment.md)

# Installation
You need Node.js installed to run this application
```bash
git clone <this-repository> <folder>
cd <folder>
npm install
```

# Usage
To run in production mode, use
```bash
npm run start:prod
```
To start multiple instances of your application using the Node.js Cluster, use
```bash
npm run start:multi
```
To run in development  mode, use
```bash
npm run start:dev
```
To run tests no need to run application in parallel, just use
```bash
npm run test
```

# Implemented endpoints

- **GET** `api/users` is used to get all persons
- **GET** `api/users/${userId}` is used to get person by id
- **POST** `api/users` is used to create record about new user and store it in database
  - you need to provide following fields in request (in json format, all of them are required):
    - *username* — user's name (string)
    - *age* — user's age (number)
    - *hobbies* — user's hobbies (array of strings or empty array)
- **PUT** `api/users/{userId}` is used to update existing user
  - you need to provide some of following fields in request (in json format):
    - *username* — user's name (string)
    - *age* — user's age (number)
    - *hobbies* — user's hobbies (array of strings or empty array)
- **DELETE** `api/users/${userId}` is used to delete existing user from database

