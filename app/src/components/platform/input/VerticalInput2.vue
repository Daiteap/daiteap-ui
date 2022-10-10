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
        <div v-if="validation">
        <p
          v-if="validation.$invalid && validation.$dirty && value != ''"
          class="help text-danger"
        >
          {{ errorMsg }}
        </p>
        <div v-else style="height: 1.375rem"></div>
        </div>
    </b-row>
  </b-container>
</template>

<script>
import { required } from "vuelidate/lib/validators";

export default {
  name: 'VerticalInput2',
  validations: {
    value: {
      required,
    }
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
    required: Boolean,
  },
};
</script>