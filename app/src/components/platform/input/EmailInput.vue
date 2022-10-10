<template>
  <b-container fluid>
    <b-row class="my-1 mb-4">
      <label> {{ inputLabel }} * </label>
        <b-form-input
          :id="inputId"
          :type="inputType"
          :placeholder="inputplaceholder"
          @input="$emit('input', $event);  onInput()"
          @change="$emit('change', $event)"
          v-on:change="onInput()"
          :value="value"
          :disabled="disabled"
        ></b-form-input>
        <div
          class="help text-danger"
          v-if="!$v.value.email"
        >
          {{ errorMsg }}
        </div>
        <div class="help text-danger" v-else-if="userEmail && emailResolved && !$v.value.isEmailFree && !disabled" >
          This email is already in use
        </div>
        <div v-else style="height: 1.375rem"></div>
    </b-row>
  </b-container>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, email } from "vuelidate/lib/validators";

export default {
  name: "EmailInput",
  mixins: [validationMixin],
  methods: {
    onInput() {
      console.info("onInput()");
      // this.valuecopy = this.value;
    }
  },
  validations: {
    value: {
      required,
      email,
      isEmailFree(value) {
        if (value && value.length > 0) {
            return new Promise((resolve) => {
              let self = this;
              self.emailResolved = false;
              setTimeout(() => {
                let self = this;
                let request = value;
                this.axios
                  .post("/server/isEmailFree/" + value, request, this.get_axiosConfig())
                  .then(function (response) {
                    if (response.data.email_free == true) {
                      self.emailResolved = true;
                      resolve(true);
                    } else {
                      self.emailResolved = true;
                      resolve(false);
                    }
                  })
                  .catch(function (error) {
                    console.log(error);
                    resolve(false);
                  });
              }, 300);
            });
          } else {
            return false;
          }
        },
    }
  },
  data() {
    return {
      valuecopy: "",
      emailResolved: true,
    };
  },
  props: {
    inputLabel: String,
    inputId: String,
    inputType: String,
    inputplaceholder: String,
    validation: Object,
    errorMsg: String,
    value: String,
    disabled: Boolean,
    userEmail: {
      type: Boolean,
      default: false
    },
  },
};
</script>