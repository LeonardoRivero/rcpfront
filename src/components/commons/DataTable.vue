<template>
  <div class="q-pa-md">
    <q-table
      :title="titleTable"
      dense
      virtual-scroll
      :rows="dataToShow"
      :columns="columnsTable"
      row-key="id"
      :filter="filter"
      no-data-label="No hay datos para mostrar"
      no-results-label="No hay resultados para la busqueda"
    >
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
            class="text-italic text-blue"
          >
            {{ col.label }}
          </q-th>
        </q-tr>
      </template>
      <template v-slot:no-data="{ icon, message, filter }">
        <div
          class="full-width row flex-center text-accent q-gutter-sm text-blue"
        >
          <q-icon size="2em" name="sentiment_dissatisfied" />
          <span> Lo sentimos.. {{ message }} </span>
          <q-icon size="2em" :name="filter ? 'warning' : icon" />
        </div>
      </template>
      <template v-slot:top-right>
        <q-input
          borderless
          dense
          debounce="300"
          v-model="filter"
          placeholder="Buscar"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
    </q-table>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { serviceDataTable } from 'src/services/DataTableService';
import { IColumnsDataTable } from 'src/interfaces/ICommons';
import { specialityService } from 'src/services/SpecialityService';
import { useStoreSettings } from 'src/stores/storeSettings';
import { IRelationCodeResponse } from 'src/interfaces/IConsults';

// const columnsr = [
//   {
//     name: 'id',
//     required: true,
//     label: 'Id',
//     align: 'left',
//     field: 'id',
//     sortable: true,
//   },
//   {
//     name: 'descripcion',
//     required: true,
//     align: 'center',
//     label: 'Nombre Especialidad',
//     field: 'description',
//     sortable: true,
//   },
// ] as Array<IColumnsDataTable>;

export default {
  setup() {
    const store = useStoreSettings();
    const {
      setData,
      dataToShow,
      columnsTable,
      // test,
      // otrafunciontest,
      titleTable,
      // title,
    } = serviceDataTable();
    const router = useRouter();
    const rows = ref([]);
    const loading = ref(false);

    onMounted(async () => {
      // let insurance = [];
      // if (store.allSpecialities == undefined) {
      //   await store.getAllInsurance();
      // }
      // insurance = store.allSpecialities;
      // rows.value = insurance;
    });

    return {
      // test,
      // title,
      titleTable,
      columnsTable,
      dataToShow,
      filter: ref(''),
      loading,
      addRow() {
        console.log('add');
      },
      removeRow() {
        console.log('remove');
      },
    };
  },
};
</script>
