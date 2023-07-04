<template>
  <b-card v-if="
    computed_account_settings.providers_enable_azure
  " no-body @click="$emit('selectCloud', 'azure')" class="user-select-none m-3"
    :class="azureProvided ? 'custom-card' : 'custom-card-disabled'">
    <div>
      <img src="../../../assets/img/azure_logo_small.png" height="60rem" alt="Image" class="p-2 m-2" />
      <div class="my-3 ml-5 float-right m-3 customRadio" :class="{ checked: azureSelected, disabled: !azureProvided }"
        style="vertical-align: middle">
        <span v-if="azureSelected" class="fas fa-check radioCheckmark"></span>
      </div>
    </div>

    <div class="m-3">Microsoft Azure Cloud</div>

    <div v-on:click.stop="" style="cursor: initial">
      <div class="m-3"> Project: * </div>
      <div class="m-3">
        <select :disabled="!(azureSelected)" class="custom-select d-block w-100" v-model="project_id">
          <option v-for="item in projects" :key="item.id" :value="item.id">
            {{ item.name }}
          </option>
        </select>
      </div>
    </div>

    <div v-on:click.stop="" style="cursor: initial">
      <div class="m-3"> Cloud Credentials: * </div>
      <div class="m-3">
        <select :disabled="!(azureSelected)" class="custom-select d-block w-100" v-model="credential_id">
          <option v-for="item in credentials" :key="item.id" :value="item.id">
            {{ item.label }}
          </option>
        </select>
      </div>
    </div>

    <div v-on:click.stop="" style="cursor: initial">
      <div class="m-3"> Container Name: * </div>
      <div class="m-3">
        <input required :disabled="!(azureSelected)" autocomplete="off" v-model="bucketName" class="form-control input"
          type="text" />
      </div>
      <div class="">
        <p v-if="azureSelected && bucketName != '' && v$.bucketName.$invalid" class="m-3 help text-danger">
          Invalid Container Name
        </p>
        <div v-else></div>
      </div>
    </div>

    <div v-on:click.stop="" style="cursor: initial">
      <div class="m-3">Description:</div>
      <div class="m-3">
        <b-form-textarea
          v-model="description"
          :disabled="!azureSelected"
          class="form-control input"
        ></b-form-textarea>
      </div>
      <div class="">
        <p
          v-if="azureSelected && v$.description.$invalid"
          class="m-3 help text-danger"
        >
          Invalid Description
        </p>
        <div v-else></div>
      </div>
    </div>

    <div v-on:click.stop="" style="cursor: initial">
      <div class="m-3"> Storage Account: * </div>
      <div class="m-3">
        <select :disabled="!(azureSelected)" class="custom-select d-block w-100" v-model="storageAccount">
          <option v-for="item in storageAccounts.filter(
            (acc) => acc.credential_id == credential_id
          )" :key="item.name" :value="item.name">
            {{ item.name }}
          </option>
        </select>
        <div class="">
          <p v-if="
            azureSelected &&
            credential_id &&
            storageAccounts.filter(
              (acc) => acc.credential_id == credential_id
            ).length == 0
          " class="help text-danger">
            No Storage Accounts were found with this credential
          </p>
          <div v-else><br /></div>
          <div class="m-3">
          </div>

        </div>
      </div>
    </div>
  </b-card>
</template>

<script>
import {useVuelidate} from "@vuelidate/core";
import { minLength, maxLength, helpers, required } from "@vuelidate/validators";

const bucketNameValidation = function (value) {
  let previousDash = false;
  for (let i = 0; i < value.length; i++) {
    if (value[i] >= "A" && value[i] <= "Z") {
      return false;
    }
    if (value[i] == "-") {
      if (previousDash) {
        return false;
      }
      previousDash = true;
    } else {
      previousDash = false;
    }
  }
  if (value[0] == "-" || value[value.length - 1] == "-") {
    return false;
  }
  return true;
};
const nameSymbolsValidation = helpers.regex(
  "nameSymbolsValidation",
  /^[a-z\d-]*$/i
);

export default {
  name: "AddAzureBucket",
  data() {
    return {
      v$: useVuelidate(),
      credentials: [],
      credential_id: "",
      projects: [],
      project_id: "",
      bucketName: "",
      storageAccounts: [],
      storageAccount: "",
      description: "",
    };
  },
  props: {
    projectID: String,
    azureProvided: Boolean,
    azureSelected: Boolean,
  },
  mounted() {
    this.getCloudCredentials();
    this.getUserProjects();
  },
  computed: {
    saveDeactivated() {
      return this.v$.bucketName.$invalid || this.credential_id == '' || this.project_id == '' || this.storageAccount == '';
    }
  },
  methods: {
    async getCloudCredentials() {
      let credentials = await this.getCredentials();

      this.credentials = credentials.filter(
        (credential) => credential.valid == true && credential.provider == "azure"
      );
      if (this.credentials.length > 0) {
        this.credential_id = this.credentials[0].id;
      }

      for (let i = 0; i < this.credentials.length; i++) {
        this.getStorageAccounts(this.credentials[i].id);
      }
    },
    async getUserProjects() {
      this.projects = await this.getProjects();

      if (this.projectID) {
        this.project_id = this.projectID;
      } else if (this.projects.length > 0) {
        this.project_id = this.projects[0].id;
      }
    },
    getStorageAccounts(credentialID) {
      let self = this;

      this.axios
        .get(
          "/server/tenants/" +
            this.computed_active_tenant_id +
            "/cloud-credentials/" +
            credentialID +
            "/storage-accounts",
          this.get_axiosConfig()
        )
        .then(function (response) {
          self.storageAccounts.push(...response.data.storage_accounts);
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
              title: "Message:",
              text: "Error while getting storage accounts.",
            });
          }
        });
    },
    saveBucket() {
      let self = this;
      let request = {
        provider: "azure",
        credential: this.credential_id,
        project: this.project_id,
        name: this.bucketName,
        storage_account:
          "https://" + this.storageAccount + ".blob.core.windows.net/",
        description: this.description,
      };

      return this.axios
        .post(
          "/server/tenants/" + this.computed_active_tenant_id + "/buckets",
          request,
          this.get_axiosConfig()
        )
        .then(function () {
          self.$notify({
            group: "msg",
            type: "success",
            title: "Message:",
            text: "Successfully created container!",
          });

          self.cancelBtn();
        })
        .catch(function (error) {
          if (error.response.data.error == "Bucket name taken.") {
            self.$emit("showAlert", true)
            self.$emit("alertKey", 1)
          } else {
            self.$emit("showAlert", false)
            self.$emit("alertKey", 1)
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
                title: "Message:",
                text: "Error while creating container.",
              });
            }
          }
        });
    },
    cancelBtn() {
      if (this.projectID) {
        this.$router.push({
          name: "ProjectDetails",
          params: {
            projectID: this.projectID,
          },
        });
      } else if (this.projects.length > 0) {
        this.$router.push({ name: "StorageOverall" });
      }
    },
  },
  validations: {
    bucketName: {
      required,
      minLength: minLength(3),
      maxLength: maxLength(63),
      nameSymbolsValidation,
      bucketNameValidation,
    },
    description: {
      maxLength: maxLength(1024),
    },
  },
};
</script>

<style scoped>
.form-group {
  margin: auto;
}

.btn {
  width: 10rem;
}

.btn-primary {
  width: 100%;
}

.form-control:disabled {
  color: #bcbcbc;
  background-color: #f0f1f2;
  border: 1px solid #d0d0d0;
}

.card {
  min-width: 15rem;
}
</style>