<template>
  <q-table
    flat
    bordered
    ref="tableRef"
    :title="result.title"
    :rows="result.rows"
    :columns="result.columns"
    :row-key="result.rowKey"
    v-model:pagination="pagination"
    :loading="loading"
    :filter="filter"
    binary-state-sort
    @request="onRequest"
    class="table-responsive link-cursor"
  >
    <template v-slot:top-right>
      <q-input
        borderless
        dense
        debounce="300"
        v-model="filter"
        placeholder="Search"
      >
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
    </template>
  </q-table>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { IPaginationDataTable, ITableOptions } from 'src/Domine/ICommons';
import { BuilderTablesWithFetchToServer } from 'src/Infraestructure/Utilities/BuildersTables';
import { AppointmentListController } from 'src/Adapters/AppointmentListController';
import { Observer } from 'src/Domine/IPatterns';

let result = ref<ITableOptions>({} as ITableOptions);
const controller = new AppointmentListController();
const pagination: IPaginationDataTable = {
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 5,
  rowsNumber: 10,
};
const loading = ref(false);
const filter = ref('');

onMounted(async () => {
  const rows = await controller.getRowsData();
  const columns = controller.columnsData;

  const builder = new BuilderTablesWithFetchToServer(controller.pagination);
  builder.setData(columns, rows, 'Resumen Citas');
  builder.hasSearchField();
  builder.showButtonActions();
  result.value = builder.getResult();
  result.value.observer = <Observer>controller;
  console.log(result);
});

function onRequest(props: any) {
  console.log(props);
}
</script>
