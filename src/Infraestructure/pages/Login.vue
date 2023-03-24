<template>
  <div id="q-app">
    <q-layout view="lHh Lpr fff">
      <q-page
        class="window-height window-width row justify-center items-center"
        style="background: linear-gradient(#8274c5, #5a4a9f)"
      >
        <div class="column q-pa-lg">
          <div class="row">
            <q-card
              square
              class="shadow-24"
              style="width: 400px; height: 540px"
            >
              <q-card-section class="bg-deep-purple-7">
                <h4 class="text-h5 text-white q-my-md">{{ title }}</h4>
              </q-card-section>
              <q-card-section>
                <q-fab
                  color="primary"
                  @click="switchTypeForm"
                  icon="add"
                  class="absolute"
                  style="top: 0; right: 12px; transform: translateY(-50%)"
                >
                  <q-tooltip> Registro Usuarios </q-tooltip>
                </q-fab>
                <q-form class="q-px-sm q-pt-xl" ref="form">
                  <q-input
                    square
                    clearable
                    v-model="email"
                    type="email"
                    lazy-rules
                    :rules="[required, isEmail, short]"
                    label="Email"
                  >
                    <template v-slot:prepend>
                      <q-icon name="email" />
                    </template>
                  </q-input>
                  <q-input
                    v-if="register"
                    square
                    clearable
                    v-model="username"
                    lazy-rules
                    :rules="[required, short]"
                    type="username"
                    label="Nombre Usuario"
                  >
                    <template v-slot:prepend>
                      <q-icon name="person" />
                    </template>
                  </q-input>
                  <q-input
                    square
                    clearable
                    v-model="password"
                    :type="passwordFieldType"
                    lazy-rules
                    :rules="[required, short]"
                    label="Contraseña"
                  >
                    <template v-slot:prepend>
                      <q-icon name="lock" />
                    </template>
                    <template v-slot:append>
                      <q-icon
                        :name="visibilityIcon"
                        @click="switchVisibility"
                        class="cursor-pointer"
                      />
                    </template>
                  </q-input>
                  <q-input
                    v-if="register"
                    square
                    clearable
                    v-model="repassword"
                    :type="passwordFieldType"
                    lazy-rules
                    :rules="[required, short, diffPassword]"
                    label="Confirmacion Contraseña"
                  >
                    <template v-slot:prepend>
                      <q-icon name="lock" />
                    </template>
                    <template v-slot:append>
                      <q-icon
                        :name="visibilityIcon"
                        @click="switchVisibility"
                        class="cursor-pointer"
                      />
                    </template>
                  </q-input>
                </q-form>
              </q-card-section>

              <q-card-actions class="q-px-lg">
                <q-btn
                  unelevated
                  size="lg"
                  color="secondary"
                  @click="submit"
                  class="full-width text-white"
                  :label="btnLabel"
                />
              </q-card-actions>
              <q-card-section v-if="!register" class="text-center q-pa-sm">
                <p class="text-grey-6">No tienes una cuenta?</p>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </q-page>
    </q-layout>
  </div>
</template>
<script lang="ts">
import { QForm } from 'quasar';
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'LoginUser',
  setup() {
    const password = ref<string>('');
    const register = ref<boolean>(false);
    const title = ref<string>('Bienvenido');
    const btnLabel = ref<string>('Ingresar');
    const visibility = ref<boolean>(false);
    const passwordFieldType = ref<string>('password');
    const visibilityIcon = ref<string>('visibility');
    const email = ref<string>('');
    const username = ref<string>('');
    const form = ref<QForm>();
    return {
      required(val: string) {
        return (val && val.length > 0) || 'Campo requerido';
      },
      diffPassword(val: string) {
        const val2 = password.value;
        console.log('passwor malo');
        return (val && val === val2) || 'Password no coinciden!';
      },
      short(val: string) {
        return (val && val.length > 3) || 'Longitud mayor a 3 caracteres';
      },
      isEmail(val: string) {
        const emailPattern =
          /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
        return emailPattern.test(val) || 'email Invalido';
      },
      switchTypeForm() {
        email.value = '';
        password.value = '';
        register.value = !register.value;
        title.value = register.value ? 'Registro' : 'Bienvenido';
        btnLabel.value = register.value ? 'Registrar' : 'Ingresar';
        form.value?.reset();
      },
      switchVisibility() {
        visibility.value = !visibility.value;
        passwordFieldType.value = visibility.value ? 'text' : 'password';
        visibilityIcon.value = visibility.value
          ? 'visibility_off'
          : 'visibility';
      },
      form,
      btnLabel,
      email,
      username,
      password,
      repassword: '',
      register,
      passwordFieldType,
      visibility,
      visibilityIcon,
      title,
    };
  },
});
</script>
