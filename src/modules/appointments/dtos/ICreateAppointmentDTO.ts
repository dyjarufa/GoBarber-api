/* DTO - sempre que precisamos de informações compostas que irão se repetir na aplicação */
export default interface ICreateAppointmentDTO {
  provider_id: string;
  date: Date;
}
