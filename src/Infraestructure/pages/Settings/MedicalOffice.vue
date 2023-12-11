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
          v-model="state.address"
          :options="state.medicalOffices"
          :option-value="(item) => (item === null ? null : item.id)"
          option-label="address"
          map-options
          emit-value
          label="Consultorios"
          @update:model-value="(val) => addressMedicalOfficeChanged(val)"
          @clear="(val) => clearForm()"
          style="overflow: auto"
          class="col-grow"
          :disable="state.disableSelectAddress"
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
        v-if="state.visibleEdit"
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
              :disable="!state.enableForEdit"
              dense
              clearable
              outlined
              v-model="state.medicalOfficeResponse.department.name"
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
              :disable="!state.enableForEdit"
              dense
              clearable
              outlined
              v-model="state.medicalOfficeResponse.city.name"
              :options="state.subRegions"
              :option-value="(item) => (item === null ? null : item.id)"
              option-label="name"
              map-options
              emit-value
              label="Ciudad"
              @clear="(val) => clearForm(val)"
              @update:model-value="(val) => cityChanged(val)"
              :rules="[isNotNull]"
            >
            </q-select>
            <q-input
              :disable="!state.enableForEdit"
              dense
              outlined
              v-model="state.medicalOfficeResponse.address"
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
  RegionResponseModel,
  SubRegionResponse,
  SubRegionResponseModel,
} from 'src/Domine/Responses';
import { MedicalOfficeState } from 'src/Domine/IStates';
import 'src/css/app.sass';
import {
  CountryService,
  RegionService,
} from 'src/Application/Services/GeographicCollectionService';
import container from 'src/inversify.config';
import { MedicalOfficeController } from 'src/Adapters/MedicalOfficeController';
import { EditCommand, InsertCommand } from 'src/Application/Commands';
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
      address: '',
      expanded: false,
      medicalOfficeResponse: {
        department: {} as RegionResponseModel,
        city: {} as SubRegionResponseModel,
      } as MedicalOfficeResponse,
      medicalOfficeEntity: {} as IMedicalOffice,
      disableSelectAddress: true,
      enableForEdit: false,
      visibleEdit: false,
    });

    const controller = MedicalOfficeController.getInstance(state);
    const form = ref<QForm>();

    onMounted(async () => {
      const countryService = container.get<CountryService>('CountryService');
      const regionService = container.get<RegionService>('RegionService');

      state.countries = await countryService.getAll();
      state.regions = await regionService.getAll();
    });

    return {
      required,
      isNotNull,
      state,
      icons: IconSVG,
      form,
      clearForm() {
        controller.clear();
        form.value?.reset();
      },
      async departmentChanged(url: string) {
        const id = controller.getIdByUrl(url);
        await controller.getCitiesByDepartment(id);
        state.medicalOfficeResponse.city = {} as SubRegionResponseModel;
        state.medicalOfficeEntity.department = id;
      },
      async cityChanged(id: string) {
        state.medicalOfficeEntity.city = parseInt(id);
      },
      async addressMedicalOfficeChanged(id: number) {
        controller.showInfoMedicalOffice(id);
      },
      edit() {
        controller.edit();
      },
      async getAllMedicalOffice() {
        await controller.getAllMedicalOffice();
      },
      async add() {
        state.visibleEdit = false;
        controller.clear();
        form.value?.reset();
      },
      async confirmChanges() {
        controller.resetAllCommand();
        const isValid = await form.value?.validate();
        if (isValid == false) return;

        const service = container.get<MedicalOfficeService>(
          'MedicalOfficeService'
        );
        let payload: IMedicalOffice = state.medicalOfficeEntity;
        payload.address = state.medicalOfficeResponse.address;
        payload.country = controller.getIdByUrl(state.countries[0].url);

        if (state.medicalOfficeResponse?.id == undefined) {
          const createCommand = new InsertCommand(payload, service);
          controller.setOnSave(createCommand);
        } else {
          const id = state.medicalOfficeResponse?.id;
          payload.id = id;
          const upateCommand = new EditCommand(payload, id, service);
          controller.setOnUpdate(upateCommand);
        }

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
