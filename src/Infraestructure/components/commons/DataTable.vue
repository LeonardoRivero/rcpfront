<template>
  <div class="my-card">
    <q-table
      :title="tableOptions.title"
      :dense="$q.screen.lt.sm"
      virtual-scroll
      :rows="tableOptions.rows"
      :columns="tableOptions.columns"
      row-key="description"
      :hide-bottom="false"
      :filter="filter"
      :rows-per-page-options="[0]"
      :selection="tableOptions.selectionRow"
      v-model:selected="state.selected"
      class="table-responsive link-cursor"
      style="height: 400px"
      @update:selected="(val) => rowClicked(val)"
      no-data-label="No hay datos para mostrar"
      no-results-label="No hay resultados para la busqueda"
    >
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th v-if="tableOptions.selectionRow != 'none'"></q-th>
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
      <template v-slot:top>
        {{ tableOptions.title }}
        <q-space />
        <small>
          <cite title="Ayuda">{{ tableOptions.textCite }}</cite>
        </small>
        <q-select
          v-if="tableOptions.enableSelect"
          v-model="state.option"
          outlined
          dense
          options-dense
          map-options
          :options="tableOptions.select.listOptions"
          :option-value="tableOptions.select.optionValue"
          :option-label="tableOptions.select.optionLabel"
          :style="tableOptions.select.style"
          :label="tableOptions.select.label"
          @update:model-value="(val) => selectChanged(val)"
          @clear="(val) => clear(val)"
        />
        <q-space />
        <q-input
          v-if="tableOptions.enableSearch"
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
      <template v-slot:no-data="{ icon, message }">
        <div
          class="full-width row flex-center text-accent q-gutter-sm text-blue"
        >
          <q-icon size="2em" name="mdi-alert" />
          <span> Lo sentimos.. {{ message }} </span>
        </div>
      </template>
    </q-table>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive, ref } from 'vue';
import 'src/css/app.sass';
import {
  IColumnsDataTable,
  ITableOptions,
  TableSelect,
} from 'src/Domine/ICommons';
import { DataTableController } from 'src/Adapters/DataTableAdapter';
import { DataTableState } from 'src/Domine/IStates';
import { Controller } from 'src/Domine/IPatterns';
import { QTable } from 'quasar';

export default defineComponent({
  name: 'DataTable',
  props: {
    tableOptions: {
      type: Object as PropType<ITableOptions>,
      require: true,
      default: {
        virtualScroll: false,
        title: '',
        columns: [],
        rows: [],
        enableSearch: false,
        enableSelect: false,
        selectionRow: 'single',
        select: new TableSelect(),
        textCite: '',
        observer: null,
        options: {},
      },
    },
    controller: {
      type: Object as PropType<Controller>,
      require: true,
      default: null,
    },
  },
  setup(props) {
    const state: DataTableState = reactive({
      title: '',
      visible: false,
      columns: [] as Array<IColumnsDataTable>,
      data: [],
      listOptions: [],
      option: null,
      selected: [] as Array<unknown>,
    });

    const controller = DataTableController.getInstance(state);

    return {
      state,
      // selectionRow,
      filter: ref(''),
      rows: [],
      selectChanged(val: object) {
        controller.attach(props.tableOptions.observer);
        controller.notify(val);
      },
      clear(val: object) {
        state.option = null;
      },
      addRow() {
        console.log('add');
      },
      removeRow() {
        console.log('remove');
      },
      rowClicked(val: readonly any[]) {
        console.log(val);
        if (val === undefined) {
          val = [];
        }
        controller.attach(props.tableOptions.observer);
        controller.notify(val);
      },
    };
  },
});
</script>
