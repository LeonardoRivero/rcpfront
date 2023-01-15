export class Messages {
  private static instance: Messages;
  private constructor() {
    return;
  }
  public static getInstance(): Messages {
    if (!Messages.instance) {
      Messages.instance = new Messages();
    }
    return Messages.instance;
  }
  get successMessage(): string {
    return 'Datos Guardados Exitosamente';
  }
  get errorMessage(): string {
    return 'Ocurrio un error. Intentalo de nuevo';
  }
  get isNotAdult(): string {
    return 'Paciente menor de edad';
  }
  get notInfoFound(): string {
    return 'No se encontró información';
  }
  get searchIncorrect(): string {
    return 'Busqueda incorrecta o campos invalidos';
  }
  get updateSuccesfully(): string {
    return 'Datos actualizados correctamente';
  }
  get notFoundInfoPatient(): string {
    return 'No encontramos el paciente con la información suministrada, ¿Deseas crearlo ahora mismo ?';
  }
  get dateOrHourNotValid(): string {
    return 'Hora o fecha ingresada no es valida.Intentelo de nuevo';
  }
  get newRegister(): string {
    return '¿Haz verificado los datos para crear el nuevo registro?';
  }
  get updateRegister(): string {
    return '¿Deseas actualizar los datos ingresados?';
  }
  get deleteRegister(): string {
    return '¿Estas seguro de borrar el registro seleccionado?.Esta acción no podra ser revertida';
  }
  get scheduleExisting(): string {
    return 'Ya existe una cita agendada para esa hora.';
  }
  get patientNotSchedule(): string {
    return 'Paciente no posee una consulta agendada para hoy. Deseas agendarla ahora mismo?';
  }
  get connectionFailure(): string {
    return 'Conexion inestable o error al obtener datos!';
  }
  get patientNotSaved(): string {
    return 'Existen datos invalidos, verifiquelos e intente de nuevo';
  }
}
