<template>
      <div>
        <span class="alert p-0 m-0">{{ error }}</span>
      </div>
</template>

<script>
export default {
  name: 'Error',
  props: {
    error: String
  }
}
</script>

<style scoped>
.alert {
  font-size: 12px;
  color: #ed1c24;
}
</style>