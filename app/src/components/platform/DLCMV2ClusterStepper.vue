<template>
  <div>
    <QuotaExceededModal
      v-show="showQuotaExceeded"
      :exceededResources="exceededResources"
    ></QuotaExceededModal>
    <horizontal-stepper
      :steps="clusterSteps"
      @completed-step="completeStep"
      :top-buttons="true"
      @active-step="isStepActive"
      @stepper-finished="submitCluster"
      @installation-type-change="$emit('installation-type-change')"
      @template-change="$emit('template-change')"
      @set-show-cluster-details="$emit('set-show-cluster-details')"
    />
  </div>
</template>

<script>
import HorizontalStepper from "./HorizontalStepper";
import SimpleStep from "./steps/SimpleStep.vue";
import StepDetails from "./steps/StepDLCMV2ClusterDetails.vue";
import StepProviders from "./steps/StepProviders.vue";
import StepProvidersIntegration from "./steps/StepProvidersIntegration.vue";
import StepAlicloud from "./steps/StepDLCMV2Alicloud.vue";
import StepAWS from "./steps/StepDLCMV2AWS.vue";
import StepAzure from "./steps/StepDLCMV2Azure.vue";
import StepGoogle from "./steps/StepDLCMV2Google.vue";
import StepOpenstack from "./steps/StepDLCMV2Openstack.vue";
import StepOnpremise from "./steps/StepOnpremise.vue";
import StepKubernetesSubmit from "./steps/StepKubernetesSubmit.vue";
import QuotaExceededModal from "@/components/platform/popup_modals/QuotaExceededModal";
import Vue from "vue";

export default {
  name: 'DLCMV2ClusterStepper',
  components: {
    HorizontalStepper,
    QuotaExceededModal,
  },
  data() {
    return {
      clusterSteps: [
        {
          icon: "text_fields",
          name: "details",
          title: "Cluster Details",
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
          component: StepKubernetesSubmit,
          completed: false,
        },
      ],
      showQuotaExceeded: false,
      activeStep: 0,
      errorMsg: "",
      exceededResources: [],
    };
  },
  mounted() {
    let self = this;

    if (!this.computed_account_settings.advanced_cluster_configuration) {
      this.clusterSteps[1] = {
        icon: "cloud_circle",
        name: "clouddetails",
        title: "Cloud Details",
        subtitle: "",
        component: SimpleStep,
        completed: false
      };
    }

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
            el.name != "onpremise" &&
            el.name != "providersintegration"
          );
        });

        let count = 0

        if (alicloud) {
          count += 1
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
          count += 1
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
          count += 1
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
          count += 1
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
          count += 1;
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
          count += 1
          this.clusterSteps.splice(this.clusterSteps.length - 2, 0, {
            icon: "dehaze",
            name: "onpremise",
            title: "On-Premise Network Details",
            subtitle: "",
            component: StepOnpremise,
            completed: false,
          });
        }



      if (openstack == false || count > 1){
        this.clusterSteps.splice(this.clusterSteps.length - 1, 0, {
          icon: "build",
          name: "providersintegration",
          title: "Integration",
          subtitle: "",
          component: StepProvidersIntegration,
          completed: false
        });
      }

      }
    );
  },
  computed: {},
  methods: {
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
            "/clusters/dlcmv2-create",
          request,
          this.get_axiosConfig()
        )
        .then(function (response) {
          self.$router.push({
            name: "SubmitKubernetesCluster",
            params: {
              ID: response.data["ID"],
              clusterName: response.data["Name"],
            },
          });
        })
        .catch(function (error) {
          if (error.response.status == 400) {
            if (error.response.data.authorized == false) {
              self.exceededResources = error.response.data.exceededResources;
              self.showQuotaExceeded = true;
              self.$bvModal.show("bv-modal-quotaexceeded");
              return;
            }
          }
          // eslint-disable-next-line no-console
          console.log(error);
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
    showAlert(msg) {
      console.info(msg);
      this.$notify({
        group: "msg",
        type: "error",
        title: "Notification:",
        text: msg,
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

hr {
  background-color: transparent;
  border: none;
  display: block;
  height: inherit;
  margin: 1.5rem 0;
  border-top: dashed 1px;
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
