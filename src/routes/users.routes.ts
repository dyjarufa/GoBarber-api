import { Router } from 'express';

import multer from 'multer';
import CreateUserService from '../services/CreateUserService';
import UpdateUserServiceAvatar from '../services/UpdateUserAvatarService';

import ensureAuthenticated from '../middlewares/ensureAthenticated';

import uploadConfig from '../config/upload';

const userRouter = Router();

const upload = multer(uploadConfig);

userRouter.post('/', async (request, response) => {
  const { name, email, password } = request.body;

  const createUser = new CreateUserService();

  const user = await createUser.excute({
    name,
    email,
    password,
  });

  delete user.password; // deletar o retorno do password

  return response.json(user);
});

userRouter.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  async (request, response) => {
    const updateUserService = new UpdateUserServiceAvatar();

    const user = await updateUserService.execute({
      user_id: request.user.id,
      avatarFilename: request.file.filename,
    });

    delete user.password;

    return response.json(user);

    // console.log(request.file);
    // return response.json({ ok: true });
  },
);
export default userRouter;
