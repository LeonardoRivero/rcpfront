<template>
  <q-select
    option-value="id"
    :option-label="(option) => `${option.code} ${option.name}`"
    dense
    v-model="state.dxMainCode"
    :options="state.allDxMainCodes"
    label="Codigo Principal"
    clearable
    input-debounce="300"
    fill-input
    use-input
    hide-selected
    @filter="onSearch"
  >
  </q-select>
  <br />
  <q-select
    option-value="id"
    :option-label="(option) => `${option.code} ${option.name}`"
    dense
    v-model="state.relationCode"
    :options="state.allRelationCodes"
    :hint="`${state.allRelationCodes.length} resultado${
      state.allRelationCodes.length > 1 ? 's' : ''
    } encontrado${state.allRelationCodes.length > 1 ? 's' : ''}`"
    label="Codigo Relacionado"
    clearable
  >
    <template v-slot:after>
      <q-input
        v-model="state.filterRelatedCode"
        label="Nombre o codigo"
        dense
        @keydown.enter.prevent="searchRelatedCode"
        clearable
      ></q-input>
      <q-btn round dense flat icon="search" @click="searchRelatedCode" />
    </template>
  </q-select>

  <q-select
    option-value="id"
    :option-label="(option) => `${option.code} ${option.name}`"
    dense
    v-model="state.relationCode"
    :options="state.allRelationCodes"
    :hint="`${state.allRelationCodes.length} resultado${
      state.allRelationCodes.length > 1 ? 's' : ''
    } encontrado${state.allRelationCodes.length > 1 ? 's' : ''}`"
    label="Codigo Relacionado"
    clearable
    use-input
  >
    <template v-slot:after>
      <q-btn round dense flat icon="search">
        <q-menu touch-position>
          <div class="row no-wrap q-pa-md">
            <div class="column">
              <q-checkbox v-model="state.patientHasTreatment" label="Codigo" />
              <q-checkbox v-model="state.patientHasTreatment" label="Nombre" />
            </div>
          </div>
        </q-menu>
      </q-btn>
    </template>
  </q-select>

  <!-- <q-select
    dense
    v-model="selectedItem"
    :options="state.allDxMainCodes"
    option-label="label"
    option-value="value"
    label="Codigo Principal"
    use-input
    map-options
    behavior="dialog"
  >
    <template v-slot:after>
      <q-input v-model="text" label="Nombre o codigo" dense stack-label>
        <template v-slot:append>
          <q-icon
            v-if="text !== ''"
            name="close"
            @click="text = ''"
            class="cursor-pointer"
          />
        </template>
        <template v-slot:after>
          <q-btn round dense flat icon="search" @click="onSearch2" />
        </template>
      </q-input>
    </template>
  </q-select> -->
  <!-- <q-select
    filled
    :model-value="state.CIE10Filter.code"
    use-input
    hide-selected
    fill-input
    input-debounce="1000"
    :options="state.allDxMainCodes"
    @filter="filterFn"
  >
    <template v-slot:no-option>
      <q-item>
        <q-item-section class="text-grey"> No results </q-item-section>
      </q-item>
    </template>
    <template v-slot:append>
      <q-spinner v-if="true" size="20px" />
    </template>
  </q-select>-->
  <!-- <div class="fit row wrap justify-start items-start content-start">
    </q-select>
    <q-space style="max-width: 10%" />
    <q-select
      dense
      outlined
      v-model="state.relationCode"
      :options="state.allRelationCodes"
      :option-value="(item) => (item === null ? null : item.id)"
      option-label="description"
      map-options
      emit-value
      label="Codigo Relacionado"
      style="overflow: auto; max-width: 45%"
      class="col-grow"
    >
    </q-select>
  </div>
  <br />
  <q-input
    v-model="state.reasonConsultation"
    outlined
    label="Motivo de Consulta"
    :rules="[required]"
  >
    <template v-slot:prepend>
      <q-icon :name="icons.hurt" size="40px" />
    </template>
  </q-input>
  <q-input
    v-model="state.descriptionConsultation"
    filled
    autogrow
    label="Descripcion Consulta"
    :rules="[required]"
  >
  </q-input>
  <br />
  <div>
    <q-select
      filled
      fill-input
      use-input
      dense
      v-model="state.pathology"
      :options="state.allPathologies"
      label="Antecedentes Patologicos Paciente"
      :option-value="(item) => (item === null ? null : item.id)"
      option-label="description"
      map-options
      multiple
      emit-value
      @filter="filterFn"
      input-debounce="0"
    >
      <template v-slot:prepend>
        <q-icon :name="icons.historyLog" size="32px" />
      </template>
      <template v-slot:no-option>
        <q-item>
          <q-item-section class="text-grey"> Sin resultados </q-item-section>
        </q-item>
      </template>
    </q-select>
  </div>
  <br /> -->
</template>

<script setup lang="ts">
  import { computed, inject, onMounted, ref, nextTick } from 'vue';
  import { AppointmentBloc } from 'src/Adapters';
  import { required } from 'src/Application/Utilities/Helpers';
  import { usePlocState } from 'src/Infraestructure/Utilities/usePlocState';
  // import { ClinicHistoryMediator } from 'src/Infraestructure/Mediators';
  import 'src/css/app.sass';
  import { UpdateFunction } from 'src/Domine/Types';
  const text = ref('');
  const dependenciesLocator = inject<any>('dependenciesLocator');
  const controller = <AppointmentBloc>(
    dependenciesLocator.provideAppointmentBloc()
  );
  const state = usePlocState(controller);
  const selectedItem = ref('');
  const isLoading = ref(false);
  const options = [
    { label: 'Opción 1', value: 1 },
    { label: 'Opción 2', value: 2 },
    { label: 'Opción 3', value: 3 },
    { label: 'Opción 4', value: 4 },
    { label: 'Opción 5', value: 5 },
    { label: 'Opción 6', value: 6 },
  ];
  const filteredOptions: any[] = [];
  // onMounted(async () => {
  //   await controller.loadInitialData();
  // });

  // const clinicHistoryMediator = ClinicHistoryMediator.getInstance();
  // clinicHistoryMediator.add(controller);
  // const icons = IconSVG;
  const allOptions: string[] = [];
  for (let i = 0; i <= 100000; i++) {
    allOptions.push('Opt ' + i);
  }
  const model = ref(null);

  const pageSize = 50;
  const lastPage = Math.ceil(allOptions.length / pageSize);
  const loading = ref(false);
  const nextPage = ref(2);
  const options2 = computed(() =>
    allOptions.slice(0, pageSize * (nextPage.value - 1))
  );
  async function onEnterPress() {
    console.log('Se presionó Enter', state.value.dxMainCode);
    await controller.dxMainCodeChanged();
    // Puedes realizar cualquier acción aquí
  }

  function onScroll(object: any) {
    const lastIndex = options2.value.length - 1;

    if (
      loading.value !== true &&
      nextPage.value < lastPage &&
      object.to === lastIndex
    ) {
      loading.value = true;

      setTimeout(() => {
        nextPage.value++;
        nextTick(() => {
          object.ref.refresh();
          loading.value = false;
        });
      }, 500);
    }
  }

  function filterFn(val: string, update: any) {
    console.log(val, { update });
    update(() => {
      const needle = val.toLowerCase();
      state.value.allPathologies = state.value.pathologiesForFilter.filter(
        (v) => v.description.toLowerCase().indexOf(needle) > -1
      );
    });
  }

  function onSearch(val: string, update: UpdateFunction) {
    if (val === '') {
      update(() => {
        console.log(state.value.allDxMainCodes);
        // state.value.allDxMainCodes = [];
      });
      return;
    }
    state.value.filterCIE10 = val;
    update(async () => {
      await controller.dxMainCodeChanged();
    });
  }

  async function searchRelatedCode() {
    // isLoading.value = false;
    await controller.filterRelatedCode();
    // if (this.searchText) {
    //   this.filteredOptions = this.options.filter(option =>
    //     option.label.toLowerCase().includes(this.searchText.toLowerCase())
    //   );
    // } else {
    //   this.filteredOptions = this.options;
    // }
  }

  async function searchDxMain() {
    // isLoading.value = false;
    await controller.dxMainCodeChanged();
    // if (this.searchText) {
    //   this.filteredOptions = this.options.filter(option =>
    //     option.label.toLowerCase().includes(this.searchText.toLowerCase())
    //   );
    // } else {
    //   this.filteredOptions = this.options;
    // }
  }
  function filterDxMain() {
    controller.dxMainCodeChanged();
  }

  function dxMainCodeChanged(val: number) {
    controller.dxMainCodeChanged();
  }

  // function setModel(val: string) {
  //   console.log(val);
  //   state.value.CIE10Filter.code = val;
  // }
</script>
<style scoped>
  .custom-popup-content {
    padding: 10px;
    min-width: 300px;
  }
</style>
