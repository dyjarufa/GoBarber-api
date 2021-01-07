import uploadConfig from '@config/upload';
import { Router } from 'express';
import multer from 'multer';

import UserAvatarController from '../controllers/UserAvatarController';
import UsersController from '../controllers/UsersController';
import ensureAuthenticated from '../middlewares/ensureAthenticated';

const userRouter = Router();

const usersController = new UsersController();

const userAvatarController = new UserAvatarController();

const upload = multer(uploadConfig);

userRouter.post('/', usersController.create);

/* patch usado para modificar uma informação única */
userRouter.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar') /* single - faz o upload de um único arquivo */,
  userAvatarController.update,
);
export default userRouter;
