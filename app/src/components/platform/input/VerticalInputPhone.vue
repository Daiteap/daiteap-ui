<template>
  <b-container fluid>
    <b-row class="my-1 mb-4">
      <label> {{ inputLabel }} </label>
        <b-form-input
          :id="inputId"
          :type="inputType"
          :placeholder="inputplaceholder"
          @input="$emit('input', $event)"
          @change="$emit('change', $event)"
          :value="value"
          :disabled="disabled"
        ></b-form-input>
        <p class="help text-danger" v-if="$v.value.$invalid && !disabled">
          {{ errorMsg }}
        </p>
        <div v-else style="height: 1.375rem"></div>
    </b-row>
  </b-container>
</template>

<script>
import { validationMixin } from "vuelidate";
import { helpers } from "vuelidate/lib/validators";

const regPhone = helpers.regex('regPhone',/^[\s0-9-+()]*$/)

export default {
  name: "VerticalInputPhone",
  mixins: [validationMixin],
  validations: {
    value: {
      regPhone
    }
  },
  data() {
    return {
      valuecopy: "",
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