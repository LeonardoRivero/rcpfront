export enum Messages {
  successMessage = 'Datos Guardados Exitosamente',
  errorMessage = 'Ocurrio un error. Intentalo de nuevo',
  isNotAdult = 'Paciente menor de edad',
  notInfoFound = 'No se encontró información',
  searchIncorrect = 'Busqueda incorrecta o campos invalidos',
  updateSuccesfully = 'Datos actualizados correctamente',
  notFoundInfoPatient = 'No encontramos el paciente con la información suministrada, ¿Deseas crearlo ahora mismo?',
  dateOrHourNotValid = 'Hora o fecha ingresada no es valida.Intentelo de nuevo',
  newRegister = '¿Haz verificado los datos para crear el nuevo registro?',
  updateRegister = '¿Deseas actualizar los datos ingresados?',
  deleteRegister = '¿Estas seguro de borrar el registro seleccionado?.Esta acción no podra ser revertida',
  scheduleExisting = 'Ya existe una cita agendada para esa hora.',
  patientNotSchedule = 'Paciente no posee una consulta agendada para hoy. Deseas agendarla ahora mismo?',
  connectionFailure = 'Conexion inestable o error al obtener datos!',
  patientNotSaved = 'Existen datos invalidos, verifiquelos e intente de nuevo',
  requiredForDelete = 'Campo requerido para eliminar registro',
  appointmentNotFound = 'Consulta no ha sido registrada. Deseas registrarla ahora mismo?',
  failedConfirmEmail = 'No fue posible verificar tu email',
  sucessConfirmEmail = 'Email verificado correctamente',
  verifyEmailSucess = 'Solicitud procesada correctamente. Verifica tu email',
  resetEmailSucess = 'Credenciales restauradas correctamente',
  invalidConfirmCredentials = 'Las nuevas credenciales no coinciden en su verificacion',
  invalidResetCredentials = 'No fue posible reestablecer tus credenciales',
  intervalHourInvalid = 'Uno o mas intevalo de hora es invalido'
}
