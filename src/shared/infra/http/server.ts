import 'reflect-metadata';

import 'express-async-errors';

import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';
import cors from 'cors';
import express, { Request, Response, NextFunction } from 'express';

import routes from './routes';

import '@shared/container';
import '@shared/infra/typeorm';

const app = express();

app.use(cors()); // define qual site pode acessar a nossa aplicação

app.use(express.json());
app.use('/files', express.static(uploadConfig.directory)); // Visualizar de forma estática
app.use(routes);

// middleware para tratar erro - usado após as rotas - recebe 4 parâmetros
app.use(
  (err: Error, request: Request, response: Response, _next: NextFunction) => {
    /* aqui verifico se foi um erro originado da minha aplicação */
    if (err instanceof AppError) {
      // erro conhecido pela aplicação
      return response.status(err.statusCode).json({
        status: 'error',
        message: err.message,
      });
    }

    console.error(err);

    /* erro não tratado pela minha aplicação */
    return response.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  },
);

app.listen(3333, () => {
  console.log(' 🚀 Server start on port 3333 😃');
});
