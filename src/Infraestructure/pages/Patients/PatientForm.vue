<template>
  <q-page>
    <div class="row q-col-gutter-sm q-ma-xs q-mr-sm">
      <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
        <q-card class="my-card" bordered>
          <q-card-section>
            <q-item>
              <q-item-section avatar>
                <q-avatar square>
                  <img :src="icons.womanAndMan" />
                </q-avatar>
              </q-item-section>
              <div class="text-h4 text_bold">Pacientes</div>
            </q-item>
          </q-card-section>
          <q-separator inset></q-separator>
          <q-card-section>
            <div class="text-black">
              <q-toolbar>
                <q-space />
                <q-input
                  v-model="state.identificationPatient"
                  label="Nº Documento paciente"
                  clearable
                  dense
                  type="number"
                  @keydown.enter.prevent="searchPatient"
                  :rules="[numberRequired]"
                >
                  <template v-slot:append
                    ><q-btn
                      flat
                      round
                      dense
                      icon="search"
                      class="q-mr-xs"
                      @click="searchPatient"
                    />
                    <q-tooltip transition-show="scale" transition-hide="scale">
                      Buscar paciente por N° identificacion
                    </q-tooltip></template
                  ></q-input
                >
              </q-toolbar>
            </div>
            <q-form @submit="confirmChanges" ref="form">
              <q-list>
                <q-item>
                  <q-item-section>
                    <div class="row q-col-gutter-x-md">
                      <div class="col-6 col-md">
                        <q-input
                          :readonly="state.disable"
                          outlined
                          dense
                          v-model="state.currentPatient.name"
                          label="Nombres *"
                          lazy-rules
                          :rules="[required]"
                        />
                      </div>
                      <div class="col-6 col-md">
                        <q-input
                          :readonly="state.disable"
                          outlined
                          dense
                          v-model="state.currentPatient.lastName"
                          label="Apellidos *"
                          lazy-rules
                          :rules="[required]"
                        />
                      </div>
                    </div>
                    <div class="row q-col-gutter-x-md">
                      <div class="col-6 col-md">
                        <q-input
                          outlined
                          :readonly="state.disable"
                          dense
                          type="number"
                          v-model="state.currentPatient.identification"
                          label="Numero Identificacion *"
                          lazy-rules
                          :rules="[required, numberRequired]"
                        />
                      </div>
                      <div class="col-6 col-md">
                        <q-select
                          :readonly="state.disable"
                          dense
                          clearable
                          outlined
                          v-model="state.idType"
                          :options="state.allIDTypes"
                          option-value="id"
                          option-label="description"
                          map-options
                          label="Tipo Documento *"
                          @update:model-value="(val) => idTypeChanged(val)"
                          :rules="[isNotNull]"
                        >
                        </q-select>
                      </div>
                    </div>
                    <div class="row q-col-gutter-x-md">
                      <div class="col-6 col-md">
                        <q-input
                          :readonly="state.disable"
                          dense
                          outlined
                          v-model="state.currentPatient.phoneNumber"
                          label="Telefono *"
                          mask="##########"
                          unmasked-value
                          lazy-rules
                          :rules="[
                            (val) =>
                              (val && val.length > 9) || 'Celular no valido',
                          ]"
                        />
                      </div>
                      <div class="col-6 col-md">
                        <q-input
                          outlined
                          :readonly="state.disable"
                          v-model="state.currentPatient.dateBirth"
                          dense
                          label="Fecha Nacimiento *"
                          :rules="[required]"
                        >
                          <template v-slot:append>
                            <q-icon name="event">
                              <q-popup-proxy
                                transition-show="scale"
                                transition-hide="scale"
                              >
                                <q-date
                                  v-model="state.currentPatient.dateBirth"
                                  today-btn
                                  mask="YYYY-MM-DD"
                                >
                                  <div class="row items-center justify-end">
                                    <q-btn
                                      v-close-popup
                                      label="Cerrar"
                                      color="primary"
                                      flat
                                    />
                                  </div>
                                </q-date>
                              </q-popup-proxy>
                            </q-icon>
                          </template>
                        </q-input>
                      </div>
                    </div>
                    <div class="row q-col-gutter-x-md">
                      <div class="col-6 col-md">
                        <q-select
                          :readonly="state.disable"
                          dense
                          clearable
                          outlined
                          v-model="state.insurance"
                          :options="state.allInsurance"
                          option-value="id"
                          option-label="nameInsurance"
                          map-options
                          label="Entidad *"
                          @update:model-value="(val) => insuranceChanged(val)"
                          :rules="[isNotNull]"
                        >
                        </q-select>
                      </div>
                      <div class="col-6 col-md">
                        <q-select
                          :readonly="state.disable"
                          dense
                          clearable
                          outlined
                          v-model="state.gender"
                          :options="state.allGenders"
                          option-value="id"
                          option-label="nameGender"
                          map-options
                          label="Genero *"
                          @update:model-value="(val) => genderChanged(val)"
                          :rules="[isNotNull]"
                        >
                        </q-select>
                      </div>
                    </div>
                    <div class="row q-col-gutter-x-md">
                      <div class="col-12 col-md">
                        <q-input
                          :readonly="state.disable"
                          label="Correo electronico"
                          dense
                          v-model="state.currentPatient.email"
                          type="email"
                          :error="state.error"
                          @blur="(evt) => isValidEmail(evt.target?.value)"
                        />
                      </div>
                    </div>
                  </q-item-section>
                </q-item>
                <div>
                  <small>
                    <cite>* = Campos Obligatorios</cite>
                    <q-tooltip anchor="bottom left" self="top left">
                      Los campos marcados con * son obligatorios
                    </q-tooltip>
                  </small>
                </div>
              </q-list>
              <q-card-actions align="right" class="text-teal">
                <q-btn
                  label="Guardar"
                  type="submit"
                  color="primary"
                  icon-right="mdi-content-save"
                />
                <q-btn
                  v-if="state.disable"
                  color="secondary"
                  icon-right="mdi-pencil"
                  label="Editar"
                  @click="enableEdition"
                  class="q-ml-sm"
                />
              </q-card-actions>
            </q-form>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from 'vue';
