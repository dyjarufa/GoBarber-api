import { Router } from 'express';
import { parseISO } from 'date-fns';
import { getCustomRepository } from 'typeorm';

import CreateAppointmentService from '../services/CreateAppointmentService';
import AppointmentRepository from '../repositories/AppointmentsRepository';
import ensureAthenticated from '../middlewares/ensureAthenticated';

const appointmentRouter = Router();

appointmentRouter.use(ensureAthenticated);

// const appointmentRepository = new AppointmentRepository();

appointmentRouter.get('/', async (request, response) => {
  console.log(request.user);

  const appointmentRepository = getCustomRepository(AppointmentRepository);
  const appointments = await appointmentRepository.find();

  return response.json(appointments);
});

appointmentRouter.post('/', async (request, response) => {
  const { provider_id, date } = request.body;

  const parsedDate = parseISO(date);

  const createAppointment = new CreateAppointmentService(); // Meu CreateAppointmentService já possui o appointmentRepository
  // const createAppointment = new CreateAppointmentService(
  //   appointmentRepository,
  // );

  const appointment = await createAppointment.excute({
    date: parsedDate,
    provider_id,
  });

  return response.json(appointment);
});

export default appointmentRouter;
