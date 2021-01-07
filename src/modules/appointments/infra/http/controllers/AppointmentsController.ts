// import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';
import { parseISO } from 'date-fns';
import { Response, Request } from 'express';
import { container } from 'tsyringe';

export default class AppointmentsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { provider_id, date } = request.body;

    const parsedDate = parseISO(date);

    /*
      container.service carrega o CreateAppointmentService
      identifica no constructor se precisa de alguma dependencia
      verifica no container.ts de possui alguma dependência cadastrada conforme informada no @inject
      cria uma instância da classe AppointmentRepository

    */
    const createAppointment = container.resolve(CreateAppointmentService);

    const appointment = await createAppointment.excute({
      date: parsedDate,
      provider_id,
    });

    return response.json(appointment);
  }
}
