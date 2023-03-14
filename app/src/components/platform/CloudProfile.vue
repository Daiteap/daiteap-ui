<template>
  <div>
    <RemoveAccountWarning
      v-show="showRemoveAccountWarning"
      :accountToRemoveFromParent="accountToRemove"
      @confirmDelete="deleteAccount"
    ></RemoveAccountWarning>
    <EditAccountName
      v-show="showEditAccountNameModal"
      :accountToEdit="accountToEdit"
      @updateCredential="updateAccountName"
    ></EditAccountName>
    <div class="card daiteap-content-card">
      <div class="d-flex justify-content-between cardHeaderLight">
        <span class="fa-stack landing-page-icon">
          <i class="fas fa-square fa-stack-2x" style="line-height: 1.5;"></i>
          <i class="fas fa-key fas fa-stack-1x fa-inverse" style="line-height: 3;"></i>
        </span>
        <CardTitle title="Cloud Credentials" style="line-height: 2;" />
        <span class="text-right h4 ml-auto">
          <AddButton text='Add Cloud Credentials' @onClickAddButton="$router.push('addcloudcredentials')" />
        </span>
      </div>
      <hr />

      <WarningAlert
        v-if="showDeleteAlert"
        :msg="deleteAlertMsg"
        color="warning"
        :key="deleteAlertKey"
      />

      <div v-for="alert in alerts" :key="alert.index">
        <WarningAlert v-if="alert.show" :msg="alert.msg" color="warning" :key="alert.key" link="/documentation/cloud_credentials/#check-credential-status"/>
      </div>

      <div v-if="loadingTable" class="d-flex justify-content-center">
        <div class="spinner-border" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>

      <div v-else-if="allAccounts.length < 1 && !loadingTable">
        <div> No cloud credentials available - please add your credentials. </div>
      </div>

      <div v-else class="mt-2">
        <CloudProfileTable
          @removeAccount="goToRemoveAccountWarning"
          :allAccounts="allAccounts"
          :providers="providers"
          :alerts="alerts"
          :listOfAccountsInDeletion="listOfAccountsInDeletion"
          @validateAllCredentials="validateCredentialsList"
          @openEditPopup="openEditAccountNameModal"
          @validateCredential="validateCredentials"
          :showTenant="false"
        />
      </div>
      <br />
    </div>
  </div>
</template>

<script scoped>
import RemoveAccountWarning from "@/components/platform/popup_modals/RemoveAccountWarning";
import EditAccountName from "@/components/platform/popup_modals/EditAccountName";
import CardTitle from "@/components/platform/CardTitle";
import CloudProfileTable from "@/components/platform/tables/CloudProfileTable";
import WarningAlert from "@/components/platform/WarningAlert";
import AddButton from "@/components/platform/AddButton"

