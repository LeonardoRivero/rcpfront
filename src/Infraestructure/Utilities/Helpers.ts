import currency from 'currency.js';
import { IHelpers } from 'src/Domine/ICommons';

export class Helpers implements IHelpers {
  calculateAge(fechaNacimientoStr: string): string {
    const fechaNacimiento = new Date(fechaNacimientoStr);
    const fechaActual = new Date();

    if (isNaN(fechaNacimiento.getTime())) {
      return '';
    }
    let edadAnios = fechaActual.getFullYear() - fechaNacimiento.getFullYear();

    if (edadAnios < 0) {
      return ''
    }
    const mesActual = fechaActual.getMonth();
    const mesNacimiento = fechaNacimiento.getMonth();
    const diaActual = fechaActual.getDate();
    const diaNacimiento = fechaNacimiento.getDate();

    if (mesActual < mesNacimiento || (mesActual === mesNacimiento && diaActual < diaNacimiento)) {
      edadAnios--;
    }

    if (edadAnios >= 1) {
      return (`${edadAnios} año${edadAnios > 1 ? 's' : ''}`);
    } else {
      let edadMeses = mesActual - mesNacimiento;
      if (diaActual < diaNacimiento) {
        edadMeses--;
      }
      if (edadMeses < 0) {
        edadMeses += 12;
      }

      if (edadMeses >= 1) {
        return (`${edadMeses} mes${edadMeses > 1 ? 'es' : ''}`);
      } else {
        const diferenciaEnDias = Math.floor((fechaActual.getTime() - fechaNacimiento.getTime()) / (1000 * 3600 * 24));
        return (`${diferenciaEnDias} día${diferenciaEnDias > 1 ? 's' : ''}`);
      }
    }
  }

  getValueFromString(value: string): number {
    if (value === undefined || value === null) {
      return 0
    }
    return currency(value).value

  }
  formatToMoneyString(value: string): string {
    return currency(value).format()
  }
}
