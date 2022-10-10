<template>
  <div style="text-align: left;">
    <div class="field">
      <br />
      <div class="radios">
        <span class="card-header custom-control custom-radio">
          <input
            v-model="form.configurationType"
            v-on:change="updateForm"
            type="radio"
            id="simpleConfigradio"
            name="configurationType"
            value="simpleConfig"
            class="custom-control-input"
          />
          <label class="custom-control-label" for="simpleConfigradio">Simple configuration</label>
          <br />
        </span>
      </div>
      <div class="radios">
        <span class="card-header custom-control custom-radio">
          <input
            v-model="form.configurationType"
            v-on:change="updateForm"
            type="radio"
            id="advancedConfigradio"
            name="configurationType"
            value="advancedConfig"
            class="custom-control-input"
          />
          <label class="custom-control-label" for="advancedConfigradio">Advanced configuration</label>
          <br />
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";
import Vue from "vue";

export default {
  name: 'ChooseConfigurationType',
  props: ["clickedNext", "currentStep"],
  mixins: [validationMixin],
  mounted() {
    let self = this;
    self.$root.$on("clicking-back-" + Vue.prototype.$currentIndex, () =>
      (function() {
        self.$destroy();
      })()
    );
  },

  methods: {
    updateForm() {
      Vue.prototype.$finalModel = {
        ...Vue.prototype.$finalModel,
        ...this.form
      };
    }
  },
  data() {
    return {
      form: {
        configurationType: "" 
      }
    };
  },
  validations: {
    form: {
      configurationType: {
        required
      }
    }
  },

  watch: {
    $v: {
      handler: function() {
        this.$root.$emit(
          "updateSteps",
          this.form.configurationType
        );
        if (
          this.form.configurationType == ""
        ) {
          this.$emit("can-continue", { value: false });
          setTimeout(() => {
            this.$emit("change-next", { nextBtnValue: false });
          }, 3000);
        } else {
          delete Vue.prototype.$finalModel.SimpleConfig;
          delete Vue.prototype.$finalModel.AdvancedConfig;
          Vue.prototype.$finalModel = {
            ...Vue.prototype.$finalModel,
            ...this.form
          };
          this.$emit("can-continue", { value: true });
        }
      },
      deep: true
    }
  },
  beforeMount() {}
};
</script>

<style scoped>
.card-header {
  background-color: #f8f9fc;
}
</style>