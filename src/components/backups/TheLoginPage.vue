<template>
  <div class="w-100 my-auto">
    <div v-if="!JWT">
      <transition
        :enter-active-class="EnterAnimation"
        :leave-active-class="LeaveAnimation"
      >
        <div
          class="login d-flex justify-content-around m-4 mobile"
          v-if="Animation"
        >
          <div class="p-3 my-auto cursor-default">
            <p class="h1">Welcome to</p>
            <p class="h1">MyNotes!</p>
          </div>
          <div class="w-50 border rounded shadow p-4">
            <p class="mt-2 h4 cursor-default">{{ UserInputs.name }}</p>

            <form
              class="w-75 mx-auto input-group has-validation"
              @submit="SubmitForm"
            >
              <div
                v-for="input in UserInputs.form"
                :key="input.placeholder"
                class="w-100 mx-auto mb-2"
              >
                <input
                  v-model="input.data"
                  :placeholder="input.placeholder"
                  :type="input.type"
                  trim
                  required
                  class="form-control"
                />
                <p
                  v-if="!input.valid"
                  class="input_error"
                >
                  {{ input.error }}
                </p>
              </div>
              <button class="btn btn-primary w-100" type="submit">
                {{ UserInputs.buttonCaption }}
              </button>
            </form>
            <p class="mt-3 h5 cursor-unset">
              <a
                class="badge cursor-pointer"
                @click="ChangeForm"
              >
                {{ UserInputs.switchMessage }}
              </a>
            </p>
            <p
              v-if="UserInputs.name == LoginForm.name"
              class="h5 cursor-unset"
            >
              <a
                class="badge cursor-pointer"
                href="/passwordReset"
              >
                Forgot your password?
              </a>
            </p>
            <p>
              <span class="mt-3 mb-5 input_error">
                {{ AuthError }}
              </span>
            </p>
          </div>
        </div>
      </transition>
    </div>
    <div
      v-else
      class="
        login
        d-flex
        justify-content-around
        p-5
        m-4
        mobile
        border
        rounded
        shadow
      "
    >
      Hi, {{ USER }}!
      <button class="btn btn-primary" @click="LogOut">logout</button>
    </div>
    <div
      class="spinner-border text-primary centered"
      role="status"
      v-if="Loading"
    />
  </div>
</template>

<script lang="ts">
/* eslint-disable no-unused-vars */
import This from "../utils/interfaces/this";
import { mapActions, useStore } from "vuex";
import { actionTypes, getterTypes, moduleName } from "../store/modules/auth";
import { VerifyPasswords } from "../utils/validation/passwords";
import { VerifyEmail } from "../utils/validation/email";
import { VerifyLength } from "../utils/validation/length";
import { computed, defineComponent, ref } from "@vue/runtime-core";

