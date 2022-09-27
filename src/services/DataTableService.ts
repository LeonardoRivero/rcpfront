import { computed, ref } from 'vue';
// import { storeToRefs } from 'pinia';
// import { useCounterStore } from 'src/stores/example-store';
// import { ISpeciality } from 'src/interfaces/IModels';
import { IColumnsDataTable } from 'src/interfaces/ICommons';
import { useStoreModal } from 'src/stores/storeCommon';
import { storeToRefs } from 'pinia';

const store = useStoreModal();
export function serviceDataTable() {
  // const store = useCounterStore();
  // const {
  //   allSpecialities,
  //   allDxMainCodes,
  //   currentSpeciality,
  //   currentDxMainCodes,
  //   specialityForm,
  // } = storeToRefs(store);
  const columnsTable = ref<Array<IColumnsDataTable>>();
  const dataToShow = ref<unknown>();
  const test = ref('OK');
  //const title = ref('aisempeinza');
  const { title } = storeToRefs(store);

  function setData(columns: Array<IColumnsDataTable>, data: unknown) {
    // const data = {
    //   id: speciality.id,
    //   description: speciality.description,
    // } as ISpeciality;
    // currentSpeciality.value = data;

    columnsTable.value = columns;
    dataToShow.value = data;
  }
  function setTitle(titleTable: string) {
    title.value = titleTable;
  }
  const otrafunciontest = computed({
    get: () => {
      return title.value;
    },
    set: (value) => {
      title.value = value;
    },
  });

  return {
    //! Properties
    columnsTable,
    dataToShow,
    test,
    title,
    // allDxMainCodes,
    // currentSpeciality,
    // currentDxMainCodes,
    // specialityForm,

    //! Computed
    // imgSrc: computed(
    //   () =>
    //     `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${pokemon.value?.id}.svg`
    // ),

    //! Metodos
    setData,
    otrafunciontest,
    setTitle,
    // mixPokemonArray,
    // newGame,
  };
}
