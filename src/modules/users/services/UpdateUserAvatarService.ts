import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';
import fs from 'fs';
import path from 'path';
import { inject, injectable } from 'tsyringe';

import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequestDTO {
  user_id: string;
  avatarFilename: string;
}

@injectable()
class UpdateUserAvatarService {
  constructor(
    @inject('UsersRepository ')
    private userRepository: IUsersRepository,
  ) {}

  public async execute({
    user_id,
    avatarFilename,
  }: IRequestDTO): Promise<User> {
    const user = await this.userRepository.findById(user_id);

    if (!user) {
      throw new AppError('Only authenticate users can change avatar.', 401);
    }

    if (user.avatar) {
      // Caso exista um avatar anterior, vou deleta-lo

      const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar);
      const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath); // stat - trás um status de um arquivo só se ele existir

      if (userAvatarFileExists) {
        await fs.promises.unlink(userAvatarFilePath); // unlink - para deletar o arquivo anterior
      }
    }

    // como já tenho um user instanciado, não preciso cria-lo. Então vou apenas passar o valor para o meu
    user.avatar = avatarFilename;

    await this.userRepository.save(user);
    return user;
  }
}

export default UpdateUserAvatarService;
