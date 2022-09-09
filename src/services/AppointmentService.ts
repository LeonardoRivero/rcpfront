import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { QForm } from 'quasar';
import { storeToRefs } from 'pinia';
import { useStoreAppointment } from 'src/stores/storeAppointment';
import { IConsultRequest, IConsultResponse } from 'src/interfaces/IConsults';
// import HttpStatusCodes from 'src/scripts/HttpStatusCodes';

const store = useStoreAppointment();
const router = useRouter();
export function appointmentService() {
  const { expandedT, expanded } = storeToRefs(store);
  // const dxMainCode = ref<IDXMainCodeResponse>();
  //const expanded = ref(false);
  // const formDXMainCode = ref<QForm | null>(null);
  // const error = ref(false);

  async function cardIsExpandible(isExpansible: boolean): Promise<void> {
    //expanded.value = isExpansible;
    // store.expanded = isExpansible;
    if (isExpansible == false) {
      store.settest(isExpansible);
      store.setother(true);
    }
    console.log(isExpansible);
  }
  return {
    // //! Properties
    // clearDxMainCode,
    // formDXMainCode,
    // dxMainCode,
    // allDxMainCodes,
    // currentDxMainCode,
    expandedT,
    expanded,
    // error,
    // //! Computed
    // dxMainCodeofSpeciality: computed(() => {
    //   if (store.allDxMainCodes === null) {
    //     return null;
    //   }
    //   const result = store.allDxMainCodes.filter(
    //     (dxMainCode) => dxMainCode.speciality.id == store.currentSpeciality?.id
    //   );
    //   clearDxMainCode({} as IDXMainCodeRequest);
    //   return result;
    // }),
    // //! Metodos
    // add,
    // edit,
    // dxMainCodeChanged,
    // confirmChanges,
    // getAllDxMainCode,
    cardIsExpandible,
  };
}
