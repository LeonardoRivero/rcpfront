<template>
  <div class="my-card">
    <q-table
      :title="tableOptions?.title"
      :dense="$q.screen.lt.sm"
      virtual-scroll
      :rows="tableOptions?.rows"
      :columns="tableOptions?.columns"
      row-key="description"
      :hide-bottom="false"
      :filter="filter"
      :selection="tableOptions?.selectionRow"
      v-model:selected="state.selected"
      class="table-responsive link-cursor"
      style="height: 100%"
      @update:selected="(val) => rowClicked(val)"
      no-data-label="Lo sentimos... No hay datos para mostrar"
      no-results-label="No hay resultados para la busqueda"
    >
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th v-if="tableOptions?.selectionRow != 'none'"></q-th>
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
        <div class="text-h6">{{ tableOptions?.title }}</div>
        <q-space />
        <small>
          <cite title="Ayuda">{{ tableOptions?.textCite }}</cite>
        </small>
        <q-select
          v-if="tableOptions?.enableSelect"
          v-model="state.option"
          outlined
          dense
          options-dense
          map-options
          :options="tableOptions?.select.listOptions"
          :option-value="tableOptions?.select.optionValue"
          :option-label="tableOptions?.select.optionLabel"
          :style="tableOptions?.select.style"
          :label="tableOptions?.select.label"
          @update:model-value="(val) => selectChanged(val)"
          @clear="(val) => clear(val)"
        />
        <q-space />
        <q-input
          v-if="tableOptions?.enableSearch"
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
      <template
        v-slot:body-cell-actions="props"
        v-if="tableOptions?.showButtonActions"
      >
        <q-td :props="props">
          <q-btn
            dense
            round
            flat
            color="grey"
            @click="editRow(props)"
            icon="edit"
          ></q-btn>
          <q-btn
            dense
            round
            flat
            color="grey"
            @click="removeRow(props)"
            icon="delete"
          ></q-btn>
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive, ref, onMounted } from 'vue';
import 'src/css/app.sass';
import {
  IColumnsDataTable,
  ITableOptions,
  TableSelect,
} from 'src/Domine/ICommons';
import { DataTableState } from 'src/Domine/IStates';
import { Controller } from 'src/Domine/IPatterns';

export default defineComponent({
  name: 'DataTable',
  props: {
    tableOptions: {
      type: Object as PropType<ITableOptions>,
      require: true,
    },
    controller: {
      type: Object as PropType<Controller>,
      require: false,
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

    // const controller = DataTableController.getInstance(state);

    return {
      state,
      // selectionRow,
      filter: ref(''),
      rows: [],
      selectChanged(val: object) {
        // controller.attach(props.tableOptions.observer);
        // controller.notify(val);
      },
      clear(val: object) {
        state.option = null;
      },
      addRow() {
        console.log('add');
      },
      removeRow(props: unknown) {
        console.log(props);
      },
      editRow(props: unknown) {
        console.log(props);
      },
      rowClicked(val: readonly unknown[]) {
        console.log(val);
        if (val === undefined) {
          val = [];
        }
        // controller.attach(props.tableOptions.observer);
        // controller.notify(val);
      },
    };
  },
});
</script>
