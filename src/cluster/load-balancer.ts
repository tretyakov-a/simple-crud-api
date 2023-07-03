import cluster from 'cluster';
import http from 'http';
import { config } from '../common/config.js';

const { PORT } = config;
let currentWorkerIndex = 0;

export default (numOfWorkers: number) => {
  const server = http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
    if (!cluster.workers) return;
  
    const workerId = currentWorkerIndex + 1;
    const port = PORT + workerId;
    const worker = cluster.workers[workerId];
    currentWorkerIndex = (currentWorkerIndex + 1) % numOfWorkers;
  
    if (!worker) return;
  
    const workerRequest = http.request({
      host: 'localhost',
      port,
      path: req.url,
      method: req.method,
      headers: req.headers
    }, (workerResponse: http.IncomingMessage) => {
      res.writeHead(
        workerResponse.statusCode || 200,
        workerResponse.statusMessage,
        workerResponse.headers
      );
      workerResponse.pipe(res);
    });
  
    req.pipe(workerRequest);
  });

  server.listen(PORT, (): void => console.log(`Load balancer is running on http://localhost:${PORT}`));
}
