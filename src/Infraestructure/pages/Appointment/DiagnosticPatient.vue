<template>
  <div class="row q-col-gutter-md">
    <div class="col-12 col-sm-4">
      <q-select
        option-value="id"
        :option-label="(option) => `${option.description}`"
        dense
        v-model="state.dxMainEntryType"
        :options="state.allDxMainEntryType"
        label="Tipo Diagnostico Ingreso *"
        :rules="[isNotNull]"
      >
      </q-select>
    </div>
    <div class="col-12 col-sm-8">
      <q-select
        option-value="id"
        :option-label="(option) => `${option.description}`"
        dense
        v-model="state.reasonConsult"
        :options="optionsReasonConsult"
        label="Razon Consulta *"
        input-debounce="300"
        fill-input
        use-input
        hide-selected
        @filter="onSearchReasonConsult"
        :rules="[isNotNull]"
        autogrow
      >
      </q-select>
    </div>
  </div>
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
    @filter="onSearchMainCode"
    :rules="[isNotNull]"
  >
  </q-select>
  <q-select
    option-value="id"
    :option-label="(option) => `${option.code} ${option.name}`"
    dense
    v-model="state.relationCode"
    :options="state.allRelationCodes"
    label="Codigo Relacionado"
    clearable
    input-debounce="300"
    fill-input
    use-input
    hide-selected
    @filter="onSearchRelatedCode"
    :rules="[isNotNull]"
  >
  </q-select>
  <!-- <q-select
    option-value="id"
    :option-label="(option) => `${option.code} ${option.name}`"
    dense
    v-model="state.cupCode"
    :options="state.allCUP"
    label="Procedimiento (CUP)"
    clearable
    input-debounce="300"
    fill-input
    use-input
    hide-selected
    @filter="onSearchCUP"
    :rules="[isNotNull]"
  />
  <br /> -->
  <q-input
    v-model="state.diagnosticObservations"
    filled
    type="textarea"
    label="Observaciones"
    autogrow
    autocapitalize="sentences"
    clearable
  />
  <!-- <q-select
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
  </q-select> -->

  <!-- <q-select
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
  </q-select> -->

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
  import { onMounted, inject, ref } from 'vue';
  import { AppointmentBloc } from 'src/Adapters';
  import { usePlocState } from 'src/Infraestructure/Utilities/usePlocState';
  import { UpdateFunction } from 'src/Domine/Types';
  import { isNotNull } from 'src/Application/Utilities';
  import { IHandleGlobalState } from 'src/Domine/IPatterns';
  import { ReasonConsultResponse } from 'src/Domine/Responses';
  import 'src/css/app.sass';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dependenciesLocator = inject<any>('dependenciesLocator');
  const props = defineProps<{ bloc: AppointmentBloc }>();
  const optionsReasonConsult = ref<ReasonConsultResponse[]>([]);
  const handleGlobalState = <IHandleGlobalState>(
    dependenciesLocator.provideHandleGlobalState()
  );

  const controller = <AppointmentBloc>props.bloc;
  const state = usePlocState(controller);

  onMounted(async () => {
    await controller.loadInitialData(handleGlobalState);
    optionsReasonConsult.value = state.value.allReasonConsult;
  });

  function onSearchMainCode(val: string, update: UpdateFunction) {
    if (val === '') {
      return;
    }
    state.value.filterCIE10 = val;
    update(async () => {
      await controller.filterDxMainCode();
    });
  }

  async function onSearchRelatedCode(val: string, update: UpdateFunction) {
    if (val === '') {
      return;
    }
    state.value.filterRelatedCode = val;
    update(async () => {
      await controller.filterRelatedCode();
    });
    // isLoading.value = false;
    // if (this.searchText) {
    //   this.filteredOptions = this.options.filter(option =>
    //     option.label.toLowerCase().includes(this.searchText.toLowerCase())
    //   );
    // } else {
    //   this.filteredOptions = this.options;
    // }
  }

  function onSearchCUP(val: string, update: UpdateFunction) {
    if (val === '') {
      return;
    }
    state.value.filterCUP = val;
    update(async () => {
      await controller.filterCUP();
    });
  }

  function onSearchReasonConsult(val: string, update: UpdateFunction) {
    update(async () => {
      optionsReasonConsult.value = await controller.filterReasonConsult(val);
    });
  }
</script>
<style scoped>
  .custom-popup-content {
    padding: 10px;
    min-width: 300px;
  }
</style>
