import ensureAthenticated from '@modules/users/infra/http/middlewares/ensureAthenticated';
import { Router } from 'express';

import AppointmentsController from '../controllers/AppointmentsController';

const appointmentRouter = Router();

const appointmentsController = new AppointmentsController();

appointmentRouter.use(ensureAthenticated);

// appointmentRouter.get('/', async (request, response) => {
//   console.log(request.user);

//   const appointments = await appointmentRepository.find();

//   return response.json(appointments);
// });

appointmentRouter.post('/', appointmentsController.create);

export default appointmentRouter;
