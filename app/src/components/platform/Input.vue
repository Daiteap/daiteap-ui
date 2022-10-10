<template>
  <input
    @input="$emit('input', $event.target.value)"
    :type="inputType"
    class="form-control px-3"
    :placeholder="placeholder"
  />
</template>

<script>

export default {
  name: 'Input',
  props: {
    inputType: String,
    placeholder: String,
  },
};
</script>

<style scoped>
.form-control {
  width: 100%;
  height: 3rem;
  border-radius: 1.5rem;
}
.form-control:focus {
  outline: none;
  box-shadow: none;
}
</style>