
import path from 'path';
import { fileURLToPath } from 'url';
import { IncomingMessage } from 'http';

export const getConstants = (url: string) => {
  return {
    __dirname: path.dirname(fileURLToPath(url))
  };
}

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