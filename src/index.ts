import http from 'http';
import { App } from './app.js';
import { UserDB } from './users/user-db.js';
import { config } from './common/config';

type Url = {
  location: string,
  id?: string,
}

const parseUrl = (urlStr: string = ''): Url | null => {
  const match = urlStr.match(/^\/api\/users(?:\/(.*)){0,1}$/);
  if (!match) {
    return null;
  }
  const [ location, id ] = match;
  const url: Url = { location };
  return id === undefined ? url : { id, ...url };
};

async function initApp() {
  const { PORT } = config;
  const userService: UserDB = new UserDB();
  await userService.initDb('users.json');

  const app = new App(userService);

  const myServer = http.createServer(async (req, res) => {
    const url: Url | null = parseUrl(req.url);
    if (!url) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=UTF-8' });
      res.end(`Resourse ${req.url} is not found`);
    }

    if (req.method === 'GET' && url?.id === undefined) {
      return await app.getAllUsers(req, res);
    }
  
    if (req.method === 'GET' && url?.id !== undefined) {
      return await app.getUserById(req, res, url.id);
    }

    if (req.method === 'POST') {
      return await app.postUser(req, res);
    }
  });
  
  myServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}. Go to http://localhost:${PORT}/`);
  });
}

initApp();
