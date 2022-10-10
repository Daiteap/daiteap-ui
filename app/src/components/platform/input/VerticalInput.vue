<template>
  <b-container fluid>
    <b-row class="my-1 mb-2">
      <label>{{ inputLabel }}</label>
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
          v-if="validation.$invalid && validation.$dirty && !disabled && value != ''"
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
export default {
  name: 'VerticalInput',
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