export default {
  name: "CloudProfile",
  components: {
    RemoveAccountWarning,
    EditAccountName,
    CardTitle,
    CloudProfileTable,
    WarningAlert,
    AddButton,
  },
  data() {
    return {
      interval: "",
      providers: [
        {
          name: "alicloud",
          logo: "alicloud_logo.png",
          logo_small: "alicloud_logo_small.png",
        },
        {
          name: "aws",
          logo: "aws_logo.png",
          logo_small: "aws_logo_small.png",
        },
        {
          name: "azure",
          logo: "azure_logo.png",
          logo_small: "azure_logo_small.png",
        },
        {
          name: "google",
          logo: "googleCloud_logo.svg",
          logo_small: "googleCloud_logo_small.png",
        },
        {
          name: "onpremise",
          logo: "onpremise_large.svg",
          logo_small: "onpremise.svg",
        },
        {
          name: "iotarm",
          logo: "IoTArm_logo.png",
          logo_small: "IoTArm_logo_small.svg",
        },
      ],
      awsAccessKeyError:
        "Access key does not match regex: ^(?<![A-Z0-9])[A-Z0-9]{20}(?![A-Z0-9])$",
      awsSecretKeyError:
        "Secret key does not match regex: ^(?<![A-Za-z0-9/+=])[A-Za-z0-9/+=]{40}(?![A-Za-z0-9/+=])$",
      alicloudAccounts: [],
      alicloud: {
        label: "",
        alicloud_access_key: "",
        alicloud_secret_key: "",
        statusOfValidation: false,
        provider: "alicloud",
        has_associated_environments: false,
      },
      awsAccounts: [],
      aws: {
        label: "",
        aws_access_key_id: "",
        aws_secret_access_key: "",
        statusOfValidation: false,
        has_associated_environments: false,
        provider: "aws",
      },
      azureAccounts: [],
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
      googleAccounts: [],
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
      onpremiseAccounts: [],
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
      iotarmAccounts: [],
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
      accountToEdit: {
        label: "",
        description: "",
        contact: "",
        id: "",
        idKey1: "",
        idKey2: "",
        idKey3: "",
        provider: "",
      },
      allAccounts: [],
      userAccount: {
        type: "",
        id: "",
        label: "",
        has_associated_environments: "",
      },
      step: 0,
      errorMsg: "",
      error: false,
      loading: true,
      showAddAlicloudAccount: false,
      showAddAwsAccount: true,
      showAddAzureAccount: false,
      showAddGoogleAccount: false,
      showAddOpenstackAccount: false,
      showAddOnpremiseAccount: false,
      showAddIotArmAccount: false,
      showRemoveAccountWarning: false,
      showEditAccountNameModal: false,
      allCurrentLabels: [],
      autoSuggestedLabel: "",
      accountToRemoveFromParent: {
        accountLabel: "",
      },
      accountToRemove: {},
      listOfAccountsInDeletion: [],
      loadingTable: true,
      providerOfccountToEdit: "",
      alerts: [],
      showDeleteAlert: false,
      deleteAlertMsg: "",
      deleteAlertKey: 0,
    };
  },
  props: {
    tenantID: String,
  },
  destroyed() {
    if (window.intervals) {
      for (let i = 0; i < window.intervals.length; i++) {
        clearInterval(window.intervals[i]);
      }
    }
    clearInterval(this.interval);
  },
  created() {
    this.loadingTable = true;
    this.addOpenstackLogos();
    this.getCloudCredentials(this);
  },
  mounted() {
    let self = this;
    self.interval = setInterval(() => {
      self.getCloudCredentials(self);
    }, 5000);

    window.intervals = [];
    window.intervals.push(self.interval);
  },
  methods: {
    addOpenstackLogos() {
      if(this.computed_theme == "daiteap") {
        this.providers.push({
          name: "openstack",
          logo: "openstack_logo.svg",
          logo_small: "openstack_logo_small.png",
        });
      }
    },
    async getCloudCredentials(currentObject) {
      let self = currentObject;

      let credentials;
      credentials = await this.getCredentials();

      let accounts = self.allAccounts;
      self.allAccounts = [];
      for (let i = 0; i < credentials.length; i++) {
        self.allAccounts[i] = {};
        self.allCurrentLabels[i] = credentials[i].label;
        self.allAccounts[i] = credentials[i];

        if(self.alerts.find((alert) => alert.id === credentials[i].id) === undefined)
        {
          let alert = {
            label: credentials[i].label,
            id: credentials[i].id,
            show: false,
            msg: "",
            key: 0,
          };
          self.alerts.push(alert);
        } else {
          self.alerts.find((alert) => alert.id === credentials[i].id).label = credentials[i].label;
        }

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

        let currentAccount = accounts.filter(
          (x) => x.id == self.allAccounts[i].id
        )[0];
        if (currentAccount && currentAccount.validating) {
          self.allAccounts[i].statusOfValidation = "loading";
        } else {
          if (self.allAccounts[i].valid != null) {
            self.allAccounts[i].statusOfValidation = self.allAccounts[i].valid
              ? true
              : "error";
          } else {
            self.allAccounts[i].statusOfValidation = "loading";
          }
        }

        self.allAccounts.sort(function (a, b) {
          return a.created_at - b.created_at;
        });

        let options = {
          year: "numeric",
          month: "numeric",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
        };
        for (let i = 0; i < self.allAccounts.length; i++) {
          let date = Date.parse(self.allAccounts[i].created_at.replace(" ", "T"));
          self.allAccounts[i].created_at_pretty = new Date(date)
            .toLocaleString("en-US",options);
        }
      }

      self.loadingTable = false;
    },
    deleteAccount(account) {
      this.showRemoveAccountWarning = false;
      this.listOfAccountsInDeletion.push(account.id);
      let self = this;
      this.axios
        .delete(
          "/server/tenants/" +
            this.computed_active_tenant_id +
            "/cloud-credentials/" +
            account.id,
          this.get_axiosConfig()
        )
        .then(function () {
          account.statusOfValidation = "deleting";
          let thisLabelIndex = self.allCurrentLabels.findIndex(
            (thisLabel) => thisLabel === account
          );
          self.allCurrentLabels.splice(thisLabelIndex, 1);
          self.$notify({
            group: "msg",
            type: "success",
            title: "Notification:",
            text: "Successfuly deleted cloud credentials!",
          });

          self.showDeleteAlert = false;
          self.deleteAlertMsg = "";
          self.deleteAlertKey += 1;
        })
        .catch(function (error) {
          if (error.response) {
            console.log(error.response.data);

            if (
              error.response.data.error.message ==
              "Cloud credential has associated resources."
            ) {
              self.showDeleteAlert = true;
              self.deleteAlertMsg =
                "Can't delete credential while it has associated resources:";
              self.deleteAlertKey += 1;
              self.listOfAccountsInDeletion.pop(account.id);

              let resources = error.response.data.error.resources;

              if (resources["buckets"].length > 0) {
                self.deleteAlertMsg += "\n Storage: ";
                for (let i = 0; i < resources["buckets"].length; i++) {
                  if (i == resources["buckets"].length - 1) {
                    self.deleteAlertMsg += resources["buckets"][i];
                  } else {
                    self.deleteAlertMsg += resources["buckets"][i] + ", ";
                  }
                }
              }

              if (resources["compute"].length > 0) {
                self.deleteAlertMsg += "\n Compute (VMs): ";
                for (let i = 0; i < resources["compute"].length; i++) {
                  if (i == resources["compute"].length - 1) {
                    self.deleteAlertMsg += resources["compute"][i];
                  } else {
                    self.deleteAlertMsg += resources["compute"][i] + ", ";
                  }
                }
              }

              if (resources["clusters"].length > 0) {
                self.deleteAlertMsg += "\n Kubernetes Clusters: ";
                for (let i = 0; i < resources["clusters"].length; i++) {
                  if (i == resources["clusters"].length - 1) {
                    self.deleteAlertMsg += resources["clusters"][i];
                  } else {
                    self.deleteAlertMsg += resources["clusters"][i] + ", ";
                  }
                }
              }
            }
          }
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
              text: "Error while deleting cloud credentials.",
            });
          }
        });
    },
    updateAccountName(accountWithEditedName, id, provider) {
      let self = this;
      this.axios
        .put(
          "/server/tenants/" +
            this.computed_active_tenant_id +
            "/cloud-credentials/" +
            id,
          {
            label: accountWithEditedName.label,
            description: accountWithEditedName.description,
            provider: provider,
            sharedCredentials: accountWithEditedName.shared,
          },
          this.get_axiosConfig()
        )
        .then(function () {
          self.removeLabelfromListOfAllLabels(
            accountWithEditedName.previousLabel
          );
          self.allCurrentLabels.push(accountWithEditedName.label);
          self.$notify({
            group: "msg",
            type: "success",
            title: "Notification:",
            text: "Successfuly updated cloud credentials!",
          });
        })
        .catch(function (error) {
          console.log(error);
          if (error.response) {
            console.log(error.response.data);
          }
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
              text: "Error while updating cloud credentials.",
            });
          }
        });
    },
    saveNewAccount(provider, account) {
      var account_params = account;

      let self = this;
      this.axios
        .post(
          "/server/tenants/" +
            this.computed_active_tenant_id +
            "/cloud-credentials",
          {
            provider: provider,
            account_params: account_params,
          },
          this.get_axiosConfig()
        )
        .then(function () {
          self.$notify({
            group: "msg",
            type: "success",
            title: "Notification:",
            text: "Successfuly saved account information!",
          });
        })
        .catch(function (error) {
          console.log(error);
          if (error.response) {
            console.log(error.response.data);
          }
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
              text: "Error while saving the user information",
            });
          }
        });
    },
    validateCredentials(account_credentials) {
      // Check if account is on-premise account and stop validating
      if (
        account_credentials.type === "ONPREM" ||
        account_credentials.type === "IOTARM"
      ) {
        return;
      }

      let self = this;
      account_credentials.statusOfValidation = "loading";
      account_credentials.validating = true;
      self.errorMsg = "";
      self.error = false;

      this.axios
        .post(
          "/server/tenants/" +
            this.computed_active_tenant_id +
            "/cloud-credentials/" +
            account_credentials.id +
            "/validate",
          {},
          this.get_axiosConfig()
        )
        .then(function (response) {
          let taskId = response.data.taskId;

          account_credentials.statusOfValidation = "validating";

          self.loading = true;

          let status = "ok";
          self.timeoutForGettaskmessage = setTimeout(function () {
            if (account_credentials.statusOfValidation === "pending") {
              status = "timedOut";
              account_credentials.statusOfValidation = "timedOut";
            }
          }, 20000);
          gettaskmessage(taskId);
          function gettaskmessage(taskId) {
            self.axios
              .get(
                "/server/task-message/" + taskId,
                self.get_axiosConfig()
              )
              .then(function (response) {
                let alert = self.alerts.find(alert => alert.id === account_credentials.id);

                if (response.data.status == "PENDING") {
                  account_credentials.statusOfValidation = "pending";
                  self.runAgainForIfPending = setTimeout(() => {
                    if (status === "ok") {
                      gettaskmessage(taskId);
                    }
                  }, 1000);
                } else {
                  account_credentials.validating = false;

                  if (response.data.error) {
                    account_credentials.statusOfValidation = "error";
                    self.error = true;
                    self.errorMsg = response.data.errorMessage;
                    alert.show = true;
                    alert.msg = alert.label + ": " + response.data.errorMessage;

                    for (let i = 0; i < response.data.lcmStatuses.length; i++) {
                      let key = Object.keys(response.data.lcmStatuses[i])[0];
                      let value = Object.values(
                        response.data.lcmStatuses[i]
                      )[0];

                      if (value == false) {
                        if (key == "dlcmV2Images") {
                          alert.msg += ", Check the DLCMV2 images.";
                        } else if (
                          checkIfAccountCanBeValidated.type == "openstack" &&
                          self.computed_account_settings
                            .enable_kubernetes_capi &&
                          key == "capiImages"
                        ) {
                          alert.msg += ", Check the CAPI images.";
                        } else if (
                          checkIfAccountCanBeValidated.type == "openstack" &&
                          self.computed_account_settings
                            .enable_kubernetes_yaookcapi &&
                          key == "yaookCapiImages"
                        ) {
                          alert.msg += ", Check the YaookCAPI images.";
                        } else if (
                          checkIfAccountCanBeValidated.type == "openstack" &&
                          key == "externalNetwork"
                        ) {
                          alert.msg += ", Check the external network.";
                        }
                      }
                    }
                  } else {
                    account_credentials.statusOfValidation = true;
                    alert.show = false;
                    alert.msg = alert.label + ": ";
                  }

                  self.loading = false;
                  alert.key += 1;
                }
              })
              .catch(function (error) {
                account_credentials.validating = false;
                account_credentials.statusOfValidation = "error";
                self.loading = false;
                self.error = true;
                console.log(error);
                if (error.response) {
                  self.errorMsg = error.response.data;
                } else {
                  self.errorMsg = error;
                }
              });
          }
        })
        .catch(function (error) {
          console.log(error);
          if (
            !(
              error.response.data.error.message ===
              "Cloud credentials validation is not finished yet"
            )
          ) {
            account_credentials.validating = false;
            account_credentials.statusOfValidation = "error";
            if (error.response) {
              console.log(error.response.data);
            }
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
                text: "Error while validating the user information",
              });
            }
          }
        });
    },
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
    goToAddAccount(provider) {
      this.autoSuggestedLabel = this.provideLabelForNewAccount(provider);
      if (provider == "alicloud") {
        this.$bvModal.show("bv-modal-addalicloudaccount");
      }
      if (provider == "aws") {
        this.$bvModal.show("bv-modal-addawsaccount");
      }
      if (provider == "azure") {
        this.$bvModal.show("bv-modal-addazureaccount");
      }
      if (provider == "google") {
        this.$bvModal.show("bv-modal-addgoogleaccount");
      }
      if (provider == "openstack") {
        this.$bvModal.show("bv-modal-addopenstackaccount");
      }
      if (provider == "onpremise") {
        this.$bvModal.show("bv-modal-addonpremiseaccount");
      }
      if (provider == "iotarm") {
        this.$bvModal.show("bv-modal-addiotarmaccount");
      }
    },
    goToRemoveAccountWarning(accountToRemove) {
      // console.log(accountToRemove);
      this.showRemoveAccountWarning = true;
      this.$bvModal.show("bv-modal-removeaccountwarning");
      this.accountToRemove = accountToRemove;
    },
    providerImageFilename(provider) {
      let logo = "";
      for (let i = 0; i < this.providers.length; i++) {
        if (this.providers[i].name == provider) {
          logo = this.providers[i].logo_small;
        }
      }
      return logo;
    },
    async openEditAccountNameModal(account) {
      let credentialData = await this.getCredentialDetails(account.id);
      credentialData = credentialData.credential_data;

      this.accountToEdit.label = account.label;
      this.accountToEdit.currentLabel = account.label;
      this.accountToEdit.description = account.description;
      this.accountToEdit.currentDescription = account.description;
      this.accountToEdit.contact = account.contact;
      this.accountToEdit.currentContact = account.contact;
      this.accountToEdit.provider = account.provider;
      this.accountToEdit.id = account.id;
      this.accountToEdit.shared = account.shared;
      this.accountToEdit.currentShared = account.shared;
      this.accountToEdit.owner = account.owner;

      if (account.provider === "alicloud") {
        this.accountToEdit.idKey1 = credentialData.alicloud_access_key;
      } else if (account.provider === "aws") {
        this.accountToEdit.idKey1 = credentialData.aws_access_key_id;
      } else if (account.provider === "azure") {
        this.accountToEdit.idKey1 = credentialData.azure_tenant_id;
        this.accountToEdit.idKey2 = credentialData.azure_subscription_id;
        this.accountToEdit.idKey3 = credentialData.azure_client_id;
      } else if (account.provider === "google") {
        this.accountToEdit.idKey1 = "";
        if (credentialData.type) {
          this.accountToEdit.idKey1 = credentialData.type;
        }
        this.accountToEdit.idKey2 = "";
        if (credentialData.project_id) {
          this.accountToEdit.idKey2 = credentialData.project_id;
        }
        this.accountToEdit.idKey3 = "";
        if (credentialData.private_key_id) {
          this.accountToEdit.idKey3 = credentialData.private_key_id;
        }
      } else if (account.provider === "openstack") {
        this.accountToEdit.idKey1 = credentialData.region_name;
        this.accountToEdit.idKey2 = credentialData.auth_url;
        this.accountToEdit.idKey3 = credentialData.application_credential_id;
      } else if (account.provider === "onpremise") {
        this.accountToEdit.idKey1 = credentialData.gw_public_ip;
        this.accountToEdit.idKey2 = credentialData.gw_private_ip;
        this.accountToEdit.idKey3 = credentialData.admin_username;
      } else if (account.provider === "iotarm") {
        this.accountToEdit.idKey1 = credentialData.gw_public_ip;
        this.accountToEdit.idKey2 = credentialData.gw_private_ip;
        this.accountToEdit.idKey3 = credentialData.admin_username;
      } else if (account.type === "ALICLOUD") {
        this.accountToEdit.provider = "alicloud";
        this.accountToEdit.idKey1 = credentialData.alicloud_access_key;
      } else if (account.type === "AWS") {
        this.accountToEdit.provider = "aws";
        this.accountToEdit.idKey1 = credentialData.aws_access_key_id;
      } else if (account.type === "AZURE") {
        this.accountToEdit.provider = "azure";
        this.accountToEdit.idKey1 = credentialData.azure_tenant_id;
        this.accountToEdit.idKey2 = credentialData.azure_subscription_id;
        this.accountToEdit.idKey3 = credentialData.azure_client_id;
      } else if (account.type === "GCP") {
        this.accountToEdit.provider = "google";
        this.accountToEdit.idKey1 = credentialData.type;
        this.accountToEdit.idKey2 = credentialData.project_id;
        this.accountToEdit.idKey3 = credentialData.private_key_id;
      } else if (account.type === "OPENSTACK") {
        this.accountToEdit.provider = "openstack";
        this.accountToEdit.idKey1 = credentialData.region_name;
        this.accountToEdit.idKey2 = credentialData.auth_url;
        this.accountToEdit.idKey3 = credentialData.application_credential_id;
      } else if (account.type === "ONPREM") {
        this.accountToEdit.provider = "onpremise";
        this.accountToEdit.idKey1 = credentialData.gw_public_ip;
        this.accountToEdit.idKey2 = credentialData.gw_private_ip;
        this.accountToEdit.idKey3 = credentialData.admin_username;
      } else if (account.type.toLowerCase().includes("arm")) {
        this.accountToEdit.provider = "iotarm";
        this.accountToEdit.idKey1 = credentialData.gw_public_ip;
        this.accountToEdit.idKey2 = credentialData.gw_private_ip;
        this.accountToEdit.idKey3 = credentialData.admin_username;
      }
      this.showEditAccountNameModal = true;
      this.$bvModal.show("bv-modal-editaccountnamemodal");
      this.providerOfccountToEdit = account.provider;
    },
    validateCredentialsList() {
      var allAccountsCount = this.allAccounts.length;
      var allAccountsToCheck = 0;
      while (allAccountsToCheck < allAccountsCount) {
        this.validateCredentials(this.allAccounts[allAccountsToCheck]);
        allAccountsToCheck++;
      }
    },
    provideLabelForNewAccount(provider) {
      let providersArray = [];
      let providersSummaryObjekt = [];
      for (let i = 0; i < this.allAccounts.length; i++) {
        providersArray[i] = this.allAccounts[i].type;
      }
      providersSummaryObjekt = providersArray.reduce(function (prev, cur) {
        prev[cur] = (prev[cur] || 0) + 1;
        return prev;
      }, {});
      let accountsCountOfProvider = 0;
      if (provider === "alicloud" && providersSummaryObjekt["ALICLOUD"]) {
        accountsCountOfProvider = providersSummaryObjekt["ALICLOUD"];
      } else if (provider === "aws" && providersSummaryObjekt["AWS"]) {
        accountsCountOfProvider = providersSummaryObjekt["AWS"];
      } else if (provider === "azure" && providersSummaryObjekt["AZURE"]) {
        accountsCountOfProvider = providersSummaryObjekt["AZURE"];
      } else if (provider === "google" && providersSummaryObjekt["google"]) {
        accountsCountOfProvider = providersSummaryObjekt["GCP"];
      } else if (
        provider === "openstack" &&
        providersSummaryObjekt["openstack"]
      ) {
        accountsCountOfProvider = providersSummaryObjekt["OPENSTACK"];
      } else if (provider === "onpremise" && providersSummaryObjekt["ONPREM"]) {
        accountsCountOfProvider = providersSummaryObjekt["ONPREM"];
      } else if (provider === "iotarm" && providersSummaryObjekt["IOTARM"]) {
        accountsCountOfProvider = providersSummaryObjekt["IOTARM"];
      }

      this.autoSuggestedLabel = provider + "-" + accountsCountOfProvider;

      while (this.allCurrentLabels.includes(this.autoSuggestedLabel)) {
        accountsCountOfProvider = accountsCountOfProvider + 1;
        this.autoSuggestedLabel = provider + "-" + accountsCountOfProvider;
      }
      return this.autoSuggestedLabel;
    },
    removeLabelfromListOfAllLabels(label) {
      function findIndexToRemove(labelToRemove) {
        return labelToRemove === label;
      }
      let indexToRemove = this.allCurrentLabels.findIndex(findIndexToRemove);
      this.allCurrentLabels.splice(indexToRemove, 1);
    },
  },
};
</script>