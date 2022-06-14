import { IncomingMessage } from 'http';

export const readRequestBody = async (req: IncomingMessage): Promise<string> => {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('error', reject);
    req.on('data', (chunk) => data += chunk.toString());
    req.on('end', () => {
      resolve(data);
    })
  });
}