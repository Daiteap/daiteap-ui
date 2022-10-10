<template>
  <div class="pl-2">
    <div
      title="Delete credential"
      @click="$emit('removeAccount', account)"
      class="far fa-trash-alt removeAccountIcon"
      data-test-id="remove-button"
    ></div>
  </div>
</template>

<script>

export default {
  name: 'RemoveAccountButton',
  props: {
    account: Object
  }
}
</script>

<style scoped>
.removeAccountIcon {
  cursor: pointer;
  align-content: center;
  font-size: 1.5rem;
  padding-top: 0.2rem;
  color: #ea002f;
}
</style>