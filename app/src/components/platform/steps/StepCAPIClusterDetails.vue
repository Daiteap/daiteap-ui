<template>
  <div style="text-align: left">
    <div class="field">
      <div class="columns">
        <div>
          <label for="selectProject">Select Project</label>
        </div>
        <select
          class="custom-select d-block w-100"
          v-model="$parent.$parent.$parent.selectedProject"
          id="selectProject"
        >
          <option
            v-for="item in $parent.$parent.$parent.projectsList"
            :key="item.ID"
            :value="item.ID"
          >
            {{ item.Name }}
          </option>
        </select>
      </div>
      <div
        v-if="computed_account_settings.enable_templates"
        class="control my-3"
        id="clusterType"
      >
        <div>
          <label>Installation type:</label>
        </div>
        <select
          class="custom-select d-block w-100"
          v-model="$parent.$parent.$parent.installationType"
          id="selectType"
          @change="$parent.$parent.$parent.onChangeInstallationType()"
        >
          <option>manually</option>
          <option v-if="$parent.$parent.$parent.templateNamesList.length > 0">
            from template
          </option>
        </select>
      </div>

      <div
        v-if="$parent.$parent.$parent.installationType == 'manually'"
        class="control my-3"
        id="clusterType"
      ></div>
      <div v-else class="control my-3" id="clusterType">
        <div>
          <label>Select Template</label>
        </div>
        <select
          class="custom-select d-block w-100"
          v-model="$parent.$parent.$parent.selectedTemplateId"
          id="selectTemplate"
          @change="
            $parent.$parent.$parent.openModalCreateEnvironmentFromTemplate()
          "
        >
          <option
            v-for="item in $parent.$parent.$parent.templateNamesList"
            :key="item.id"
            :value="item.id"
          >
            {{ item.name }}
          </option>
        </select>
      </div>

      <div class="control" id="clusterName">
        <div>
          <label> Cluster Name: * </label>
        </div>
        <input
          class="form-control"
          :class="[
            'input',
            $v.form.clusterName.$invalid && $v.form.clusterName.$dirty
              ? 'is-danger'
              : '',
          ]"
          type="text"
          placeholder="Cluster name"
          v-model="form.clusterName"
          @input="$v.form.clusterName.$touch"
          @focus="nameFocus = true"
          @blur="nameFocus = false"
          @change="changeClusterName()"
        />
        <p
          v-if="form.clusterName != '' && !$v.form.clusterName.maxLength && $v.form.clusterName.$dirty"
          class="help text-danger" style="height: 1.2rem"
        >
          Invalid cluster name
        </p>
        <p
          v-else-if="form.clusterName != '' && clusterNameResolved && !$v.form.clusterName.isNameFree"
          class="help text-danger" style="height: 1.2rem"
        >
          {{ clusterNameTakenMsg }}
        </p>
        <div v-else style="height: 1.2rem"></div>
      </div>

      <div class="control" id="clusterName">
        <div>
          <label>Description:</label>
        </div>
        <input
          class="form-control"
          :class="[
            'input',
            $v.form.clusterDescription.$invalid &&
            $v.form.clusterDescription.$dirty
              ? 'is-danger'
              : '',
          ]"
          type="text"
          placeholder="Description"
          v-model="form.clusterDescription"
          @input="$v.form.clusterDescription.$touch"
          @change="changeClusterDescription()"
        />
        <p
          v-if="
            $v.form.clusterDescription.$invalid &&
            $v.form.clusterDescription.$dirty
          "
          class="help text-danger"
        >
          Invalid cluster description
        </p>
      </div>

      <br />
      <br />

      <div class="text-right">
        <span class="pointer" @click="changeShowAdvanced()"
          >Advanced options
          <i
            v-show="!computed_create_cluster_settings.show_advanced"
            class="fas fa-angle-right"
            >...</i
          >
          <i
            v-show="computed_create_cluster_settings.show_advanced"
            class="fas fa-angle-down"
          ></i>
        </span>

        <div class="text-left">
          <b-collapse
            id="advanced"
            :visible="computed_create_cluster_settings.show_advanced"
            class="mt-2"
          >
            <div
              v-if="$parent.$parent.$parent.installationType == 'manually'"
              class="control my-3"
              id="clusterType"
            >
              <br v-if="$parent.$parent.$parent.kubernetesClusterType.length > 1" />
              <div
                v-if="$parent.$parent.$parent.kubernetesClusterType.length > 1"
              >
                <label>Type</label>
              </div>
              <select
                class="custom-select d-block w-100"
                v-model="$parent.$parent.$parent.selectedType"
                id="selectType"
                @change="$parent.$parent.$parent.onTypeChange()"
                v-if="$parent.$parent.$parent.kubernetesClusterType.length > 1"
              >
                <option
                  v-for="item in $parent.$parent.$parent.kubernetesClusterType"
                  :key="item"
                  :value="item"
                >
                  {{ item }}
                </option>
              </select>
            </div>

            <div class="control" id="clusterName">
              <br />
              <div>
                <label>Kubernetes version</label>
              </div>
              <select
                v-model="form.kubernetesConfiguration.version"
                class="custom-select d-block w-100"
                id="account"
                v-if="!loadingKubernetesConfigurations"
              >
                <option
                  v-for="item in supportedKubernetesVersions"
                  :key="item"
                  :value="item"
                >
                  {{ item }}
                </option>
              </select>
              <div v-else class="text-center">
                <div
                  class="spinner-border text-primary"
                  style="color: #eaebed !important"
                  role="status"
                >
                  <span class="sr-only">Loading...</span>
                </div>
              </div>
            </div>
          </b-collapse>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, maxLength } from "vuelidate/lib/validators";
