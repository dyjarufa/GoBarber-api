import authConfig from '@config/auth';
import AppError from '@shared/errors/AppError';
import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

interface ITokenPayload {
  iat: number; // quando o token foi gerado
  exp: number; // data de expiração
  sub: string; // qual usuário que criou esse token
}

export default function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError('JWT token is missing', 401);
  }

  const [, token] = authHeader.split(' '); // pego o segundo parâmetro que é o token

  try {
    const decoded = verify(token, authConfig.jwt.secret);

    /* decoded possui o payload do meu usuario */
    const { sub } = decoded as ITokenPayload; // Tranformar uma constante em ojbeto (forçar um tipo de variável)

    /* hack - precisei modificar o tipo de retorno do request na biblioteca do express no arquivo  @types */
    request.user = {
      id: sub,
    };

    return next();
  } catch {
    // versões atuais do ts posso omitir a var err
    throw new AppError('Invalid JWT token', 401);
  }
}
