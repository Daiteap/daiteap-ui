<template>
  <div style=" text-align: left;">
    <TextPopup v-show="showTextPopup" :textPopupParams="textPopupParams"></TextPopup>
    <div class="field">
      <div class="control" id="serviceName">
        <label class="control-label">Name</label>
        <input
          class="form-control"
          type="text"
          v-bind:placeholder="defaultName"
          v-model="$parent.$parent.form.name"
        />
      </div>
      <div class="control" id="serviceNamespace">
        <label class="control-label">Namespace</label>
        <input
          class="form-control"
          type="text"
          placeholder="default"
          v-model="$parent.$parent.form.namespace"
        />
      </div>
      <br />
      <label class="control-label">
        <b>Values file &nbsp;&nbsp;</b>
      </label>
      <input type="file" ref="valuesFile" v-on:change="selectedValuesFile" />
      <span
        class="btn btn-primary float-sm-right"
        v-on:click="showValues()"
      >
        <i class="fas fa-question"></i>
      </span>
      <div>
        <textarea
          class="form-control"
          rows="20"
          v-on:change="$v.form.valuesFile.$touch"
          v-model="form.valuesFile"
        ></textarea>
      </div>
    </div>
  </div>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";
import Vue from "vue";
import axios from "axios";
import TextPopup from "../popup_modals/TextPopup";

export default {
  name: 'AdvancedConfig',
  props: ["clickedNext", "currentStep"],
  mixins: [validationMixin],
  created() {
    // this.getValues(this);
    // this.setDefaultName(this);
  },
  mounted() {
    let self = this;
    self.$root.$on("clicking-back-" + Vue.prototype.$currentIndex, () =>
      (function() {
        self.$destroy();
      })()
    );
  },
  methods: {
    selectedValuesFile() {
      let file = this.$refs.valuesFile.files[0];
      let reader = new FileReader();
      reader.readAsText(file, "UTF-8");
      reader.onload = evt => {
        this.$parent.form.valuesFile = evt.target.result;
      };
      reader.onerror = evt => {
        console.error(evt);
      };
    },
    showValues() {
      this.showTextPopup = true;
      this.$bvModal.show("bv-modal-textpopup");
    },
    setDefaultName(currentObject) {
      let self = currentObject;
      axios
        .post("/server/generateClusterServiceDefaultName", 
        {
          "service": self.$finalModel.serviceName,
          "clusterID": self.$parent.$parent.clusterID
        }, this.get_axiosConfig())
        .then(function(response) {
          self.defaultName = response.data.defaultName;
          self.form.name = response.data.defaultName;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    getValues() {
      let self = this;
      axios
        .post("/server/getServiceValues", 
        {
          service: self.$finalModel.serviceName, 
        }, this.get_axiosConfig())
        .then(function(response) {
          self.textPopupParams.text = response.data.values;
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  },
  data() {
    return {
      defaultName: "name",
      showTextPopup: false,
      textPopupParams: {
        heading: "Values",
        text: ""
      },
      form: {
        name: "",
        namespace: "default",
        valuesFile: ""
      }
    };
  },
  validations: {
    form: {
      valuesFile: {
        required
      }
    }
  },
  components: {
    TextPopup,
  },
  watch: {
    $v: {
      handler: function(val) {
        if (!val.$invalid) {
          Vue.prototype.$finalModel = {
            ...Vue.prototype.$finalModel,
            ...this.form
          };
          this.$emit("can-continue", { value: true });
        } else {
          this.$emit("can-continue", { value: false });
          setTimeout(() => {
            this.$emit("change-next", { nextBtnValue: false });
          }, 3000);
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
.btn-primary {
  margin-bottom: 15px;
}
</style>