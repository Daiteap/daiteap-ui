<template>
  <b-container fluid>
    <b-row class="my-1 mb-4">
      <label> {{ inputLabel }} * </label>
        <b-form-input
          :id="inputId"
          :type="inputType"
          :placeholder="inputplaceholder"
          @input="$emit('input', $event)"
          @change="$emit('change', $event)"
          :value="value"
          :disabled="disabled"
        ></b-form-input>
        <div
          class="help text-danger"
          v-if="!$v.value.minLength || !$v.value.maxLength || !$v.value.usernameValidation && !disabled"
        >
          {{ errorMsg }}
        </div>
        <div v-else style="height: 1.375rem"></div>
    </b-row>
  </b-container>
</template>

<script>
import { validationMixin } from "vuelidate";
import {
  required,
  minLength,
  maxLength,
  helpers,
} from "vuelidate/lib/validators";

const usernameValidation = helpers.regex('usernameValidation', /^[a-z\d._-]*$/i);

export default {
  name: "ValidationInputUsername",
  mixins: [validationMixin],
  validations: {
    value: {
      required,
      minLength: minLength(3),
      maxLength: maxLength(150),
      usernameValidation,
    },
  },
  data() {
    return {
      valuecopy: "",
      usernameResolved: true,
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
  },
};
</script>