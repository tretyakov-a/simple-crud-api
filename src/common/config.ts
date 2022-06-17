import dotenv from 'dotenv';
import path from 'path';
import { getConstants } from './utils.js';

const { __dirname } = getConstants(import.meta.url);

type Config = {
  PORT: number,
}

dotenv.config({
  path: path.join(__dirname, '../../.env'),
});

export const config: Config = {
  PORT: Number(process.env.PORT) || 3000,
};
