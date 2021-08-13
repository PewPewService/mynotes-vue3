<!-- eslint-disable prettier/prettier  -->
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
                  class="input_error"
                  v-if="!input.valid"
                >
                  {{input.error}}
                </p>
              </div>
              <button class="btn btn-primary w-100" type="submit">
                {{ UserInputs.buttonCaption }}
              </button>
            </form>
            <p class="mt-3 h5 cursor-unset">
              <a class="badge cursor-pointer p-2" @click="ChangeForm">
                {{ UserInputs.switchMessage }}
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
      <button 
        class="btn btn-primary"
        @click="LogOut"
      >logout</button>
    </div>
  </div>
</template>

<script>
/*eslint-disable prettier/prettier */
import { mapActions, mapGetters } from "vuex";
import { actionTypes, getterTypes, moduleName } from "../store/modules/auth";
import { VerifyPasswords } from "../utils/validation/passwords";
import { VerifyEmail } from "../utils/validation/email";
import { VerifyLength } from "../utils/validation/length";
export default {
  data() {
    return {
      RegistrationForm: {
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
            error: "Passwords should be identical with length between 5 and 30 symbols!",
            valid: true,
          },
        ],
        buttonCaption: "REGISTER",
        switchMessage: "Have an account? Login",
      },
      LoginForm: {
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
      },
      UserInputs: {},
      Animation: true,
      EnterAnimation: "fadeOutUp",
      LeaveAnimation: "fadeInDown",
    };
  },

  computed: {
    ...mapGetters(moduleName, [
      getterTypes.GETTER_AUTH_ERROR,
      getterTypes.GETTER_JWT,
      getterTypes.GETTER_USER,
    ]),
    AuthError() {
      return this[getterTypes.GETTER_AUTH_ERROR];
    },
    JWT() {
      return this[getterTypes.GETTER_JWT];
    },
    USER() {
      return this[getterTypes.GETTER_USER];
    },
    LoginData() {
      return {
        username: this.LoginForm.form[0].data,
        password: this.LoginForm.form[1].data,
      };
    },
    RegisterData() {
      return {
        username: this.RegistrationForm.form[0].data,
        email: this.RegistrationForm.form[1].data,
        password: this.RegistrationForm.form[2].data,
      };
    },
  },

  created() {
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

    ClearForm() {
      this[actionTypes.ACTION_CLEAR_RESPONSES]();
      for (let input of this.RegistrationForm.form) input.data = "";
      for (let input of this.LoginForm.form) input.data = "";
    },

    RegisterValidate() {
      this.UserInputs.form[0].valid =
        VerifyLength(this.UserInputs.form[0].data)
      this.UserInputs.form[1].valid =
        VerifyEmail(this.UserInputs.form[1].data);
      this.UserInputs.form[3].valid =
        VerifyPasswords(this.UserInputs.form[2].data, this.UserInputs.form[3].data);
      if ( this.UserInputs.form[0].valid
        && this.UserInputs.form[1].valid && this.UserInputs.form[3].valid) {
          this[actionTypes.ACTION_REGISTER](this.RegisterData);
        }
    },

    SubmitForm(e) {
      e.preventDefault();
      if (this.UserInputs.name === this.LoginForm.name) {
        this[actionTypes.ACTION_LOGIN](this.LoginData);
      } else this.RegisterValidate();
    },

    ChangeForm() {
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

    LogOut() {
      this[actionTypes.ACTION_LOGOUT]();
      this.ClearForm();
    },
  },
};
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
