<template>
  <b-button variant="outline-success" @click="$emit('btn-action')" class="custom-btn mt-3 w-100">{{ text }}</b-button>
</template>

<script>
export default {
  name: 'Button',
  props: {
    text: String,
  }
}
</script>

<style scoped>
.custom-btn:focus {
  outline: none;
  box-shadow: none;
}
</style>