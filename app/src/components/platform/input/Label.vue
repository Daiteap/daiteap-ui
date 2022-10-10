<template>
  <b-col sm="12" class="m-auto">
    <label class="m-auto" :for="inputId"> {{ inputLabel }}</label>
  </b-col>
</template>

<script>
export default {
  name: 'Label',
  props: {
    inputLabel: String,
    inputId: String
  },
}
</script>