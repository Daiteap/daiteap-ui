<template>
  <b-card v-if="
    computed_account_settings.providers_enable_gcp
  " no-body @click="$emit('selectCloud', 'google')" class="user-select-none m-3"
    :class="googleProvided ? 'custom-card' : 'custom-card-disabled'">
    <div>
      <img src="../../../assets/img/googleCloud_logo_small.png" height="60rem" alt="Image" class="p-2 m-2" />
      <div class="my-3 ml-5 float-right m-3 customRadio" :class="{ checked: googleSelected, disabled: !googleProvided }"
        style="vertical-align: middle">
        <span v-if="googleSelected" class="fas fa-check radioCheckmark"></span>
      </div>
    </div>

    <div class="m-3">Google Cloud Platform</div>

    <div v-on:click.stop="" style="cursor: initial">
      <div class="m-3"> Project: * </div>
      <div class="m-3">
        <select class="custom-select d-block w-100" v-model="project_id" :disabled="!(googleSelected)">
          <option v-for="item in projects" :key="item.id" :value="item.id">
            {{ item.name }}
          </option>
        </select>
      </div>
    </div>

    <div v-on:click.stop="" style="cursor: initial">
      <div class="m-3"> Cloud Credentials: * </div>
      <div class="m-3">
        <select class="custom-select d-block w-100" v-model="credential_id" :disabled="!(googleSelected)">
          <option v-for="item in credentials" :key="item.id" :value="item.id">
            {{ item.label }}
          </option>
        </select>
      </div>
    </div>

    <div v-on:click.stop="" style="cursor: initial">
      <div class="m-3"> Bucket Name: * </div>
      <div class="m-3">
        <input required autocomplete="off" :disabled="!(googleSelected)" v-model="bucketName" class="form-control input"
          type="text" />
      </div>
      <div class="">
        <p v-if="googleSelected && bucketName != '' && $v.bucketName.$invalid" class="m-3 help text-danger">
          Invalid Bucket Name
        </p>
        <div v-else></div>
      </div>
    </div>

    <div v-on:click.stop="" style="cursor: initial">
      <div class="m-3"> Storage Class: * </div>
      <div class="m-3">
        <select class="custom-select d-block w-100" v-model="storage_class" :disabled="!(googleSelected)">
          <option v-for="item in storage_classes" :key="item" :value="item">
            {{ item }}
          </option>
        </select>
      </div>
    </div>

    <div v-on:click.stop="" style="cursor: initial">
      <div class="m-3"> Location: * </div>
      <div class="m-3">
        <div class="container">
          <div class="row">
            <div class="col-xl m-0 p-0">
              <input id="location-multi-region" :disabled="!(googleSelected)" class="mr-1" type="radio"
                name="location_type" value="Multi-region" checked @change="getLocationType" />
              <label for="location-multi-region">Multi-region</label>
            </div>
            <div class="col-xl m-0 p-0">
              <input id="location-dual-region" :disabled="!(googleSelected)" class="mr-1" type="radio"
                name="location_type" value="Dual-region" @change="getLocationType" />
              <label for="location-dual-region">Dual-region</label>
            </div>
            <div class="col-xl m-0 p-1">
              <input id="location-region" :disabled="!(googleSelected)" class="mr-1" type="radio" name="location_type"
                value="Region" @change="getLocationType" />
              <label for="location-region">Region</label>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div v-on:click.stop="" style="cursor: initial" v-if="location_type == 'Multi-region'">
          <div class="m-3">
            <select class="custom-select d-block w-100" v-model="location" :disabled="!(googleSelected)">
              <option v-for="item in locations.multiRegion" :key="item.name" :value="item.name">
                {{ item.description }}
              </option>
            </select>
          </div>
        </div>

        <div v-on:click.stop="" style="cursor: initial" v-if="location_type == 'Dual-region'">
          <div class="m-3">
            <select class="custom-select d-block w-100" v-model="continent" :disabled="!(googleSelected)">
              <option v-for="item in locations.continents" :key="item" :value="item">
                {{ item }}
              </option>
            </select>
            <br />
          </div>
        </div>

        <div v-on:click.stop="" style="cursor: initial" v-if="location_type == 'Dual-region'">
          <div class="m-3">
            <select class="custom-select d-block w-100" v-model="location" :disabled="!(googleSelected)">
              <option v-for="item in locations.dualRegion.filter(
                (loc) => loc.continent == continent && loc.name != location2
              )" :key="item.name" :value="item.name">
                {{ item.description }}
              </option>
            </select>
            <div class="">
              <p v-if="location == ''" class="help text-secondary">

              </p>
              <div v-else><br /></div>
            </div>
          </div>
        </div>

        <div v-on:click.stop="" style="cursor: initial" v-if="location_type == 'Dual-region'">
          <div class="m-3">
            <select class="custom-select d-block w-100" v-model="location2" :disabled="!(googleSelected)">
              <option v-for="item in locations.dualRegion.filter(
                (loc) => loc.continent == continent && loc.name != location
              )" :key="item.name" :value="item.name">
                {{ item.description }}
              </option>
            </select>
            <div class="">
              <p v-if="location2 === ''" class="help text-secondary">

              </p>
              <div v-else><br /></div>
            </div>
          </div>
        </div>

        <div v-on:click.stop="" style="cursor: initial" v-if="location_type == 'Region'">
          <div class="m-3">
            <select class="custom-select d-block w-100" v-model="location" :disabled="!(googleSelected)">
              <option v-for="item in locations.region" :key="item.name" :value="item.name">
                {{ item.description }}
              </option>
            </select>
          </div>
        </div>
      </div>
      <br />
    </div>
  </b-card>
