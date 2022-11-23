<template>
  <div>
    <QuotaExceededModal
      v-show="showQuotaExceeded"
      :exceededResources="exceededResources"
    ></QuotaExceededModal>
    <WarningAlert
      v-if="showAlert"
      :msg="alertMsg"
      color="warning"
      :key="alertKey"
      link="/documentation/users/#user-profile"
    />
    <horizontal-stepper
      :steps="clusterSteps"
      @completed-step="completeStep"
      :top-buttons="true"
      @active-step="isStepActive"
      @stepper-finished="submitCluster"
      :disableNextButton="disableNextButton"
    ></horizontal-stepper>
  </div>
</template>

<script>
import HorizontalStepper from "./HorizontalStepper";
import StepDetails from "./steps/StepYaookClusterDetails.vue";
import StepProviders from "./steps/StepProviders.vue";
import StepAlicloud from "./steps/StepAlicloud.vue";
import StepAWS from "./steps/StepAWS.vue";
import StepAzure from "./steps/StepAzure.vue";
import StepGoogle from "./steps/StepGoogle.vue";
import StepOpenstack from "./steps/StepYaookOpenstack.vue";
import StepOnpremise from "./steps/StepOnpremise.vue";
import StepYaookSubmit from "./steps/StepYaookSubmit.vue";
import QuotaExceededModal from "@/components/platform/popup_modals/QuotaExceededModal";
import WarningAlert from "@/components/platform/WarningAlert.vue";

export default {
  name: 'YaookStepper',
  components: {
    HorizontalStepper,
    QuotaExceededModal,
    WarningAlert,
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
          completed: false
        },
        {
          icon: "cloud_circle",
          name: "providers",
          title: "Select Providers",
          subtitle: "",
          component: StepProviders,
          completed: false
        },
        {
          icon: "announcement",
          name: "submit",
          title: "Submit",
          subtitle: "",
          component: StepYaookSubmit,
          completed: false
        }
      ],
      showQuotaExceeded: false,
      activeStep: 0,
      errorMsg: "",
      exceededResources: [],
      showAlert: false,
      alertMsg: "You need to set a Wireguard key in your profile settings before creating YaookCAPI cluster.",
      alertKey: 0,
      disableNextButton: false,
    };
  },
  mounted() {
    let self = this;
    this.axios
      .get(
        "/server/tenants/" +
          this.computed_active_tenant_id +
          "/cloud-credentials/check-provided-credentials",
        this.get_axiosConfig()
      )
      .then(function(response) {
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
            text: "Please provide credentials for at least one cloud provider"
          });
          self.$router.push("/app/platform/clusterlist");
        }
      })
      .catch(function(error) {
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
            text: "Error while getting user information!"
          });
        }
      });

    this.$root.$on("updateSteps", (alicloud, aws, azure, gcp, openstack, onpremise) => {
      this.clusterSteps = this.clusterSteps.filter(function(el) {
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
          completed: false
        });
      }

      if (aws) {
        this.clusterSteps.splice(this.clusterSteps.length - 1, 0, {
          icon: "dehaze",
          name: "aws",
          title: "Amazon Web Services Details",
          subtitle: "",
          component: StepAWS,
          completed: false
        });
      }

      if (azure) {
        this.clusterSteps.splice(this.clusterSteps.length - 1, 0, {
          icon: "dehaze",
          name: "azure",
          title: "Azure Details",
          subtitle: "",
          component: StepAzure,
          completed: false
        });
      }

      if (gcp) {
        this.clusterSteps.splice(this.clusterSteps.length - 1, 0, {
          icon: "dehaze",
          name: "gcp",
          title: "Google Cloud Platform Details",
          subtitle: "",
          component: StepGoogle,
          completed: false
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
          completed: false
        });
      }
    });

    if (this.computed_userInfo.profile.wireguard_public_key == "") {
      this.showAlert = true;
      this.alertKey += 1;
      this.disableNextButton = true;
    }
  },
  computed: {},
  methods: {
    completeStep(payload) {
      this.clusterSteps.forEach(step => {
        if (step.name === payload.name) {
          step.completed = true;
        }
      });
    },
    isStepActive(payload) {
      this.clusterSteps.forEach(step => {
        if (step.name === payload.name) {
          if (step.completed === true) {
            step.completed = false;
          }
        }
      });
    },
    submitCluster() {
      var request = this.$finalModel;
      request.projectId = this.$parent.selectedProject

      let self = this;

      this.axios
        .post("/server/tenants/" + this.computed_active_tenant_id + "/clusters/yaook-create", request, this.get_axiosConfig())
        .then(function(response) {
          self.$router.push({
            name: "SubmitYaookCluster",
            params: {
              ID: response.data["ID"],
              clusterName: response.data["Name"]
            }
          });
        })
        .catch(function(error) {
          if (error.response.data.authorized == false) {
            self.exceededResources = error.response.data.exceededResources;
            self.showQuotaExceeded = true;
            self.$bvModal.show("bv-modal-quotaexceeded");
          }
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
    }
  }
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
