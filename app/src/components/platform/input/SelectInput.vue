<template>
  <b-container fluid>
    <b-row class="my-1 mb-4">
      <label> {{ inputLabel }} * </label>
        <select
          class="custom-select d-block w-100"
          v-model="selectedItem"
          id="selectItem"
          @input="$emit('input', $event.target.value)"
          @change="$emit('change', $event)"

        >
          <option v-for="op in selectoptions" :key="op.key" :value="op.value" 
          >
            {{ op.value }}
          </option>
        </select>
        <p
          v-if="validation && validation.$invalid && validation.$dirty"
          class="help text-danger"
        >
          {{ errorMsg }}
        </p>
    </b-row>
  </b-container>
</template>

<script>
export default {
  name: 'SelectInput',
  props: {
    inputLabel: String,
    inputId: String,
    inputType: String,
    inputplaceholder: String,
    validation: Object,
    errorMsg: String,
    value: String,
    disabled: Boolean,
    options: Array,
    default: String,
  },
  data() {
    return {
      selectoptions: [],
      selectedItem: "",
    }
  },
  mounted() {
    this.selectoptions = this.options;
    this.selectedItem = this.default;
  }
};
</script>