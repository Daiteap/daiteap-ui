<template>
  <div style="text-align: left">
    <div class="card daiteap-content-card my-0">
      Press submit to deploy your Kubernetes Cluster. It can take up to 35
      Minutes depending on your configuration.
    </div>

    <ClusterSummary
      :cluster="clusterSummary"
      class="card daiteap-content-card"
      style="border: 1px solid lightgray; padding: 30px 30px 30px 30px; border-radius: 10px;"
    />

    <div v-if="templateSaved == 'Saved' && computed_account_settings.enable_templates" class="card daiteap-content-card">
      Template successfully saved!
      <br />
      <br />
    </div>

    <div
      v-else-if="templateSaved == 'Not saved' && computed_account_settings.enable_templates"
      class="card daiteap-content-card"
      style="border: 1px solid lightgray; padding: 30px 30px 30px 30px; border-radius: 10px;"
    >
      <div>
        <CardTitle title="Save as Template" />
      </div>
      <div>
        <br />
        <b-row class="mb-3">
          <b-col sm="12">
            <label for="template-name">Template Name: * </label>
          </b-col>
          <b-col sm="6">
            <b-form-input
              v-model="form.name"
              v-on:change="$v.form.name.$touch"
              id="template-name"
              placeholder="Template Name"
            ></b-form-input>
            <p
              v-if="
                form.name != '' &&
                !$v.form.name.maxLength &&
                $v.form.name.$dirty
              "
              class="help text-danger"
              style="height: 1.2rem"
            >
              Invalid template name
            </p>
            <p
              v-else-if="
                form.name != '' &&
                templateNameResolved &&
                !$v.form.name.isNameFree
              "
              class="help text-danger"
              style="height: 1.2rem"
            >
              {{ templateNameTakenMsg }}
            </p>
            <div v-else style="height: 1.2rem"></div>
          </b-col>
        </b-row>
        <b-row class="mb-3">
          <b-col sm="12">
            <label for="template-description">Template Description:</label>
          </b-col>
          <b-col sm="6">
            <b-form-textarea
              id="template-description"
              placeholder="Template Description"
              v-on:change="$v.form.description.$touch"
              v-model="form.description"
            ></b-form-textarea>
            <p
              v-if="$v.form.description.$invalid && $v.form.description.$dirty"
              class="help text-danger"
            >
              Invalid template description
            </p>
          </b-col>
        </b-row>
        <b-row>
          <b-col sm="6">
            <div
              class="custom-button float-right"
              :class="[$v.form.$invalid ? 'deactivated' : '']"
              @click="onSave()"
            >
              Save
            </div>
          </b-col>
        </b-row>
      </div>
    </div>
  </div>
</template>

<script>
import CardTitle from "@/components/platform/CardTitle";
import ClusterSummary from "@/components/platform/steps/ClusterSummary";
/*eslint no-unused-vars:*/
import Vue from "vue";
import { required, maxLength } from "vuelidate/lib/validators";
import { validationMixin } from "vuelidate";

export default {
  name: "StepK3sSubmit",
  mixins: [validationMixin],
  components: {
    CardTitle,
    ClusterSummary,
  },
  props: ["clickedNext", "currentStep"],
  methods: {
    showAlert(msg) {
      console.info(msg);
      this.$notify({
        group: "msg",
        type: "error",
        title: "Notification:",
        text: msg,
      });
    },
    onCancel() {
      this.templateSaved = "Canceled";
    },
    onSave() {
      let self = this;
      var request = this.$finalModel;
      self.templateSaved = "Saved";

      request.type = this.computed_create_cluster_settings.cluster_type_number;
      request.name = this.form.name;
      request.description = this.form.description

      this.axios
        .post(
          "/server/tenants/" +
            this.computed_active_tenant_id +
            "/environment-templates",
          request,
          this.get_axiosConfig()
        )
        .then(function () {
          self.templateSaved = "Saved";
        })
        .catch(function (error) {
          // eslint-disable-next-line no-console
          console.log(error);
          self.errorMsg = error;
          if (error.response && error.response.status == "403") {
            self.$notify({
              group: "msg",
              type: "error",
              title: "Notification:",
              text: "Access Denied",
            });
          } else {
            self.showAlert(error);
          }
        });
    },
  },
  data() {
    return {
      templateSaved: "Not saved",
      form: {
        name: "",
        description: "",
      },
      loading: true,
      urlTFGraph: "",
      planKubernetesResources: {},
      error: false,
      errorMsg: "",
      interval: {},
      configurationProblem: false,
      configurationProblemResponse: {},
      gettaskmessageErrorCount: 0,
      clusterSummary: {},
      templateNameResolved: true,
      templateNameTakenMsg: "This template name is taken",
    };
  },
  validations: {
    form: {
      name: {
        required,
        maxLength: maxLength(1024),
        isNameFree(value) {
          if (value.length > 0) {
            if (this.projectParams) {
              if (value == this.projectParams.Name) {
                return true;
              }
            }
            return new Promise((resolve) => {
              let self = this;
              self.templateNameResolved = false;
              self.templateNameTakenMsg = "";
              setTimeout(() => {
                let self = this;
                this.axios
                  .get(
                    "/server/tenants/" +
                      this.computed_active_tenant_id +
                      "/environment-templates/name-available/" +
                      value,
                    this.get_axiosConfig()
                  )
                  .then(function (response) {
                    if (response.data.free == true) {
                      self.templateNameResolved = true;
                      self.templateNameTakenMsg = "";
                      resolve(true);
                    } else {
                      self.templateNameResolved = true;
                      self.templateNameTakenMsg = "This template name is taken";
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
              }, 350);
            });
          } else {
            return false;
          }
        },
      },
      description: {
        maxLength: maxLength(1024),
      },
    },
  },
  beforeCreate() {
    this.$emit("can-continue", { value: true });
  },
  mounted() {
    let self = this;
    window.intervals = [];
    self.$root.$on("clicking-back-" + Vue.prototype.$currentIndex, () =>
      self.$destroy()
    );
    self.$finalModel.internal_dns_zone = "daiteap.internal";

    this.clusterSummary = this.$finalModel;
    this.clusterSummary.type = this.computed_create_cluster_settings.cluster_type_number;
    this.clusterSummary.resize = false;
  },
  destroyed() {
    clearInterval(this.interval);
    for (let i = 0; i < window.intervals.length; i++) {
      clearInterval(window.intervals[i]);
    }
    this.gettaskmessageErrorCount = 0;
  },
};
</script>

<style scoped>
.cardHeaderLight {
  background-color: #fff;
  color: #1d1e22;
  border-bottom: #eaebed 2px solid;
  border: #d1d1d1 1px solid;
}
.card-body {
  border: #00708c10 1px solid;
}
</style>