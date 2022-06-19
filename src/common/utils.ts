
import path from 'path';
import { fileURLToPath } from 'url';
import { IncomingMessage } from 'http';

export const getConstants = (url: string) => {
  return {
    __dirname: path.dirname(fileURLToPath(url))
  };
}

export const readRequestBody = async (req: IncomingMessage | undefined): Promise<string> => {
  return new Promise((resolve, reject) => {
    let data = '';
    req?.on('error', (err) => { console.error(err); reject(err) });
    req?.on('data', (chunk: Buffer) => data += chunk.toString());
    req?.on('end', () => {
      resolve(data);
    })
  });
}

export const checkType = <T>(v: T, type: string): boolean => {
  if (v === undefined) return true;
  return typeof v === type;
}
