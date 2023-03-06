<template>
  <div class="my-card">
    <q-table
      :title="tableOptions.title"
      :dense="$q.screen.lt.xs"
      virtual-scroll
      :rows="tableOptions.data"
      :columns="tableOptions.columns"
      row-key="description"
      :hide-bottom="false"
      :filter="filter"
      :rows-per-page-options="[0]"
      :selection="tableOptions.selectionRow"
      v-model:selected="selected"
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
          v-model="option"
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
      <template v-slot:no-data="{ icon, message, filter }">
        <div
          class="full-width row flex-center text-accent q-gutter-sm text-blue"
        >
          <q-icon size="2em" :name="filter ? 'warning' : icon" />
          <span> Lo sentimos.. {{ message }} </span>
        </div>
      </template>
    </q-table>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, PropType, ref } from 'vue';
import { storeToRefs } from 'pinia';

import 'src/css/app.sass';
import { TableOptions } from 'src/Domine/ICommons';
import { useStoreDataTable } from 'src/Infraestructure/Mediators/Common/DatatableStore';
import { DataTableAdapter } from 'src/Adapters/DataTableAdapter';

export default defineComponent({
  name: 'DataTable',
  props: {
    tableOptions: {
      type: Object as PropType<TableOptions>,
      require: true,
      default: {} as TableOptions,
    },
  },
  setup(props) {
    const store = useStoreDataTable();
    const { data, columns, listOptions, option, selected } = storeToRefs(store);
    const adapter = DataTableAdapter.getInstance(store);
    let selectionRow = ref<string>();

    onMounted(async () => {
      // if (props.tableOptions.selectionRow == 'none') {
      //   selectionRow.value = 'none';
      // }
      // selectionRow.value = props.tableOptions.selectionRow;
    });

    return {
      listOptions,
      option,
      selected,
      selectionRow,
      columns,
      data,
      filter: ref(''),
      rows: [],
      selectChanged(val: object) {
        adapter.notify(val);
      },
      clear(val: object) {
        option.value = null;
      },
      addRow() {
        console.log('add');
      },
      removeRow() {
        console.log('remove');
      },
      rowClicked(val: Array<object>) {
        if (val === undefined) {
          val = [];
        }
        adapter.notify(val);
      },
    };
  },
});
</script>
