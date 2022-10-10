<template>
  <div style="text-align: left;">
    <div class="field">
      <br />
      <div>
        <label for="load_balancer_integration">Load Balancer Integration</label>
      </div>
      <div class="radios" v-if="this.$finalModel.alicloudSelected">
        <span>
          <input v-model="form.load_balancer_integration" v-on:change="updateForm" type="radio" id="alicloudradio"
            name="load_balancer_integration" value="alicloud" />
          <label class="custom-label-left" for="alicloudradio">Alibaba Cloud</label>
          <br />
        </span>
      </div>
      <div class="radios" v-if="this.$finalModel.awsSelected">
        <span>
          <input v-model="form.load_balancer_integration" v-on:change="updateForm" type="radio" id="awsradio"
            name="load_balancer_integration" value="aws" />
          <label class="custom-label-left" for="awsradio">Amazon Web Services</label>
          <br />
        </span>
      </div>
      <div class="radios" v-if="this.$finalModel.azureSelected">
        <span>
          <input v-model="form.load_balancer_integration" v-on:change="updateForm" type="radio" id="azureradio"
            name="load_balancer_integration" value="azure" />
          <label class="custom-label-left" for="azureradio">Azure</label>
          <br />
        </span>
      </div>
      <div class="radios" v-if="this.$finalModel.googleSelected">
        <span>
          <input v-model="form.load_balancer_integration" v-on:change="updateForm" type="radio" id="googleradio"
            name="load_balancer_integration" value="google" />
          <label class="custom-label-left" for="googleradio">Google Cloud Platform</label>
        </span>
      </div>
    </div>
    <br />
  </div>
</template>

<script>
import { validationMixin } from "vuelidate";
import Vue from "vue";
import { required, minLength } from "vuelidate/lib/validators";

export default {
  name: "StepProvidersIntegration",
  props: ["clickedNext", "currentStep"],
  mixins: [validationMixin],
  data() {
    return {
      form: {
        load_balancer_integration: ""
      }
    };
  },
  mounted() {
    let self = this;
    self.$root.$on("clicking-back-" + Vue.prototype.$currentIndex, () =>
      self.$destroy()
    );
    this.$emit("can-continue", { value: false });
    this.updateForm();
  },
  methods: {
    updateForm() {
      Vue.prototype.$finalModel = {
        ...Vue.prototype.$finalModel,
        ...this.form
      };
    }
  },
  validations: {
    form: {
      load_balancer_integration: {
        required,
        minLength: minLength(1),
      },
    },
  },
  watch: {
    $v: {
      handler: function (val) {
        if (!val.$invalid) {
          Vue.prototype.$finalModel = {
            ...Vue.prototype.$finalModel,
            ...this.form,
          };
          this.$emit("can-continue", { value: true });
        } else {
          this.$emit("can-continue", { value: false });
          setTimeout(() => {
            this.$emit("change-next", { nextBtnValue: false });
          }, 3000);
        }
      },
      deep: true,
    },
  },
};
</script>



<style scoped>
.custom-control-lg .custom-control-label::before,
.custom-control-lg .custom-control-label::after {
  top: 0.1rem !important;
  left: -2rem !important;
  width: 1.25rem !important;
  height: 1.25rem !important;
}

.custom-control-lg .custom-control-label {
  margin-left: 0.5rem !important;
  font-size: 1rem !important;
}

input[type="radio"] {
  transform: scale(1.5);
  margin-left: 5px;
}

.custom-label-left {
  margin-left: 12px;
}

.radios>span {
  white-space: nowrap;
}
</style>