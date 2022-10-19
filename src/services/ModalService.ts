import { Ref, ref } from 'vue';
import { useRouter } from 'vue-router';
import { routerInstance } from 'boot/globalRouter';
import { storeToRefs } from 'pinia';
import { useStoreModal } from 'src/stores/storeCommon';
import Swal, {
  SweetAlertIcon,
  SweetAlertOptions,
  SweetAlertResult,
} from 'sweetalert2';
import routes from 'src/router/routes';

const storeCommon = useStoreModal();

export default function modalService() {
  let _type: string | null = 'info';
  const { urlToRedirect, visible, redirect, objetToShow, title } =
    storeToRefs(storeCommon);

  function withRedirect(url: string): void {
    urlToRedirect.value = url;
    redirect.value = true;
  }
  function setType(typeModal: SweetAlertIcon) {
    _type = typeModal;
  }
  function setTitle(titleModal: string): void {
    title.value = titleModal;
  }
  function showModal2(show: boolean) {
    console.log(show);
    visible.value = show;
  }
  function setObject(obj: string) {
    objetToShow.value = obj;
  }
  async function showModal(
    titleModal: string,
    textModal: string,
    typeModal?: string
  ): Promise<boolean> {
    let icon = 'info' as SweetAlertIcon;
    if (typeModal != undefined) {
      icon = typeModal as SweetAlertIcon;
    }
    const h = {
      title: titleModal,
      allowOutsideClick: false,
      icon: icon,
      text: textModal,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Aceptar',
    } as SweetAlertOptions;
    const result = (await Swal.fire(h)) as SweetAlertResult;
    if (result.isConfirmed == true) {
      return true;
    }
    if (result.isDenied == true) {
      return false;
    }
    return false;
  }
  async function simpleModal() {
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

  return {
    //! Properties
    title,
    visible,
    urlToRedirect,
    redirect,
    objetToShow,
    //! Metodos
    withRedirect,
    showModal,
    setObject,
    setTitle,
    simpleModal,
  };
}
