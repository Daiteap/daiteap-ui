<template>
  <div class="card daiteap-content-card">
    <QuotaExceededModal
      v-show="showQuotaExceeded"
      :exceededResources="exceededResources"
    ></QuotaExceededModal>
    <h3 class="d-flex">Create Compute (VM)</h3>
    <hr />
    <div v-if="showClusterDetails">
    </div>
    <div class="columns">
      <div class="column is-11 is-offset-0">
        <horizontal-stepper
          :steps="clusterSteps"
          @completed-step="completeStep"
          :top-buttons="true"
          @active-step="isStepActive"
          @stepper-finished="submitCluster"
        ></horizontal-stepper>
      </div>
    </div>
  </div>
</template>

<script>
import QuotaExceededModal from "@/components/platform/popup_modals/QuotaExceededModal";
import HorizontalStepper from "./HorizontalStepper";
import Vue from "vue";

import StepDetails from "./steps/StepDetails.vue";
import StepProviders from "./steps/StepProviders.vue";
import StepAlicloud from "./steps/StepAlicloud.vue";
import StepAWS from "./steps/StepAWS.vue";
import StepAzure from "./steps/StepAzure.vue";
import StepGoogle from "./steps/StepGoogle.vue";
import StepOpenstack from "./steps/StepOpenstack.vue";
import StepOnpremise from "./steps/StepOnpremise.vue";
import StepVMsSubmit from "./steps/StepVMsSubmit.vue";

