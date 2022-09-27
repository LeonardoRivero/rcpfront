import { Ref, ref } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useStoreModal } from 'src/stores/storeCommon';
import Swal from 'sweetalert2';
import routes from 'src/router/routes';

const storeCommon = useStoreModal();
const router = useRouter();

export default function modalService() {
  // const { lastConsult } = storeToRefs(store);
  // const title = ref('');
  // const visible = ref(false);
  // const redirect = ref(false);
  // const formDXMainCode = ref<QForm | null>(null);
  // const error = ref(false);
  const { urlToRedirect, visible, redirect, objetToShow, title } =
    storeToRefs(storeCommon);

  function withRedirect(url: string): void {
    urlToRedirect.value = url;
    redirect.value = true;
  }
  function setTitle(titleModal: string): void {
    title.value = titleModal;
  }
  function showModal(show: boolean) {
    console.log(show);
    visible.value = show;
  }
  function setObject(obj: string) {
    objetToShow.value = obj;
  }
  async function testSw(
    titleModal: string,
    textModal: string
  ): Promise<boolean> {
    const result = await Swal.fire({
      title: titleModal,
      allowOutsideClick: false,
      text: textModal,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Aceptar',
    });
    if (result.isConfirmed == true) {
      urlToRedirect.value = '/';
      await routes.push(['/patient']);
      return true;
    }
    return true;
  }

  return {
    //! Properties
    testSw,
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
  };
}
