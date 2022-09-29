import { computed } from 'vue';
import { IColumnsDataTable } from 'src/interfaces/ICommons';
import { useStoreModal } from 'src/stores/storeCommon';
import { storeToRefs } from 'pinia';

const store = useStoreModal();
export function serviceDataTable() {
  const { title, columnsTable, dataToShow } = storeToRefs(store);

  function setData(columns: Array<IColumnsDataTable>, data: unknown) {
    columnsTable.value = columns;
    dataToShow.value = data;
  }
  const titleTable = computed({
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
    //! Metodos
    setData,
    titleTable,
  };
}