import Vue from "vue";
import axios from "axios";

export default {
  name: "StepCAPIClusterDetails",
  props: ["clickedNext", "currentStep"],
  mixins: [validationMixin],
  data() {
    return {
      form: {
        clusterName: "",
        clusterDescription: "",
        kubernetesConfiguration: {
          version: "",
        },
      },
      loadingKubernetesConfigurations: true,
      clusterNameResolved: true,
      clusterNameTakenMsg: "This cluster name is taken",
    };
  },
  validations: {
    form: {
      clusterName: {
        required,
        maxLength: maxLength(1024),
        isNameFree(value) {
          if (value.length > 0) {
            return new Promise((resolve) => {
              let self = this;
              self.clusterNameResolved = false;
              self.clusterNameTakenMsg = "";
              setTimeout(() => {
                let self = this;
                this.axios
                  .get(
                    "/server/tenants/" +
                      this.computed_active_tenant_id +
                      "/clusters/cluster-name-available/" +
                      value,
                    this.get_axiosConfig()
                  )
                  .then(function (response) {
                    if (response.data.free == true) {
                      self.clusterNameResolved = true;
                      self.clusterNameTakenMsg = "";
                      resolve(true);
                    } else {
                      self.clusterNameResolved = true;
                      self.clusterNameTakenMsg = "This cluster name is taken";
                      resolve(false);
                    }
                  })
                  .catch(function (error) {
                    console.log(error);
                    if (error.response && error.response.status == "403") {
                      self.$notify({
                        group: "msg",
                        type: "error",
                        title: "Notification:",
                        text: "Access Denied",
                      });
                    }
                    resolve(false);
                  });
              }, 0);
            });
          } else {
            return false;
          }
        },
      },
      clusterDescription: {
        maxLength: maxLength(1024),
      },
    },
  },
  methods: {
    checkCanContinue() {
      if (!this.$v.$invalid) {
        Vue.prototype.$finalModel = {
          ...Vue.prototype.$finalModel,
          ...this.form,
        };
        this.$emit("can-continue", { value: true });
      } else {
        this.$emit("can-continue", { value: false });
      }
    },
    getKubernetesConfigurations() {
      let self = this;
      self.loadingKubernetesConfigurations = true;
      axios
        .get(
          "/server/clusters/capi-supported-configurations",
          this.get_axiosConfig()
        )
        .then(function (response) {
          self.supportedKubernetesVersions =
            response.data.supportedKubernetesVersions;
          self.form.kubernetesConfiguration.version =
            response.data.supportedKubernetesVersions[0];
          self.loadingKubernetesConfigurations = false;
        })
        .catch(function (error) {
          self.errorMsg = error;
          console.log(error);
        });
    },
    changeShowAdvanced() {
      this.$store.commit(
        "updateCreateClusterSettingsShowAdvanced",
        !this.computed_create_cluster_settings.show_advanced
      );
    },
    changeClusterName() {
      this.$store.commit(
        "updateCreateClusterSettingsClusterName",
        this.form.clusterName
      );
    },
    changeClusterDescription() {
      this.$store.commit(
        "updateCreateClusterSettingsClusterDescription",
        this.form.clusterDescription
      );
    },
    getClusterNameAndDescription() {
      this.form.clusterName =
        this.computed_create_cluster_settings.cluster_name;
      this.form.clusterDescription =
        this.computed_create_cluster_settings.cluster_description;
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
    clickedNext(val) {
      if (val === true) {
        this.$v.form.$touch();
      }
    },
  },
  created() {
    this.getClusterNameAndDescription();
    this.getKubernetesConfigurations();
  },
  mounted() {
    if (!this.$v.$invalid) {
      Vue.prototype.$finalModel = {
        ...Vue.prototype.$finalModel,
        ...this.form,
      };
      this.$emit("can-continue", { value: true });
    } else {
      this.$emit("can-continue", { value: false });
    }
  },
};
</script>


<style scoped>
#errorMsg {
  max-height: 15rem;
}
.pointer {
  cursor: pointer;
}
</style>
