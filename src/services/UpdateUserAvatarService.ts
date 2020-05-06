import { getRepository } from 'typeorm';
import path from 'path';
import fs from 'fs';
import User from '../models/User';
import uploadConfig from '../config/upload';
import AppError from '../errors/AppError';

interface RequestDTO {
  user_id: string;
  avatarFilename: string;
}
class UpdateUserAvatarService {
  public async execute({ user_id, avatarFilename }: RequestDTO): Promise<User> {
    const userRepository = getRepository(User);

    const user = await userRepository.findOne(user_id);

    if (!user) {
      throw new AppError('Only authenticate users can change avatar.', 401);
    }

    if (user.avatar) {
      // Caso exista um avatar anterio, vou deleta-lo

      const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar);
      const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath); // stat - trás um status de um arquivo só se ele existir

      if (userAvatarFileExists) {
        await fs.promises.unlink(userAvatarFilePath); // unlink - para deletar o arquivo anterior
      }
    }

    // como já tenho um user instanciado, não preciso cria-lo. Então vou apenas passar o valor para o meu
    user.avatar = avatarFilename;

    await userRepository.save(user);
    return user;
  }
}

export default UpdateUserAvatarService;
