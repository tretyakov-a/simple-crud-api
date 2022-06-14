import dotenv from 'dotenv';
import path from 'path';

type Config = {
  PORT: string | undefined,
}

dotenv.config({
  path: path.join(__dirname, '../../.env'),
});

export const config: Config = {
  PORT: process.env.PORT,
};
