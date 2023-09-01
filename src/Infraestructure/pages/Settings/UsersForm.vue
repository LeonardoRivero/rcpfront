<template>
  <q-card class="my-card" bordered>
    <q-card-section>
      <q-item>
        <q-item-section avatar>
          <q-avatar square>
            <img :src="icons.womanAndMan" />
          </q-avatar>
        </q-item-section>
        <div class="text-h4 text_bold">Registro Usuarios</div>
      </q-item>
    </q-card-section>
    <q-separator inset></q-separator>
    <q-card-section>
      <div class="text-black">
        <q-toolbar>
          <q-space />
          <!-- <q-input
            label="Nº Documento usuario"
            clearable
            dense
            v-model="state.identification"
            type="number"
            @keydown.enter.prevent="searchPatient"
            lazy-rules
            :rules="[(val) => val > 0 || 'Numero invalido']"
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
                Buscar usuario por N° identificacion
              </q-tooltip></template
            ></q-input
          > -->
        </q-toolbar>
      </div>
      <q-form @submit="confirmChanges" ref="form">
        <q-list>
          <q-item>
            <q-item-section>
              <div class="row q-col-gutter-x-md">
                <div class="col-6 col-md">
                  <q-input
                    v-model="state.user.first_name"
                    outlined
                    dense
                    label="Nombres *"
                    lazy-rules
                    :rules="[required]"
                  />
                </div>
                <div class="col-6 col-md">
                  <q-input
                    v-model="state.user.last_name"
                    outlined
                    dense
                    label="Apellidos *"
                    lazy-rules
                    :rules="[required]"
                  />
                </div>
              </div>
              <div class="row q-col-gutter-x-md">
                <!-- <div class="col-6 col-md">
                  <q-input
                    v-model="state.identification"
                    outlined
                    :readonly="disable"
                    dense
                    type="number"
                    label="Numero Identificacion *"
                    :rules="[numberRequired]"
                  />
                </div> -->
                <div class="col-12 col-md">
                  {{ state }}
                  <q-select
                    v-model="state.user.group"
                    dense
                    outlined
                    :options="allGroups"
                    :option-value="(item) => (item === null ? null : item.id)"
                    option-label="name"
                    map-options
                    label="Grupo *"
                    stack-label
                    emit-value
                    input-debounce="0"
                    :rules="[isNotNull]"
                    @update:model-value="(val) => groupChanged(val)"
                  >
                  </q-select>
                </div>
              </div>
              <div class="row q-col-gutter-x-md">
                <div class="col-6 col-md">
                  <q-select
                    v-if="state.user.group == 1"
                    v-model="state.specialities"
                    dense
                    outlined
                    :options="allSpecialities"
                    :option-value="(item) => (item === null ? null : item.id)"
                    option-label="description"
                    map-options
                    label="Especialidad *"
                    stack-label
                    emit-value
                    input-debounce="0"
                    :rules="[isNotNull]"
                    multiple
                  >
                  </q-select>
                  <!-- <q-input
                    v-model="state.phoneNumber"
                    dense
                    outlined
                    label="Telefono *"
                    mask="##########"
                    unmasked-value
                    lazy-rules
                    :rules="[
                      (val) => (val && val.length > 9) || 'Celular no valido',
                    ]"
                  /> -->
                </div>
                <!-- <div class="col-6 col-md">
                  <q-input
                    v-model="state.dateBirthday"
                    outlined
                    :readonly="disable"
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
                            v-model="state.dateBirthday"
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
                </div> -->
              </div>
              <div class="row q-col-gutter-x-md">
                <div class="col-12 col-md">
                  <q-input
                    :readonly="disable"
                    label="Correo electronico"
                    dense
                    type="email"
                    :rules="[required, emailRequired]"
                    lazy-rules
                    v-model="state.user.email"
                  />
                </div>
              </div>
            </q-item-section>
          </q-item>
        </q-list>
        <q-card-actions align="right" class="text-teal">
          <q-btn label="Guardar" type="submit" color="primary" />
          <!-- <q-btn
            v-if="state.user.group == 1"
            color="secondary"
            icon-right="mdi-pencil"
            label="Editar"
            @click="enableEdition()"
            class="q-ml-sm"
          /> -->
        </q-card-actions>
      </q-form>
    </q-card-section>
  </q-card>
