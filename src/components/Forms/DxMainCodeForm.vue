<template>
  <div class="q-pa-md">
    <q-card class="my-card" flat bordered>
      <q-card-section>
        <div class="text-h5 q-mt-sm q-mb-xs">Codigos CUPS</div>
        <div class="text-caption text-grey">
          CUPS existentes:
          {{
            dxMainCodeofSpeciality == null ? 0 : dxMainCodeofSpeciality.length
          }}
        </div>
        <q-select
          dense
          clearable
          outlined
          v-model="model"
          :options="dxMainCodeofSpeciality"
          option-value="id"
          option-label="description"
          map-options
          label="Descripcion"
          :hint="`Codigo CUP:  ${model ? textCUP : ''}`"
          @update:model-value="(val) => descriptionChanged(val)"
        >
        </q-select>
      </q-card-section>
      <q-card-actions>
        <q-btn flat round color="primary" icon="mdi-plus" @click="add">
          <q-tooltip transition-show="scale" transition-hide="scale">
            Agregar
          </q-tooltip>
        </q-btn>
        <q-btn
          v-if="model != null"
          flat
          round
          color="green"
          icon="mdi-pencil"
          @click="edit"
        >
          <q-tooltip transition-show="scale" transition-hide="scale">
            Editar
          </q-tooltip>
        </q-btn>
        <q-space />
        <q-btn
          color="grey"
          round
          flat
          dense
          :icon="expanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
          @click="expanded = !expanded"
        />
      </q-card-actions>
      <q-slide-transition>
        <div v-show="expanded">
          <q-separator />
          <q-card-section class="text-subitle2">
            <q-form @submit="validate" ref="formDXMainCode">
              <q-input
                dense
                outlined
                disable
                v-model="selectedSpeciality.description"
                label="Especialidad"
              />
              <q-input
                dense
                outlined
                v-model="currentDxMainCode.CUP"
                label="Codigo CUP"
                maxlength="10"
                lazy-rules
                :rules="[
                  (val) => (val && val.length > 0) || 'Codigo es requerido',
                ]"
              />
              <q-input
                dense
                outlined
                v-model="currentDxMainCode.description"
                label="Descripcion Codigo CUP"
                lazy-rules
                :rules="[
                  (val) =>
                    (val && val.length > 0) || 'Descripcion es requerida',
                ]"
              />
              <div>
                <q-btn label="Guardar" type="submit" color="primary" />
              </div>
            </q-form>
          </q-card-section>
        </div>
      </q-slide-transition>
    </q-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { QForm } from 'quasar';
import { useCounterStore } from 'src/stores/example-store';
import { IDXMainCodeRequest, DXMainCode } from 'src/interfaces/IModels';
import HttpStatusCodes from 'src/scripts/HttpStatusCodes';
export default defineComponent({
  name: 'DxMainCodeForm',
  setup() {
    const store = useCounterStore();
    const router = useRouter();
    const { selectedSpeciality, dxMainCodeofSpeciality, currentDxMainCodes } =
      storeToRefs(store);
    const formDXMainCode = ref<QForm | null>(null);
    //let optionSpeciality = ref(Array<Speciality>());
    //let selectSpeciality = ref<Speciality>();
    //let currentSpeciality = ref<Speciality>({ id: undefined, description: '' });
    let error = ref(false);
    //let options = ref(Array<IDXMainCodeRequest>());
    let model = ref<IDXMainCodeRequest>();
    let expanded = ref(false);
    let description = ref<string>('');
    let textCUP = ref<string>('');
    let currentDxMainCode = ref<IDXMainCodeRequest>({} as IDXMainCodeRequest);
    let serviceDXMainCode = ref<DXMainCode>({} as DXMainCode);

    async function reset(val: DXMainCode) {
      console.log(val);
    }
    async function validate() {
      let isValid = await formDXMainCode.value?.validate();
      let specialitySelected = selectedSpeciality.value;
      let dxMainCode = currentDxMainCode.value;
      if (specialitySelected == null) {
        error.value = true;
        return;
      }
      if (isValid == false) {
        return;
      }

      if (dxMainCode == null || specialitySelected.id == null) return;
      if (dxMainCode.id == undefined) {
        // let data: IDXMainCode = {
        //   CUP: dxMainCode.CUP,
        //   description: dxMainCode.description,
        //   speciality: specialitySelected.id,
        // };
        store.createDxMainCode(dxMainCode);
      }
      if (dxMainCode.id != undefined) {
        // let data: IDXMainCode = {
        //   id: dxMainCode.id,
        //   CUP: dxMainCode.CUP,
        //   description: dxMainCode.description,
        //   speciality: specialitySelected.id,
        // };
        store.updateDxMainCode(dxMainCode);
      }
    }

    function add() {
      if (expanded.value === false) {
        expanded.value = !expanded.value;
      }
      const service = new DXMainCode();
      currentDxMainCode.value = service.default();
      // let data: DXMainCode = {
      //   id: undefined,
      //   CUP: '',
      //   description: '',
      //   speciality: 0,
      // };
    }

    function edit() {
      if (expanded.value === false) {
        expanded.value = !expanded.value;
      }
      currentDxMainCode.value = model.value as IDXMainCodeRequest;
    }
    async function descriptionChanged(val: IDXMainCodeRequest) {
      textCUP.value = val.CUP;
      currentDxMainCode.value = val;
    }
    // function specialityChanged(val: Speciality) {
    //   console.log(val);
    //   error.value = false;
    //   selectedSpeciality.value = val;
    // }

    onMounted(async () => {
      if (store.currentSpeciality === null) {
        // options.value =  [currentDxMainCode.value];
      }

      if (store.allDxMainCodes == undefined) {
        const response = await store.retrieveAllDxMainCode();
        console.log(response.parsedBody);
        //options.value = response.parsedBody as Array<DXMainCode>;
        if (response.status == HttpStatusCodes.NOT_FOUND) {
          router.push('/:catchAll');
        }
      }
      // optionSpeciality.value = store.allSpecialities as Array<Speciality>;
    });
    return {
      //optionSpeciality,
      //selectSpeciality,
      dxMainCodeofSpeciality,
      selectedSpeciality,
      store,
      model,
      //options,
      expanded,
      currentDxMainCodes,
      currentDxMainCode,
      description,
      formDXMainCode,
      textCUP,
      error,
      validate,
      add,
      edit,
      descriptionChanged,
      //specialityChanged,
      reset,
    };
  },
});
</script>
<style lang="sass" scoped>
.my-card
  width: 100%
  min-width: 300px
  max-width: 300px
</style>
