import UpdateUserServiceAvatar from '@modules/users/services/UpdateUserAvatarService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class UserAvatarController {
  public async update(request: Request, response: Response): Promise<Response> {
    const updateUserService = container.resolve(UpdateUserServiceAvatar);

    const user = await updateUserService.execute({
      user_id: request.user.id,
      avatarFilename: request.file.filename,
    });

    delete user.password;

    // console.log(request.file);
    // return response.json({ ok: true });

    return response.json(user);
  }
}
