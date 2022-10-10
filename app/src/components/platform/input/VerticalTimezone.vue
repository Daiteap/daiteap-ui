<template>
  <b-container fluid>
    <b-row class="my-1 mb-4">
      <Label :inputId="inputId" :inputLabel="inputLabel" />
      <b-col sm="12">

        <div class="input-group col" style="padding: 0">
        <b-form-select
          :id="inputId"
          :type="inputType"
          @input="$emit('input', $event)"
          @change="$emit('change', $event)"
          :value="value"
        >
          <option
            v-for="zone in timezones"
            v-show="showInSerchResults(zone.offset + zone.name)"
            :key="zone.name"
            :value="zone.name"
          >
            {{ zone.offset + "   " + zone.name }}
          </option>
        </b-form-select>
        <b-form-input
          v-model="$parent.searchQuery"
          type="text"
          placeholder="Search"
          class="d-block w-25 pl-2 searchField"
        />
      </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import Label from "@/components/platform/input/Label";
export default {
  name: 'VerticalTimezone',
  components: {
    Label,
  },
  methods: {
    showInSerchResults(zone) {
      if (zone.toUpperCase().includes(this.$parent.searchQuery.toUpperCase())) {
        return true;
      } else if (this.$parent.searchQuery.length > 0) {
        return false;
      } else {
        return true;
      }
    },
  },
  props: {
    inputLabel: String,
    inputId: String,
    inputType: String,
    validation: Object,
    errorMsg: String,
    value: String,
    disabled: Boolean,
    timezones: Array
  },
};
</script>