export default defineComponent({
  name: "TheLoginPage",
  setup() {
    let RegistrationForm = {
      name: "Registration",
      form: [
        {
          type: "text",
          placeholder: "Enter your username here",
          data: "",
          error: "The length should be between 5 and 30 symbols!",
          valid: true,
        },
        {
          type: "email",
          placeholder: "And your email here",
          data: "",
          error: "The email is invalid!",
          valid: true,
        },
        {
          type: "password",
          placeholder: "Type in your password",
          data: "",
          valid: true,
        },
        {
          type: "password",
          placeholder: "Repeat it here",
          data: "",
          error:
            "Passwords should be identical with length between 5 and 30 symbols!",
          valid: true,
        },
      ],
      buttonCaption: "REGISTER",
      switchMessage: "Have an account? Login",
    };
    let LoginForm = {
      name: "Login",
      form: [
        {
          type: "text",
          placeholder: "Enter your username or email here",
          data: "",
          valid: true,
        },
        {
          type: "password",
          placeholder: "And the password here",
          data: "",
          valid: true,
        },
      ],
      buttonCaption: "LOGIN",
      switchMessage: "First time? Register",
    };
    let UserInputs = ref({});
    let Animation = ref(true);
    let EnterAnimation = ref("fadeOutUp");
    let LeaveAnimation = ref("fadeInDown");

    let store = useStore();
    let AuthError = computed(
      () => store.getters[`${moduleName}/${getterTypes.GETTER_AUTH_ERROR}`]
    );
    let JWT = computed(
      () => store.getters[`${moduleName}/${getterTypes.GETTER_JWT}`]
    );
    let USER = computed(
      () => store.getters[`${moduleName}/${getterTypes.GETTER_USER}`]
    );
    let Loading = computed(
      () => store.getters[`${moduleName}/${getterTypes.GETTER_LOADING}`]
    );

    return {
      RegistrationForm,
      LoginForm,
      UserInputs,
      Animation,
      EnterAnimation,
      LeaveAnimation,
      AuthError,
      JWT,
      USER,
      Loading,
    };
  },

  created(this: This) {
    this.UserInputs = this.LoginForm;
    this[actionTypes.ACTION_CHECK_COOKIE]();
    this[actionTypes.ACTION_CLEAR_RESPONSES]();
  },

  methods: {
    ...mapActions(moduleName, [
      actionTypes.ACTION_REGISTER,
      actionTypes.ACTION_LOGIN,
      actionTypes.ACTION_LOGOUT,
      actionTypes.ACTION_CHECK_COOKIE,
      actionTypes.ACTION_CLEAR_RESPONSES,
    ]),

    LoginData() {
      return {
        username: this.LoginForm.form[0].data.trim(),
        password: this.LoginForm.form[1].data.trim(),
      };
    },

    RegisterData() {
      return {
        username: this.RegistrationForm.form[0].data.trim(),
        email: this.RegistrationForm.form[1].data.trim(),
        password: this.RegistrationForm.form[2].data,
      };
    },

    ClearForm(this: This) {
      this[actionTypes.ACTION_CLEAR_RESPONSES]();
      for (let input of this.RegistrationForm.form) input.data = "";
      for (let input of this.LoginForm.form) input.data = "";
    },

    RegisterValidate(this: This) {
      this.UserInputs.form[0].valid = VerifyLength(
        this.UserInputs.form[0].data
      );
      this.UserInputs.form[1].valid = VerifyEmail(this.UserInputs.form[1].data);
      this.UserInputs.form[3].valid = VerifyPasswords(
        this.UserInputs.form[2].data,
        this.UserInputs.form[3].data
      );
      if (
        this.UserInputs.form[0].valid &&
        this.UserInputs.form[1].valid &&
        this.UserInputs.form[3].valid
      ) {
        this[actionTypes.ACTION_REGISTER](this.RegisterData());
      }
    },

    SubmitForm(this: This, e: Event) {
      e.preventDefault();
      if (this.UserInputs.name === this.LoginForm.name) {
        this[actionTypes.ACTION_LOGIN](this.LoginData());
      } else this.RegisterValidate();
    },

    ChangeForm(this: This) {
      if (this.UserInputs.name == this.LoginForm.name) {
        this.EnterAnimation = "fadeInDown";
        this.LeaveAnimation = "fadeOutDown";
      } else {
        this.EnterAnimation = "fadeInUp";
        this.LeaveAnimation = "fadeOutUp";
      }
      this.Animation = false;
      setTimeout(() => {
        this.Animation = true;
        this.UserInputs =
          this.UserInputs.name == "Login"
            ? this.RegistrationForm
            : this.LoginForm;
        this.ClearForm();
      }, 1000);
    },

    LogOut(this: This) {
      this[actionTypes.ACTION_LOGOUT]();
      this.ClearForm();
    },
  },
});
</script>

<style lang="scss" scoped>
@media (max-width: 699px) {
  .d-flex {
    flex-direction: column;
  }
  .w-50 {
    width: 100% !important;
    align-self: center;
  }
}
</style>