export default {
  name: "CreateVMs",
  components: {
    QuotaExceededModal,
    HorizontalStepper,
  },
  data() {
    return {
      showClusterDetails: true,
      projectsList: [],
      clusterSteps: [
        {
          icon: "text_fields",
          name: "details",
          title: "Compute Details",
          subtitle: "",
          component: StepDetails,
          completed: false,
        },
        {
          icon: "cloud_circle",
          name: "providers",
          title: "Select Providers",
          subtitle: "",
          component: StepProviders,
          completed: false,
        },
        {
          icon: "announcement",
          name: "submit",
          title: "Submit",
          subtitle: "",
          component: StepVMsSubmit,
          completed: false,
        },
      ],
      activeStep: 0,
      showQuotaExceeded: false,
      errorMsg: "",
      exceededResources: [],
    };
  },
  props: {
    projectID: String,
  },
  mounted() {
    let self = this;

    this.updateCreateClusterSetting("ClusterType", "Compute");

    Vue.prototype.$finalModel = {};

    this.getUsersProjectsList();

    this.axios
      .get(
        "/server/tenants/" +
          this.computed_active_tenant_id +
          "/cloud-credentials/check-provided-credentials",
        this.get_axiosConfig()
      )
      .then(function (response) {
        if (
          response.data.alicloud_key_provided == false &&
          response.data.aws_key_provided == false &&
          response.data.azure_key_provided == false &&
          response.data.google_key_provided == false &&
          response.data.openstack_key_provided == false
        ) {
          self.$notify({
            group: "msg",
            type: "error",
            title: "Notification:",
            text: "Please provide credentials for at least one cloud provider",
          });
          self.$router.push("/app/platform/ProjectList");
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
        } else {
          self.$notify({
            group: "msg",
            type: "error",
            title: "Notification:",
            text: "Error while getting user information!",
          });
        }
      });

    this.$root.$on(
      "updateSteps",
      (alicloud, aws, azure, gcp, openstack, onpremise) => {
        this.clusterSteps = this.clusterSteps.filter(function (el) {
          return (
            el.name != "alicloud" &&
            el.name != "aws" &&
            el.name != "azure" &&
            el.name != "gcp" &&
            el.name != "openstack" &&
            el.name != "onpremise"
          );
        });

        if (alicloud) {
          this.clusterSteps.splice(this.clusterSteps.length - 1, 0, {
            icon: "dehaze",
            name: "alicloud",
            title: "Alibaba Cloud",
            subtitle: "",
            component: StepAlicloud,
            completed: false,
          });
        }

        if (aws) {
          this.clusterSteps.splice(this.clusterSteps.length - 1, 0, {
            icon: "dehaze",
            name: "aws",
            title: "Amazon Web Services Details",
            subtitle: "",
            component: StepAWS,
            completed: false,
          });
        }

        if (azure) {
          this.clusterSteps.splice(this.clusterSteps.length - 1, 0, {
            icon: "dehaze",
            name: "azure",
            title: "Azure Details",
            subtitle: "",
            component: StepAzure,
            completed: false,
          });
        }

        if (gcp) {
          this.clusterSteps.splice(this.clusterSteps.length - 1, 0, {
            icon: "dehaze",
            name: "gcp",
            title: "Google Cloud Platform Details",
            subtitle: "",
            component: StepGoogle,
            completed: false,
          });
        }

        if (openstack) {
          if(this.computed_theme == "daiteap") {
            this.clusterSteps.splice(this.clusterSteps.length - 1, 0, {
              icon: "dehaze",
              name: "openstack",
              title: "OpenStack Details",
              subtitle: "",
              component: StepOpenstack,
              completed: false,
            });
          }
        }

        if (onpremise) {
          this.clusterSteps.splice(this.clusterSteps.length - 1, 0, {
            icon: "dehaze",
            name: "onpremise",
            title: "On-Premise Network Details",
            subtitle: "",
            component: StepOnpremise,
            completed: false,
          });
        }
      }
    );
  },
  computed: {},
  methods: {
    async getUsersProjectsList() {
      let self = this;
      let projects = await this.getProjects();

      self.projectsList = [];
      for (let i = 0; i < projects.length; i++) {
        self.projectsList[i] = {
          Name: "",
          Status: "",
          ID: "",
        };
        self.projectsList[i].Name = projects[i].name;
        self.projectsList[i].Description = projects[i].description;
        self.projectsList[i].Contact = projects[i].contact;
        self.projectsList[i].ID = projects[i].id;
        self.projectsList[i].CreatedAt = new Date(projects[i].created_at);
      }

      self.projectsList.sort(function (a, b) {
        return a.CreatedAt - b.CreatedAt;
      });

      let options = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      };
      for (let i = 0; i < self.projectsList.length; i++) {
        self.projectsList[i].CreatedAt = self.projectsList[
          i
        ].CreatedAt.toLocaleString("en-US", options);
      }
      self.loading = false;

      if (
        self.projectsList.filter((el) => el.ID == self.projectID).length > 0
      ) {
        self.updateCreateClusterSetting('SelectedProject', self.projectID);
      } else {
        self.updateCreateClusterSetting('SelectedProject', self.projectsList[0].ID);
      }

      self.updateCreateClusterSetting('Projects', self.projectsList);
    },
    completeStep(payload) {
      this.clusterSteps.forEach((step) => {
        if (step.name === payload.name) {
          step.completed = true;
        }
      });
    },
    isStepActive(payload) {
      this.clusterSteps.forEach((step) => {
        if (step.name === payload.name) {
          if (step.completed === true) {
            step.completed = false;
          }
        }
      });
    },
    submitCluster() {
      var request = this.$finalModel;
      request.projectId = this.computed_create_cluster_settings.selected_project;

      let self = this;
      this.axios
        .post(
          "/server/tenants/" +
            this.computed_active_tenant_id +
            "/clusters/compute-create",
          request,
          this.get_axiosConfig()
        )
        .then(function () {
            self.$router.push({
              name: 'ProjectDetails',
              params: {
                projectID: self.selectedProject
              },
            })

        })
        .catch(function (error) {
          if (error.response.data.authorized == false) {
            self.exceededResources = error.response.data.exceededResources
            self.showQuotaExceeded = true;
            self.$bvModal.show("bv-modal-quotaexceeded");
          } else {
            console.log(error);
            if (error.response && error.response.status == "403") {
              self.$notify({
                group: "msg",
                type: "error",
                title: "Notification:",
                text: "Access Denied",
              });
            } else {
              self.$notify({
                group: "msg",
                type: "error",
                title: "Notification:",
                text: "Error while creating Compute (VM).",
              });
            }
          }
        });
    },
  },
};
</script>

<style scoped>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.pointer {
  cursor: pointer;
}

h1,
h2 {
  font-weight: normal;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #0b99b9;
  text-decoration: underline;
}

.text-medium-grey {
  color: #333;
}

.text-light-grey {
  color: #888;
}

.box.formated {
  position: relative;
  padding: 0;
}

.box.formated .heading {
  font-size: 1rem;
  text-transform: capitalize;
  padding: 0.8rem 1.5rem;
  background-color: #fafafa;
}

.box.formated .content {
  padding: 1rem 2rem;
}

i.top-left {
  position: absolute;
  left: 1.5rem;
  top: 0.8rem;
}

.vertical-separator {
  display: flex;
  justify-content: space-around;
}

.vertical-separator .line {
  border-right: 1px solid #cccccc;
}
</style>
