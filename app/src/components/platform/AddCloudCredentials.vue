<template>
  <div>
    <div class="card daiteap-content-card">
      <div>
        <CardTitle title="Add Credentials" />
      </div>
      <div>
        <hr />
        <div>
          <b-row>
            <b-col
              class="p-0 m-0"
              v-for="(provider, index) in providers"
              @click="
                autoSuggestedLabel = provideLabelForNewAccount(provider.name)
              "
              :key="provider + index"
            >
              <button class="p-0 m-0 btn btn-outline">
                <img
                  :class="
                    selectedProvider == provider.name
                      ? 'selectedProvider'
                      : 'notSelectedProvider'
                  "
                  :src="require('../../assets/img/' + provider.logo)"
                  @click="selectedProvider = provider.name"
                  height="75"
                  width="150"
                  class="p-3 m-0"
                /></button
            ></b-col>
          </b-row>
        </div>
        <br />
        <br />

        <WarningAlert
          v-if="showWAlert"
          :msg="alertMsg"
          color="warning"
          :key="alertKey"
          link="/documentation/cloud_credentials/"
        />

        <AddAwsAccount
          :awsAccountFromParent="aws"
          v-if="selectedProvider === 'aws'"
          :loading="loading"
          :allCurrentLabels="allCurrentLabels"
          @saveNewAccount="saveNewAccount"
        />
        <AddAzureAccount
          :azureAccountFromParent="azure"
          v-if="selectedProvider === 'azure'"
          :loading="loading"
          :allCurrentLabels="allCurrentLabels"
          @saveNewAccount="saveNewAccount"
          @auth="azureAuth"
        />
        <AddGoogleAccount
          :googleAccountFromParent="google"
          v-if="selectedProvider === 'google'"
          :loading="loading"
          :allCurrentLabels="allCurrentLabels"
          @saveNewAccount="saveNewAccount"
          @auth="googleAuth"
        />
        <AddOpenstackAccount
          :openstackAccountFromParent="openstack"
          v-if="selectedProvider === 'openstack'"
          :loading="loading"
          :allCurrentLabels="allCurrentLabels"
          @saveNewAccount="saveNewAccount"
        />
        <AddOnpremiseAccount
          :onpremiseAccountFromParent="onpremise"
          v-if="selectedProvider === 'onpremise'"
          :loading="loading"
          :allCurrentLabels="allCurrentLabels"
          @saveNewAccount="saveNewAccount"
        />
        <AddIotArmAccount
          :iotarmAccountFromParent="iotarm"
          v-if="selectedProvider === 'iotarm'"
          :loading="loading"
          :allCurrentLabels="allCurrentLabels"
          @saveNewAccount="saveNewAccount"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, maxLength } from "vuelidate/lib/validators";
import CardTitle from "@/components/platform/CardTitle";
import AddAwsAccount from "@/components/platform/addProviderCredentials/AddAwsAccount";
import AddAzureAccount from "@/components/platform/addProviderCredentials/AddAzureAccount";
import AddGoogleAccount from "@/components/platform/addProviderCredentials/AddGoogleAccount";
import AddIotArmAccount from "@/components/platform/addProviderCredentials/AddIotArmAccount";
import AddOnpremiseAccount from "@/components/platform/addProviderCredentials/AddOnpremiseAccount";
import AddOpenstackAccount from "@/components/platform/addProviderCredentials/AddOpenstackAccount";
import WarningAlert from "@/components/platform/WarningAlert.vue";