import {
  IGender,
  IHealthInsurance,
  IIDType,
  IPatient,
} from 'src/Domine/ModelsDB';
import { IconSVG } from 'src/Application/Utilities/Constants';
import { IDTypesRepository } from 'src/Application/Repositories/PatientRepository';
import 'src/css/app.sass';
import { InsuranceRepository } from 'src/Application/Repositories/SettingsRepository';
import { PatientState } from 'src/Domine/IStates';
import {
  GenderResponse,
  HealthInsuranceResponse,
  IDTypeResponse,
} from 'src/Domine/Responses';
import { QForm } from 'quasar';
import { PatientController } from 'src/Adapters';
import {
  required,
  emailRequired,
  isNotNull,
  numberRequired,
} from 'src/Application/Utilities/Helpers';
import { GenderService } from 'src/Application/Services';

export default defineComponent({
  setup() {
    const state: PatientState = reactive({
      currentPatient: { email: null } as IPatient,
      allIDTypes: [] as Array<IDTypeResponse>,
      allGenders: [] as Array<GenderResponse>,
      allInsurance: [] as Array<HealthInsuranceResponse>,
      identificationPatient: '',
      idType: null,
      gender: null,
      insurance: null,
      disable: false,
      error: false,
      currentInsurance: {} as IHealthInsurance,
    });

    const form = ref<QForm>();
    const controller = PatientController.getInstance(state);
    const insuranceRepository = InsuranceRepository.getInstance();
    const idTypesRepository = new IDTypesRepository();
    const genderRepository = new GenderService();

    onMounted(async () => {
      const idTypes = await idTypesRepository.getAll();
      const genders = await genderRepository.getAll();
      const insurance = await insuranceRepository.getAll();
      state.allIDTypes = idTypes.ok == false ? [] : await idTypes.json();
      state.allGenders = genders == null ? [] : genders;
      state.allInsurance = insurance.ok == false ? [] : await insurance.json();
    });

    return {
      state,
      form,
      required,
      emailRequired,
      numberRequired,
      isNotNull,
      icons: IconSVG,
      async confirmChanges() {
        const isValid = await form.value?.validate();
        if (isValid == false) return;
        const response = await controller.saveOrUpdate();
        if (response != null) {
          form.value?.reset();
        }
      },
      isValidEmail(val: string) {
        controller.isValidEmail(val);
      },
      idTypeChanged(val: IIDType) {
        if (val.id === undefined) return;
        state.currentPatient.IDType = val.id;
      },
      insuranceChanged(val: IHealthInsurance) {
        if (val.id === undefined) return;
        state.currentPatient.insurance = val.id;
      },
      genderChanged(val: IGender) {
        if (val.id === undefined) return;
        state.currentPatient.gender = val.id;
      },
      async searchPatient() {
        const response = await controller.searchByIdentificacion(
          state.identificationPatient
        );
        if (response !== null) {
          controller.setData(response);
        } else {
          form.value?.reset();
        }
      },
      enableEdition() {
        controller.enableEdition();
      },
    };
  },
});
</script>
<style lang="sass" scoped>
.my-custom-toggle
  border: 1px solid #027be3
</style>