</template>

<script>
import WarningAlert from "@/components/platform/WarningAlert";
import { validationMixin } from "vuelidate";
import {
  required,
  minLength,
  helpers,
} from "vuelidate/lib/validators";

const bucketNameValidation = function (value) {
  if (value.length > 63 && !value.includes(".")) {
    return false;
  }
  if (value.length > 63 && value.includes(".") && value.length > 222) {
    return false;
  }
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
  if (value[0] == "." || value[0] == "-" || value[0] == "_") {
    return false;
  }
  if (
    value[value.length - 1] == "." ||
    value[value.length - 1] == "-" ||
    value[value.length - 1] == "_"
  ) {
    return false;
  }
  if (value.slice(0, 4) == "goog") {
    return false;
  }
  if (value.includes("google") || value.includes("g00gle")) {
    return false;
  }
  let dotSeparated = value.split(".");
  for (let i = 0; i < dotSeparated.length; i++) {
    if (dotSeparated[i].length > 63) {
      return false;
    }
  }
  return true;
};
const nameSymbolsValidation = helpers.regex(
  "nameSymbolsValidation",
  /^[a-z\d._-]*$/i
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
  name: "AddGoogleBucket",
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
      storage_classes: ["STANDARD", "NEARLINE", "COLDLINE", "ARCHIVE"],
      storage_class: "STANDARD",
      location_type: "Multi-region",
      locations: {},
      location: "",
      location2: "",
      continent: "North America",
    };
  },
  props: {
    projectID: String,
    googleProvided: Boolean,
    googleSelected: Boolean,
  },
  mounted() {
    this.getCloudCredentials();
    this.getUserProjects();
    this.locations = this.computed_google_bucket_locations;
    this.location = this.locations.multiRegion[0].name;
  },
  computed: {
    saveDeactivated() {
      return this.$v.bucketName.$invalid || this.credential_id == '' || this.project_id == '' || this.location == '' || (this.location_type == 'Dual-region' && this.location2 == '');
    }
  },
  methods: {
    async getCloudCredentials() {
      let credentials = await this.getCredentials();

      this.credentials = credentials.filter(
        (credential) => credential.valid == true && credential.provider == "google"
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
    getLocationType() {
      var buttons = document.getElementsByName("location_type");
      for (let i = 0; i < buttons.length; i++) {
        if (buttons[i].checked) {
          this.location_type = buttons[i].value;
          if (this.location_type == "Multi-region") {
            this.location = this.locations.multiRegion[0].name;
          } else if (this.location_type == "Dual-region") {
            this.location = "";
            this.location2 = "";
          } else if (this.location_type == "Region") {
            this.location = this.locations.region[0].name;
          }
        }
      }
    },
    saveBucket() {
      let self = this;
      let request = {
        provider: "google",
        credential: this.credential_id,
        project: this.project_id,
        name: this.bucketName,
        storage_class: this.storage_class,
        bucket_location: this.location,
      };

      if (this.location_type == "Dual-region") {
        request.bucket_location = this.location + "+" + this.location2;
      }

      return this.axios
        .post("/server/buckets", request, this.get_axiosConfig())
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
            self.$notify({
              group: "msg",
              type: "error",
              title: "Message:",
              text: "Error while creating bucket.",
            });
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
      nameSymbolsValidation,
      bucketNameValidation,
      notIPAddress,
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
