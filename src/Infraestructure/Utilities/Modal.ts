import Swal, {
  SweetAlertIcon,
  SweetAlertOptions,
  SweetAlertResult,
} from 'sweetalert2';
import { reactive } from 'vue';

export class Modal {
  private icon: SweetAlertIcon = 'info';
  private state = reactive({
    title: '',
    visible: false,
  });

  public async setType(icon: SweetAlertIcon) {
    this.icon = icon;
  }
  public setTitle(titleModal: string): void {
    this.state.title = titleModal;
  }
  public async showModal(
    titleModal: string,
    textModal: string,
    icon?: SweetAlertIcon
  ): Promise<boolean> {
    if (icon != undefined) {
      this.icon = icon;
    }
    const objectSweetAlert: SweetAlertOptions = {
      title: titleModal,
      allowOutsideClick: false,
      icon: this.icon,
      text: textModal,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Aceptar',
    };
    const result = (await Swal.fire(objectSweetAlert)) as SweetAlertResult;
    if (result.isConfirmed == true) {
      return true;
    }
    if (result.isDenied == true) {
      return false;
    }
    return false;
  }
  public async simpleModal() {
    const result = await Swal.fire(
      'The Internet?',
      'That thing is still around?',
      'question'
    );
    if (result.isConfirmed == true) {
      return true;
    }
    if (result.isDenied == true) {
      return false;
    }
    return false;
  }
}
