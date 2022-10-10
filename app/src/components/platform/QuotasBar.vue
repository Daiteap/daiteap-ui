<template>
  <div>
    <b-progress :class="progressClasses" height="2rem" class="mb-2" :max="max">
      <b-progress-bar :class="progressBarClasses" :value="used" variant="primary"><span class="">{{ text }}</span></b-progress-bar>
    </b-progress>
  </div>
</template>

<script>

export default {
  name: 'QuotasBar',
  props: {
    max: Number,
    text: String,
    used: Number,
    progressClasses: String,
    progressBarClasses: String,
  },
};
</script>

<style scoped>
.progress {
    position: relative;
}

.progress span {
    position: absolute;
    display: block;
    width: 100%;
    font-size: 1rem;
 }
</style>