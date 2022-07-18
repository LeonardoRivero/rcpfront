<template>
  <div class="q-pa-md">
    <q-table
      title="Especialidades"
      dense
      virtual-scroll
      :rows="rows"
      :columns="columns"
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

<script>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useCounterStore } from 'src/stores/example-store';
const columns = [
  {
    name: 'id',
    required: true,
    label: 'Id',
    align: 'left',
    field: (row) => row.id,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'descripcion',
    align: 'center',
    label: 'Nombre Especialidad',
    field: (row) => row.description,
    sortable: true,
  },
];

export default {
  setup() {
    const store = useCounterStore();
    const router = useRouter();
    const rows = ref([]);
    const loading = ref(false);

    onMounted(async () => {
      let insurance = [];
      if (store.allSpecialities == undefined) {
        await store.getAllInsurance();
      }
      insurance = store.allSpecialities;
      rows.value = insurance;
    });

    return {
      filter: ref(''),
      loading,
      columns,
      rows,
    };
  },
};
</script>
