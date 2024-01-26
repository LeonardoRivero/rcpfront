<template>
  <q-table
    flat
    bordered
    ref="tableRef"
    :title="state.tableOptions.title"
    :rows="state.tableOptions.rows"
    :columns="state.tableOptions.columns"
    row-key="id"
    v-model:pagination="state.pagination"
    :loading="state.loading"
    :filter="state.filter"
    binary-state-sort
    @request="onRequest"
    class="table-responsive link-cursor"
  >
    <template v-slot:top-right>
      <q-input
        borderless
        dense
        debounce="300"
        v-model="state.filter"
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
import { ref, onMounted, inject } from 'vue';
import { AppointmentListBloc } from 'src/Adapters/AppointmentListController';
import { usePlocState } from 'src/Infraestructure/Utilities/usePlocState';

const dependenciesLocator = inject<any>('dependenciesLocator');
const controller = <AppointmentListBloc>(
  dependenciesLocator.provideAppointmentListBloc()
);
const state = usePlocState(controller);
const tableRef = ref();

onMounted(async () => {
  await controller.getInitialData();
});

async function onRequest(props: any) {
  await controller.requestServer(props.pagination);
}
</script>
