<template>
  <b-card v-if="
    computed_account_settings.providers_enable_aws
  " no-body @click="$emit('selectCloud', 'aws')" class="user-select-none m-3"
    :class="awsProvided ? 'custom-card' : 'custom-card-disabled'">
    <div>
      <img src="../../../assets/img/aws_logo_small.png" height="60rem" alt="Image" class="p-2 m-2" />
      <div class="my-3 ml-5 float-right m-3 customRadio" :class="{ checked: awsSelected, disabled: !awsProvided }"
        style="vertical-align: middle">
        <span v-if="awsSelected" class="fas fa-check radioCheckmark"></span>
      </div>
    </div>

    <div class="m-3">Amazon Web Services</div>

    <div v-on:click.stop="" style="cursor: initial">
      <div class="m-3">Project: * </div>
      <div class="m-3">
        <select class="custom-select" :disabled="!(awsSelected)" v-model="project_id">
          <option v-for="item in projects" :key="item.id" :value="item.id">
            {{ item.name }}
          </option>
        </select>
      </div>
    </div>

    <div v-on:click.stop="" style="cursor: initial">
      <div class="m-3">Cloud Credentials: * </div>
      <div class="m-3">
        <select class="custom-select" :disabled="!(awsSelected)" v-model="credential_id">
          <option v-for="item in credentials" :key="item.id" :value="item.id">
            {{ item.label }}
          </option>
        </select>
      </div>
    </div>

    <div v-on:click.stop="" style="cursor: initial">
      <div class="m-3"> Bucket Name: * </div>
      <div class="m-3">
        <input required autocomplete="off" :disabled="!(awsSelected)" v-model="bucketName" class="form-control input"
          type="text" />
      </div>
      <div class="">
        <p v-if="awsSelected && bucketName != '' && $v.bucketName.$invalid" class="m-3 help text-danger">
          Invalid Bucket Name
        </p>
        <div v-else></div>
      </div>
    </div>

    <div v-on:click.stop="" style="cursor: initial">
      <div class="m-3">Description:</div>
      <div class="m-3">
        <b-form-textarea
          v-model="description"
          :disabled="!awsSelected"
          class="form-control input"
        ></b-form-textarea>
      </div>
      <div class="">
        <p
          v-if="awsSelected && $v.description.$invalid"
          class="m-3 help text-danger"
        >
          Invalid Description
        </p>
        <div v-else></div>
      </div>
    </div>

    <div v-on:click.stop="" style="cursor: initial">
      <div class="m-3">Location: * </div>
      <div class="m-3">
        <select class="custom-select" :disabled="!(awsSelected)" v-model="location">
          <option v-for="item in locations" :key="item.name" :value="item.name">
            {{ item.description }}
          </option>
        </select>
      </div>
    </div>
  </b-card>

</template>

<script>
import WarningAlert from "@/components/platform/WarningAlert";
import { validationMixin } from "vuelidate";
import {
  required,
  minLength,
  maxLength,
  helpers,
} from "vuelidate/lib/validators";

const bucketNameValidation = function (value) {
  let previousDot = false;
  for (let i = 0; i < value.length; i++) {
    if (value[i] >= "A" && value[i] <= "Z") {
      return false;
    }
    if (value[i] == ".") {
      if (previousDot) {
        return false;
      }
      previousDot = true;
    } else {
      previousDot = false;
    }
  }
  if (value[0] == "." || value[0] == "-") {
    return false;
  }
  if (value[value.length - 1] == "." || value[value.length - 1] == "-") {
    return false;
  }
  if (value.slice(0, 4) == "xn--") {
    return false;
  }
  if (value.slice(value.length - 8, value.length) == "-s3alias") {
    return false;
  }
  return true;
};
const nameSymbolsValidation = helpers.regex(
  "nameSymbolsValidation",
  /^[a-z\d.-]*$/i
);
function notIPAddress(value) {
  if (
    /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
      value
    )
  ) {
    return false;
  }
  return true;
}

export default {
  name: "AddAwsBucket",
  components: {
    WarningAlert,
  },
  data() {
    return {
      credentials: [],
      credential_id: "",
      projects: [],
      project_id: "",
      bucketName: "",
      locations: [],
      location: "",
      description: "",
    };
  },
  props: {
    projectID: String,
    awsProvided: Boolean,
    awsSelected: Boolean,
  },
  mounted() {
    this.getCloudCredentials();
    this.getUserProjects();
    this.locations = this.computed_aws_bucket_locations;
    this.location = this.locations[0].name;
  },
  computed: {
    saveDeactivated() {
      return this.$v.bucketName.$invalid || this.credential_id == '' || this.project_id == '';
    }
  },
  methods: {
    async getCloudCredentials() {
      let credentials = await this.getCredentials();

      this.credentials = credentials.filter(
        (credential) => credential.valid == true && credential.provider == "aws"
      );
      if (this.credentials.length > 0) {
        this.credential_id = this.credentials[0].id;
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
    saveBucket() {
      let self = this;
      let request = {
        provider: "aws",
        credential: this.credential_id,
        project: this.project_id,
        name: this.bucketName,
        bucket_location: this.location,
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
            text: "Successfully created bucket!",
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
                text: "Error while creating bucket.",
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
  mixins: [validationMixin],
  validations: {
    bucketName: {
      required,
      minLength: minLength(3),
      maxLength: maxLength(63),
      nameSymbolsValidation,
      bucketNameValidation,
      notIPAddress,
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