</template>
<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from 'vue';
import { UserState } from 'src/Domine/IStates';
import { IconSVG, Messages } from 'src/Application/Utilities';
import { SettingsMediator } from 'src/Infraestructure/Mediators';
import { Group, SpecialityResponse } from 'src/Domine/Responses';
import {
  required,
  emailRequired,
  numberRequired,
  isNotNull,
} from 'src/Application/Utilities/Helpers';
import { UserController } from 'src/Adapters/UserController';
import { QForm } from 'quasar';
import { IDoctor, IUser } from 'src/Domine/ModelsDB';
import { DoctorService } from 'src/Application/Services';
import { CreateCommand, UpdateCommand } from 'src/Application/Commands';
import { UserService } from 'src/Application/Services/UserService';
import { FactoryNotifactors } from 'src/Adapters/Creators/Factories';
import { Notificator } from 'src/Domine/IPatterns';
import { ModalType } from 'src/Domine/Types';

export default defineComponent({
  name: 'UsersForm',
  setup() {
    const icons = IconSVG;
    const state: UserState = reactive({
      IdType: null,
      identification: null,
      phoneNumber: null,
      groups: [],
      specialities: [],
      isActive: true,
      user: {
        first_name: '',
        last_name: '',
        email: '',
        first_time: true,
        group: null,
      },
    });
    const form = ref<QForm>();
    const mediator = SettingsMediator.getInstance();
    const allGroups = ref<Array<Group>>([]);
    const allSpecialities = ref<Array<SpecialityResponse>>([]);
    const controller = UserController.getInstance(state);
    controller.setMediator(mediator);
    const notifyQuasar: Notificator =
      FactoryNotifactors.getInstance().createNotificator(
        ModalType.NotifyQuasar
      );

    onMounted(async () => {
      allGroups.value = await mediator.getAllGroups();
      allSpecialities.value = await mediator.getAllSpecialities();
    });
    return {
      required,
      numberRequired,
      emailRequired,
      isNotNull,
      form,
      icons,
      state,
      disable: false,
      allGroups,
      allSpecialities,
      async confirmChanges() {
        controller.resetAllCommand();
        const isValid = await form.value?.validate();
        if (isValid == false) return;

        const service = new UserService();
        if (state.user.id == undefined) {
          delete state.user['id'];
          const register = new CreateCommand(state.user, service);
          controller.setOnSave(register);
        }
        if (state.user.id != undefined) {
          const register = new UpdateCommand(state.user, service);
          controller.setOnUpdate(register);
        }

        const response = await controller.saveOrUpdate();
        if (response != null) {
          form.value?.reset();
          state.user = {} as IUser;
          notifyQuasar.setType('success');
          notifyQuasar.show(Messages.successMessage);
        }
        // const findByParameter = new FindByParametersCommand(
        //   { email: state.user.email },
        //   service
        // );
        // controller.setOnFindByParameters(findByParameter);
        // controller.findByParameters();
        // const payload: IDoctor = {
        //   codigo: '892348',
        //   name: state.user.first_name,
        //   lastName: state.user.last_name,
        //   speciality: state.specialities,
        // };
        // const service = new DoctorService();
        // const commandGuardar = new CreateCommand(payload, service);
        // controller.setOnSave(commandGuardar);
        // controller.intentoGuardar();
      },
      async groupChanged(val: number) {
        controller.checkGroup(val, allGroups.value);
        //await controller.specialityChanged(val);
        // const store: IStoreSettings = mediator.getStore();
        // store.currentSpeciality = val;
        // mediator.notify(store, controller);
      },
    };
  },
});
</script>
