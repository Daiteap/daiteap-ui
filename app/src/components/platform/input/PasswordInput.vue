<template>
  <b-container fluid>
    <b-row>
      <Label :inputId="inputId" :inputLabel="inputLabel + ' * '" />
      <b-col sm="12">
        <b-form-input
          :id="inputId"
          :type="inputType"
          :placeholder="inputplaceholder"
          @input="$emit('input', $event)"
          @change="$emit('change', $event)"
          :value="value"
          :disabled="disabled"
        ></b-form-input>
      </b-col>
    </b-row>
    <b-row class="my-1 mb-4" v-if="!confirmPassword">
      <b-col sm="3" class="m-auto" />
      <b-col sm="12">
        <div class="help text-danger" v-if="value != '' && $v.value.$invalid">
          {{ errorMsg }}
        </div>
        <div v-else style="height: 1.375rem"></div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { validationMixin } from "vuelidate";
import Label from "@/components/platform/input/Label";
import { required, minLength, maxLength } from "vuelidate/lib/validators";

export default {
  name: "PasswordInput",
  mixins: [validationMixin],
  components: {
    Label,
  },
  methods: {
  },
  validations: {
    value: {
      required,
      minLength: minLength(8),
      maxLength: maxLength(150),
      valid: function(value) {
        const containsUppercase = /[A-Z]/.test(value)
        const containsLowercase = /[a-z]/.test(value)
        const containsNumber = /[0-9]/.test(value)
        const containsSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value)
        return containsUppercase && containsLowercase && containsNumber && containsSpecial
      }
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
    confirmPassword: {
      type: Boolean,
      default: false
    },
  },
};
</script>