<template>
  <div
    v-if="Loading"
    class="spinner-border text-primary centered"
    role="status"
  />
  <div class="w-75 border rounded shadow mx-auto p-3 pt-4 mb-5">
    <span class="w-100 mx-auto fw-bold h5">
      {{ UserForm.caption }}
    </span>
    <form
      class="w-75 mx-auto mt-5 input-group has-validation"
      @submit="SubmitForm"
    >
      <div
        v-for="input in UserForm.form"
        :key="input.placeholder"
        class="w-100 mx-auto mb-2"
      >
        <input
          v-model="input.data"
          :placeholder="input.placeholder"
          :type="input.type"
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
      <button
        type="submit"
        class="w-100 btn btn-primary mb-3"
      > {{ UserForm.buttonCaption }}
      </button>
    </form>
    <p
      v-if="EmailError"
      class="input_error w-75 mx-auto"
    > {{ EmailError }} </p>
    <p
      v-if="EmailSuccess"
      class="input_success w-75 mx-auto"
    > {{ EmailSuccess }} </p>
    <p class="h5 cursor-unset">
      <a
        class="badge cursor-pointer"
        href="/login"
      >
        Sign in
      </a>
    </p>
  </div>
</template>

<script lang="ts">
/* eslint-disable no-unused-vars */
import This from "../utils/interfaces/this";
import { computed, defineComponent, ref } from "@vue/runtime-core";
import { mapActions, useStore } from "vuex";
import { VerifyPasswords } from "../utils/validation/passwords";
import { VerifyEmail } from "../utils/validation/email";
import { actionTypes, getterTypes, moduleName } from "../store/modules/auth";

export default defineComponent({
  name: "ThePasswordResetPage",
  setup() {
    let token = ref("");
    let UserForm = ref({});
    const EmailForm = {
      caption: "Forgot your password? We're here to help you.",
      form: [
        {
          type: "email",
          placeholder: "Enter your email here",
          data: "",
          valid: true,
          error: "Invalid Email!",
        },
      ],
      buttonCaption: "Send a password reset mail",
    };
    const PasswordForm = {
      caption: "You're one step ahead of getting your account back!",
      form: [
        {
          type: "password",
          placeholder: "Enter your password here",
          data: "",
          valid: true,
        },
        {
          type: "password",
          placeholder: "And repeat it here",
          data: "",
          valid: true,
          error: "Passwords should be identical with length between 5 and 30 symbols!",
        },
      ],
      buttonCaption: "Change password",
    };

    const store = useStore();
    const EmailError = computed(
      () => store.getters[`${moduleName}/${getterTypes.GETTER_AUTH_ERROR}`]
    );
    const EmailSuccess = computed(
      () => store.getters[`${moduleName}/${getterTypes.GETTER_AUTH_SUCCESS}`]
    );
    const Loading = computed(
      () => store.getters[`${moduleName}/${getterTypes.GETTER_LOADING}`]
    );

    return {
      token,
      UserForm,
      EmailForm,
      PasswordForm,
      EmailError,
      EmailSuccess,
      Loading,
    };
  },

  methods: {
    ...mapActions(moduleName, [
      actionTypes.ACTION_SEND_EMAIL,
      actionTypes.ACTION_CHANGE_PASSWORD,
    ]),

    EmailData() {
      return this.EmailForm.form[0].data.trim();
    },

    PasswordData() {
      return {
        password: this.PasswordForm.form[0].data,
        passwordrepeat: this.PasswordForm.form[1].data,
      };
    },

    SendEmail(this: This) {
      let email = this.EmailData();
      let valid = VerifyEmail(email);
      this.UserForm.form[0].valid = valid;
      if (valid) {
        let data = {
          email: this.EmailData(),
          route: document.URL,
        };
        this[actionTypes.ACTION_SEND_EMAIL](data);
      }
    },

    ResetPassword(this: This) {
      let passwords = this.PasswordData();
      let valid = VerifyPasswords(passwords.password, passwords.passwordrepeat);
      this.UserForm.form[1].valid = valid;
      if (valid) {
        const data = {
          token: this.token,
          password: passwords.password,
        };
        this[actionTypes.ACTION_CHANGE_PASSWORD](data);
      }
    },

    SubmitForm(this: This, e: Event) {
      e.preventDefault();
      if (this.UserForm.caption === this.EmailForm.caption) {
        this.SendEmail();
      } else {
        this.ResetPassword();
      }
    },
  },

  created(this: This) {
    this.token = this.$route.query.token ? `${this.$route.query.token}` : "";
    this.UserForm = this.token ? this.PasswordForm : this.EmailForm;
  },
});
</script>
