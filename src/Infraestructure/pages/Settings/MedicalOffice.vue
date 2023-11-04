<template>
  <q-card class="my-card" bordered>
    <q-card-section>
      <div class="text-h5 q-mt-sm q-mb-xs">
        <q-icon :name="icons.medicalClinic" size="48px" /> Consultorio
      </div>
      <div class="fit row wrap justify-start items-start content-start">
        <q-select
          dense
          clearable
          outlined
          v-model="state.addressMedicalOffice"
          :options="state.medicalOffices"
          :option-value="(item) => (item === null ? null : item.id)"
          option-label="address"
          map-options
          emit-value
          label="Consultorios"
          @update:model-value="(val) => addressMedicalOfficeChanged(val)"
          @clear="(val) => clearForm(val)"
          style="overflow: auto"
          class="col-grow"
          :disable="disableSelectAddress"
        />
        <q-btn color="grey-7" round flat icon="more_vert">
          <q-tooltip transition-show="scale" transition-hide="scale">
            Acciones
          </q-tooltip>
          <q-menu cover auto-close>
            <q-list>
              <q-item clickable @click="getAllMedicalOffice()">
                <q-item-section>Listar</q-item-section>
              </q-item>
              <!-- <q-item clickable @click="edit()">
                <q-item-section>Editar</q-item-section>
              </q-item> -->
            </q-list>
          </q-menu>
        </q-btn>
      </div>
    </q-card-section>
    <q-card-actions>
      <q-btn flat round color="primary" icon="mdi-plus" @click="add">
        <q-tooltip transition-show="scale" transition-hide="scale">
          Agregar
        </q-tooltip>
      </q-btn>
      <q-btn
        flat
        round
        color="green"
        icon="mdi-pencil"
        @click="edit()"
        v-if="visibleEdit"
      >
        <q-tooltip transition-show="scale" transition-hide="scale">
          Editar
        </q-tooltip>
      </q-btn>
      <q-btn
        color="grey"
        round
        flat
        dense
        :icon="state.expanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
        @click="state.expanded = !state.expanded"
      />
    </q-card-actions>
    <q-slide-transition>
      <div v-show="state.expanded">
        <q-separator />
        <q-card-section class="text-subitle2">
          <q-form @submit="confirmChanges" ref="form" class="q-gutter-md">
            <q-input
              dense
              outlined
              v-model="state.countries[0].name_ascii"
              label="Pais"
              disable
            />
            <q-select
              dense
              clearable
              outlined
              v-model="state.region"
              :options="state.regions"
              :option-value="(item) => (item === null ? null : item.url)"
              option-label="name"
              map-options
              emit-value
              label="Departamento"
              @update:model-value="(val) => departmentChanged(val)"
              @clear="(val) => clearForm(val)"
              :rules="[isNotNull]"
            >
            </q-select>
            <q-select
              dense
              clearable
              outlined
              v-model="state.subRegion"
              :options="state.subRegions"
              :option-value="(item) => (item === null ? null : item.id)"
              option-label="name"
              map-options
              emit-value
              label="Ciudad"
              @clear="(val) => clearForm(val)"
              :rules="[isNotNull]"
            >
            </q-select>
            <q-input
              dense
              outlined
              v-model="state.address"
              label="Direccion"
              :rules="[required]"
            />
            <div>
              <q-btn label="Guardar" type="submit" color="primary" />
            </div>
          </q-form>
        </q-card-section>
      </div>
    </q-slide-transition>
  </q-card>
</template>
<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from 'vue';
import { QForm } from 'quasar';
import { IconSVG } from 'src/Application/Utilities';
import {
  CountryResponse,
  MedicalOfficeResponse,
  RegionResponse,
  SubRegionResponse,
} from 'src/Domine/Responses';
import { MedicalOfficeState } from 'src/Domine/IStates';
import 'src/css/app.sass';
import {
  CountryService,
  RegionService,
  SubRegionService,
} from 'src/Application/Services/GeographicCollectionService';
import container from 'src/inversify.config';
import { MedicalOfficeController } from 'src/Adapters/MedicalOfficeController';
import { InsertCommand } from 'src/Application/Commands';
import { IMedicalOffice } from 'src/Domine/ModelsDB';
import { MedicalOfficeService } from 'src/Application/Services/MedicalOfficeService';
import { required, isNotNull } from 'src/Application/Utilities/Helpers';

export default defineComponent({
  name: 'InsuranceForm',
  setup() {
    const state: MedicalOfficeState = reactive({
      countries: [{ name_ascii: '' }] as Array<CountryResponse>,
      regions: [] as Array<RegionResponse>,
      subRegions: [] as Array<SubRegionResponse>,
      medicalOffices: [] as Array<MedicalOfficeResponse>,
      addressMedicalOffice: '',
      region: undefined,
      subRegion: undefined,
      address: '',
      expanded: false,
      currentMedicalOffice: {} as MedicalOfficeResponse,
    });

    const controller = MedicalOfficeController.getInstance(state);
    const form = ref<QForm>();
    const disableSelectAddress = ref<boolean>(true);
    const visibleEdit = ref<boolean>(false);

    onMounted(async () => {
      const countryService = container.get<CountryService>('CountryService');
      const regionService = container.get<RegionService>('RegionService');
      // const subRegionService = container.get<SubRegionService>('RegionService');

      state.countries = await countryService.getAll();
      state.regions = await regionService.getAll();
      // state.subRegions = await subRegionService.getAll();
    });

    return {
      required,
      isNotNull,
      state,
      icons: IconSVG,
      form,
      disableSelectAddress,
      visibleEdit,
      clearForm(val: any) {
        controller.clear();
        form.value?.reset();
      },
      async departmentChanged(url: string) {
        await controller.getCitiesByDepartment(url);
      },
      async addressMedicalOfficeChanged(id: number) {
        console.log(id);
        if (id === null) {
          return;
        }
        visibleEdit.value = true;
        state.expanded = true;
        controller.showInfoMedicalOffice(id);
        const subRegionService =
          container.get<SubRegionService>('SubRegionService');
        state.subRegions = await subRegionService.getAll();
      },
      edit() {
        state.expanded = true;
        // if (state.expanded === false) {
        //   state.expanded = !state.expanded;
        // }
        // state.currentInsurance = state.insurance as HealthInsuranceResponse;
      },
      async getAllMedicalOffice() {
        await controller.getAllMedicalOffice();
        disableSelectAddress.value = false;

        console.log(state.medicalOffices);
      },
      async add() {
        state.expanded = true;
        visibleEdit.value = false;
        controller.clear();
        form.value?.reset();
      },
      async confirmChanges() {
        controller.resetAllCommand();
        const isValid = await form.value?.validate();
        if (isValid == false) {
          return;
        }
        if (state.region == undefined || state.subRegion == undefined) {
          throw new TypeError('City or Department is undefined');
        }

        const idCountry = controller.getIdByUrl(state.countries[0].url);
        const idRegion = controller.getIdByUrl(state.regions[0].url);
        const payload: IMedicalOffice = {
          address: state.address,
          country: idCountry,
          city: state.subRegion,
          department: idRegion,
        };
        const service = container.get<MedicalOfficeService>(
          'MedicalOfficeService'
        );
        const createCommand = new InsertCommand(payload, service);
        controller.setOnSave(createCommand);
        const response = await controller.saveOrUpdate();
        if (response != null) {
          controller.clear();
          form.value?.reset();
        }
      },
    };
  },
});
</script>
