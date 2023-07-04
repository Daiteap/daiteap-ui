<template>
  <b-container fluid>
    <b-row class="my-1 mb-2">
      <label>{{ inputLabel }}</label>
        <b-form-textarea
          :id="inputId"
          :placeholder="inputplaceholder"
          @input="$emit('input', $event)"
          @change="$emit('change', $event)"
          :value="value"
          :disabled="disabled"
        ></b-form-textarea>
        <div
          class="help text-danger"
          v-if="inputId === 'ssh-key' && !v$.value.isSSHFormatCorrect"
        >
          {{ errorMsg }}
        </div>
        <div v-else style="height: 1.375rem"></div>
    </b-row>
  </b-container>
</template>

<script>
import {useVuelidate} from "@vuelidate/core";

export default {
  name: "TextAreaInput",
  validations: {
    value: {
      isSSHFormatCorrect(value) {
        if (value && value.length > 0) {
          var sshpk = require('sshpk');
          try {
            // Try to parse in OpenSSH public key format
            sshpk.parseKey(value, 'ssh');
            return true;
          } 
          catch (error) {
            return false;
          } 
        }
        return true;
      },
    },
  },
  data() {
    return {
      v$: useVuelidate(),
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