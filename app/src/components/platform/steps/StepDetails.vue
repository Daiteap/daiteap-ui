<template>
  <div style="text-align: left">
    <div class="field">
      <div class="columns">
        <div>
          <label for="selectProject">Select Project</label>
        </div>
        <select
          class="custom-select d-block w-100"
          v-model="computed_create_cluster_settings.selected_project"
          id="selectProject"
          @change="updateCreateClusterSetting('SelectedProject', $event.target.value)"
        >
          <option
            v-for="item in computed_create_cluster_settings.projects"
            :key="item.ID"
            :value="item.ID"
          >
            {{ item.Name }}
          </option>
        </select>
      </div>
      <br />
      <div v-if="installationType == 'manually'" class="control" id="clusterName">
        <div>
          <label> Compute Name: * </label>
        </div>
        <input class="form-control" :class="[
          'input',
          $v.form.clusterName.$invalid && $v.form.clusterName.$dirty
            ? 'is-danger'
            : '',
        ]" type="text" placeholder="Compute name" v-model="form.clusterName" @input="$v.form.clusterName.$touch"
          @change="updateCreateClusterSetting('ClusterName', form.clusterName)" />
        <p v-if="form.clusterName != '' && !$v.form.clusterName.maxLength && $v.form.clusterName.$dirty"
          class="help text-danger" style="height: 1.2rem">
          Invalid compute name
        </p>
        <p v-else-if="form.clusterName != '' && clusterNameResolved && !$v.form.clusterName.isNameFree"
          class="help text-danger" style="height: 1.2rem">
          {{ clusterNameTakenMsg }}
        </p>
        <div v-else style="height: 1.2rem"></div>

        <div>
          <label>Description:</label>
        </div>
        <b-form-textarea
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
          @change="updateCreateClusterSetting('ClusterDescription', form.clusterDescription)"
        ></b-form-textarea>
        <p
          v-if="
            $v.form.clusterDescription.$invalid &&
            $v.form.clusterDescription.$dirty
          "
          class="help text-danger"
        >
          Invalid cluster description
        </p>

        <br />
      </div>

      <div v-if="computed_account_settings.enable_templates" class="control">
        <div>
          <label>Installation type:</label>
        </div>
        <select
          class="custom-select d-block w-100"
          v-model="installationType"
          id="selectType"
          @change="onChangeInstallationType()"
        >
          <option>manually</option>
          <option v-if="templateNamesList.length > 0">from template</option>
        </select>
      </div>

      <div
        v-if="installationType != 'manually'"
        class="control my-3"
        id="clusterType"
      >
        <div>
          <label>Select Template</label>
        </div>
        <select
          class="custom-select d-block w-100"
          v-model="selectedTemplateId"
          id="selectTemplate"
          @change="openModalCreateEnvironmentFromTemplate()"
        >
          <option
            v-for="item in templateNamesList"
            :key="item.id"
            :value="item.id"
          >
            {{ item.name }}
          </option>
        </select>
      </div>

      <CreateEnvironmentFromTemplate
        v-if="showCreateEnvironmentFromTemplate"
        ref="newEnvfromTemplate"
        :projectId="computed_create_cluster_settings.selected_project"
      ></CreateEnvironmentFromTemplate>
    </div>
  </div>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, maxLength } from "vuelidate/lib/validators";
import Vue from "vue";
import CreateEnvironmentFromTemplate from "../CreateEnvironmentFromTemplate";

export default {
  name: "StepDetails",
  components: {
    CreateEnvironmentFromTemplate,
  },
  props: ["clickedNext", "currentStep"],
  mixins: [validationMixin],
  data() {
    return {
      form: {
        clusterName: "",
        clusterDescription: "",
      },
      nameFocus: false,
      templateNamesList: [],
      installationType: "manually",
      selectedTemplateId: "",
      showCreateEnvironmentFromTemplate: false,
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
                      "/clusters/compute-name-available/" +
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
                      self.clusterNameTakenMsg = "This compute name is taken";
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
  mounted() {
    if (!this.$v.$invalid) {
      this.$emit("can-continue", { value: true });
    } else {
      this.$emit("can-continue", { value: false });
    }

    this.getTemplatesList(false);
  },
  methods: {
    async getTemplatesList(openModal) {
      let self = this;
      let templates = await this.getTemplates();

      self.templateNamesList = templates.filter(
        (template) => template.type == 2 || template.type == 6
      );

      if (self.templateNamesList.length > 0) {
        self.selectedTemplateId = self.templateNamesList[0].id;

        if (openModal) {
          self.openModalCreateEnvironmentFromTemplate();
        }
      }
    },
    onChangeInstallationType() {
      if (this.installationType == "from template") {
        this.getTemplatesList(true);
        this.showCreateEnvironmentFromTemplate = true;
      } else {
        this.showCreateEnvironmentFromTemplate = false;
      }
      if (this.$refs.newEnvfromTemplate) {
        this.$refs.newEnvfromTemplate = undefined;
      }

      setTimeout(() => {
        this.$emit("changeStepperVisibility");
      }, 400);
    },
    openModalCreateEnvironmentFromTemplate() {
      let self = this;
      let selectedTemplate = self.templateNamesList.filter(
        (el) => el.id == self.selectedTemplateId
      )[0];
      this.$refs.newEnvfromTemplate.initiateCreateEnvFromTemplate(
        selectedTemplate.name,
        self.selectedProject,
        selectedTemplate.id
      );
    },
  },
};
</script>

<style scoped>
#clusterName {
  margin: 0 auto;
}
</style>