export default {
  name: "AddCloudCredentials",
  mixins: [validationMixin],
  props: {
    projectParams: Object,
  },
  data() {
    return {
      allAccounts: [],
      aws: {
        label: "",
        aws_access_key_id: "",
        aws_secret_access_key: "",
        statusOfValidation: false,
        has_associated_environments: false,
        provider: "aws",
      },
      azure: {
        label: "",
        azure_tenant_id: "",
        azure_subscription_id: "",
        azure_client_id: "",
        azure_client_secret: "",
        statusOfValidation: false,
        has_associated_environments: false,
        provider: "azure",
      },
      google: {
        label: "",
        google_key: {
          type: "",
          project_id: "",
          private_key_id: "",
        },
        statusOfValidation: false,
        has_associated_environments: false,
        provider: "google",
      },
      openstack: {
        label: "",
        application_credential_id: "",
        application_credential_secret: "",
        region_name: "",
        auth_url: "",
        statusOfValidation: false,
        has_associated_environments: false,
        provider: "openstack",
      },
      onpremise: {
        label: "",
        gw_public_ip: "",
        gw_private_ip: "",
        admin_username: "",
        admin_private_key: "",
        statusOfValidation: false,
        has_associated_environments: false,
        provider: "onpremise",
      },
      iotarm: {
        label: "",
        gw_public_ip: "",
        gw_private_ip: "",
        admin_username: "",
        admin_private_key: "",
        vpcCidr: "",
        statusOfValidation: false,
        has_associated_environments: false,
        provider: "iotarm",
      },
      autoSuggestedLabel: "",
      allCurrentLabels: [],
      created: false,
      selectedProvider: "aws",
      providers: [],
      showWAlert: false,
      alertMsg: "",
      loading: false,
      statusOfValidation: false,
      alertKey: 0,
    };
  },
  components: {
    CardTitle,
    AddAwsAccount,
    AddAzureAccount,
    AddGoogleAccount,
    AddIotArmAccount,
    AddOnpremiseAccount,
    AddOpenstackAccount,
    WarningAlert,
  },
  created() {
    this.getCloudCredentials(this);
  },
  destroyed() {
    if (window.intervals) {
      for (let i = 0; i < window.intervals.length; i++) {
        clearInterval(window.intervals[i]);
      }
    }
    clearInterval(this.interval);
  },
  mounted() {
    let self = this;

    setTimeout(() => {
      this.autoSuggestedLabel = this.provideLabelForNewAccount(this.selectedProvider);
    }, 100)

    self.interval = setInterval(() => {
      self.getCloudCredentials(self);
    }, 10000);

    window.intervals = [];
    window.intervals.push(self.interval);
    
    this.$root.$on("accountSettingsChanged", () => {
      self.providers = [];
      if (!self.computed_account_settings) { 
        this.getAccountSettings();

        return;
      }

      if (self.computed_account_settings.providers_enable_aws) {
        self.providers.push(
          {
            name: "aws",
            logo: "aws_logo.png",
            logo_small: "aws_logo_small.png",
          },
        );
      }
      if (self.computed_account_settings.providers_enable_azure) {
        self.providers.push(
          {
            name: "azure",
            logo: "azure_logo.png",
            logo_small: "azure_logo_small.png",
          },
        );
      }
      if (self.computed_account_settings.providers_enable_gcp) {
        self.providers.push(
          {
            name: "google",
            logo: "googleCloud_logo.svg",
            logo_small: "googleCloud_logo_small.png",
          },
        );
      }
      if (self.computed_account_settings.providers_enable_openstack) {
        if(this.computed_theme == "daiteap") {
          self.providers.push(
            {
              name: "openstack",
              logo: "openstack_logo.svg",
              logo_small: "openstack_logo_small.png",
            },
          );
        }
      }
      if (self.computed_account_settings.providers_enable_onprem) {
        self.providers.push(
          {
            name: "onpremise",
            logo: "onpremise_large.svg",
            logo_small: "onpremise.svg",
          },
        );
      }
      if (self.computed_account_settings.providers_enable_arm) {
        self.providers.push(
          {
            name: "iotarm",
            logo: "IoTArm_logo.png",
            logo_small: "IoTArm_logo_small.svg",
          },
        );
      }
      if (self.computed_account_settings.providers_enable_ali) {
        self.providers.push(
          {
            name: "ali",
            logo: "alicloud_logo.png",
            logo_small: "alicloud_logo_small.png",
          },
        );
      }
      
      if (self.providers.length > 0) {
        self.selectedProvider = self.providers[0].name;
        self.provideLabelForNewAccount(self.providers[0].name);
      }
    });

    self.$root.$emit('accountSettingsChanged', undefined);
  },
  methods: {
    azureAuth() {
      let self = this;

      this.axios
        .post(
          "/server/oauth/azure/getauthurladminconsent",
          { origin: window.origin },
          this.get_axiosConfig()
        )
        .then(function (response) {
          window.location.href = response.data.auth_url;
        })
        .catch(function (error) {
          self.loading = false;
          console.log(error);
          self.error = error;
          if (error.response) {
            console.log(error.response.data);
            self.error_description = error.response.data;
          }

          self.$notify({
            group: "msg",
            type: "error",
            title: "Notification:",
            text: "Error creating user credentials",
          });
        });
    },
    googleAuth() {
      let self = this;

      this.axios
        .post(
          "/server/oauth/google/getauthurlprojects",
          { origin: window.origin },
          this.get_axiosConfig()
        )
        .then(function (response) {
          window.location.href = response.data.auth_url;
        })
        .catch(function (error) {
          self.loading = false;
          console.log(error);
          self.error = error;
          if (error.response) {
            console.log(error.response.data);
            self.error_description = error.response.data;
          }

          self.$notify({
            group: "msg",
            type: "error",
            title: "Notification:",
            text: "Error creating user credentials",
          });
        });
    },
    removeLabelfromListOfAllLabels(label) {
      function findIndexToRemove(labelToRemove) {
        return labelToRemove === label;
      }
      let indexToRemove = this.allCurrentLabels.findIndex(findIndexToRemove);
      this.allCurrentLabels.splice(indexToRemove, 1);
    },
    saveNewAccount(provider, account, sharedCredentials) {
      var account_params = account;

      var accountRequest;
      if(provider == "aws")
      {
        accountRequest = {
          aws: account_params
        }
      }
      else if(provider == "azure")
      {
        accountRequest = {
          azure: account_params
        }
      }
      else if(provider == "google")
      {
        accountRequest = {
          google: account_params
        }
      }
      else if(provider == "onpremise")
      {
        accountRequest = {
          onpremise: account_params
        }
      }
      else if(provider == "openstack")
      {
        accountRequest = {
          openstack: account_params
        }
      }
      else if(provider == "iotarm")
      {
        accountRequest = {
          iotarm: account_params
        }
      }

      let self = this;

      this.axios
        .post(
          "/server/tenants/" +
            this.computed_active_tenant_id +
            "/cloud-credentials/validate",
          {
            credentials: accountRequest,
          },
          this.get_axiosConfig()
        )
        .then(function (response) {
          let taskId = response.data.taskId;
          self.statusOfValidation = "validating";
          self.loading = true;

          let status = "ok";
          self.timeoutForGettaskmessage = setTimeout(function () {
            if (self.statusOfValidation === "pending") {
              status = "timedOut";
              self.statusOfValidation = "timedOut";
            }
          }, 20000);
          gettaskmessage(taskId);
          function gettaskmessage(taskId) {
            self.axios
              .post("/server/gettaskmessage", { taskId: taskId }, self.get_axiosConfig())
              .then(function (response) {
                if (response.data.status == "PENDING") {
                  self.statusOfValidation = "pending";
                  self.runAgainForIfPending = setTimeout(() => {
                    if (status === "ok") {
                      gettaskmessage(taskId);
                    }
                  }, 1000);
                } else {
                  self.statusOfValidation = true;
                  self.loading = false;

                  if (response.data.error) {
                    self.statusOfValidation = "error";
                    self.showWAlert = true;
                    self.alertMsg = response.data.errorMessage;

                    for (let i = 0; i < response.data.lcmStatuses.length; i++) {
                      let key = Object.keys(response.data.lcmStatuses[i])[0];
                      let value = Object.values(
                        response.data.lcmStatuses[i]
                      )[0];

                      if (value == false) {
                        if (key == "dlcmV2Images") {
                          self.alertMsg += ", Check the DLCMV2 images.";
                        } else if (
                          provider == "openstack" &&
                          self.computed_account_settings
                            .enable_kubernetes_capi &&
                          key == "capiImages"
                        ) {
                          self.alertMsg += ", Check the CAPI images.";
                        } else if (
                          provider == "openstack" &&
                          self.computed_account_settings
                            .enable_kubernetes_yaookcapi &&
                          key == "yaookCapiImages"
                        ) {
                          self.alertMsg += ", Check the YaookCAPI images.";
                        } else if (
                          provider == "openstack" &&
                          key == "externalNetwork"
                        ) {
                          self.alertMsg += ", Check the external network.";
                        }
                      }
                    }

                    self.alertKey += 1;
                  } else {
                    self.showWAlert = false;
                    self.alertMsg = "";
                    self.alertKey += 1;

                    if (
                      self.loading == false &&
                      self.statusOfValidation == true
                    ) {
                      self.axios
                        .post(
                          "/server/tenants/" +
                            self.computed_active_tenant_id +
                            "/cloud-credentials",
                          {
                            provider: provider,
                            account_params: account_params,
                            sharedCredentials: sharedCredentials,
                          },
                          self.get_axiosConfig()
                        )
                        .then(function () {
                          self.$notify({
                            group: "msg",
                            type: "success",
                            title: "Notification:",
                            text: "Successfuly saved cloud credentials!",
                          });
                          self.$router.push({ name: "CloudProfile" });
                        })
                        .catch(function (error) {
                          console.log(error);
                          if (error.response) {
                            console.log(error.response.data);
                          }
                          self.$notify({
                            group: "msg",
                            type: "error",
                            title: "Notification:",
                            text: "Error while saving cloud credentials.",
                          });
                        });                     
                    }
                  }
                }
              })
              .catch(function (error) {
                self.statusOfValidation = "error";
                self.loading = false;
                console.log(error);
                if (error.response) 
                {
                  console.log(error.response.data);
                }
              });
          }
        })
        .catch(function (error) {
          if(self.loading == false)
          {
            console.log(error);
            if (error.response) {
              console.log(error.response.data);
            }
          }
        })
    },
    async getCloudCredentials(currentObject) {
      let self = currentObject;
      let credentials = await this.getCredentials();

      self.allAccounts = [];
      for (let i = 0; i < credentials.length; i++) {
        self.allAccounts[i] = {};
        self.allCurrentLabels[i] = credentials[i].label;
        self.allAccounts[i] = credentials[i];

        if (credentials[i].type === "alicloud") {
          self.allAccounts[i].provider = "alicloud";
        } else if (credentials[i].type === "aws") {
          self.allAccounts[i].provider = "aws";
        } else if (credentials[i].type === "azure") {
          self.allAccounts[i].provider = "azure";
        } else if (credentials[i].type === "google") {
          self.allAccounts[i].provider = "google";
        } else if (credentials[i].type === "openstack") {
          self.allAccounts[i].provider = "openstack";
        } else if (credentials[i].type === "onpremise") {
          self.allAccounts[i].provider = "onpremise";
        } else if (credentials[i].type === "iotarm") {
          self.allAccounts[i].provider = "iotarm";
        }
        self.allAccounts.sort(function (a, b) {
          return a.created_at - b.created_at;
        });

        let options = {
          year: "numeric",
          month: "numeric",
          day: "numeric",
        };
        for (let i = 0; i < self.allAccounts.length; i++) {
          let date = Date.parse(self.allAccounts[i].created_at);
          self.allAccounts[i].created_at = new Date(date)
            .toLocaleString("en-US", options)
            .toLocaleString("en-US", options);
        }
      }
      self.loadingTable = false;
    },
    provideLabelForNewAccount(provider) {
      var rand = Math.random().toString(36).slice(5)
      return provider + "-" + rand;
    },
    showAlert(error) {
      this.msg = error;
      this.dismissCountDown = this.dismissSecs;
    },
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
              setTimeout(() => {
                this.axios
                  .get(
                    "/server/tenants/" +
                      this.computed_active_tenant_id +
                      "/projects/name-available/" +
                      value,
                    this.get_axiosConfig()
                  )
                  .then(function (response) {
                    if (response.data.free == true) {
                      resolve(true);
                    } else {
                      resolve(false);
                    }
                  })
                  .catch(function (error) {
                    console.log(error);
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
};
</script>

<style scoped>
.providerLogoDiv {
  height: 100%;
  width: 100%;
}
.providerLogo {
  object-fit: cover;
  position: relative;
  top: 50%;
  -webkit-transform: translateY(-50%);
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 50%;
}

#k3sCard,
#dkeCard,
#dmcvCard {
  cursor: pointer;
}
.selectedProvider {
  border-bottom: 2px solid black !important;
  user-drag: none;
  -webkit-user-drag: none;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
}
.notSelectedProvider {
  border-bottom: 2px solid #ffffff !important;
  user-drag: none;
  -webkit-user-drag: none;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
}
.btn-outline {
  box-shadow: none;
  outline: none;
}
</style>