<template>
  <div style="text-align: left;">
    <div class="field">
      <br />
    </div>
  </div>
</template>

<script>
import { validationMixin } from "vuelidate";
import Vue from "vue";

export default {
  name: 'Submit',
  props: ["clickedNext", "currentStep"],
  mixins: [validationMixin],
  mounted() {
    let self = this;
    self.$root.$on("clicking-back-" + Vue.prototype.$currentIndex, () =>
      (function() {
        self.$destroy();
      })()
    );
    self.$finalModel.internal_dns_zone = "daiteap.internal";
    Vue.prototype.$finalModel = {
      ...Vue.prototype.$finalModel,
      ...this.form
    };
    this.$emit("can-continue", { value: true });
  },

  methods: {},
  data() {
    return {
      form: {

      }
    };
  },
  validations: {
  },
};
</script>

<style scoped>
.card-header {
  background-color: #f8f9fc;
}
</style>