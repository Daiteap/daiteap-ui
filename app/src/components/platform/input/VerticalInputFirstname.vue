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
        <div class="help text-danger" v-if="$v.value.$invalid && value != '' && !disabled">
          {{ errorMsg }}
        </div>
    </b-row>
  </b-container>
</template>

<script>
import { validationMixin } from "vuelidate";
import { maxLength, minLength, alpha } from "vuelidate/lib/validators";

export default {
  name: "VerticalInputFirstname",
  mixins: [validationMixin],
  validations: {
    value: {
      maxLength: maxLength(100),
      minLength: minLength(2),
      alpha,
    },
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