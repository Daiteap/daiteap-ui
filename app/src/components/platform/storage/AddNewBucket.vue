<template>
  <div>
    <div class="card daiteap-content-card">
      <div>
        <CardTitle title="Create Bucket or Container" />
      </div>

      <hr />
      <br />
      <br />
      <div>
        <h5>Choose Cloud Providers</h5>
      </div>
      <br />

      <WarningAlert v-if="showAlert" msg="This name is taken." color="warning" :key="alertKey"
        link="/documentation/storage/#bucket-naming-guidelines" />

      <b-card-group deck>
          <AddAwsBucket class="p-0" ref="awsBucket" @showAlert="changeShowAlert" @alertKey="changeAlertKey" :showAlert="showAlert"
            :awsProvided="awsProvided" :awsSelected="awsSelected" @selectCloud="selectCloud" />

          <AddAzureBucket class="p-0" ref="azureBucket" @showAlert="changeShowAlert" @alertKey="changeAlertKey"
            :showAlert="showAlert" :azureProvided="azureProvided" :azureSelected="azureSelected"
            @selectCloud="selectCloud" />
          <AddGoogleBucket class="p-0" ref="googleBucket" @showAlert="changeShowAlert" @alertKey="changeAlertKey"
            :showAlert="showAlert" :googleProvided="googleProvided" :googleSelected="googleSelected"
            @selectCloud="selectCloud" />

      </b-card-group>

      <div class="form-group mt-5">
        <div class="">
          <div :class="[!selectedProvider || saveDeactivated || savingBucket ? 'deactivated' : '']"
            class="custom-button float-right ml-5" @click="saveBucket()">
            Save
          </div>
          <div class="custom-button float-right mr-5" @click="cancelBtn()">
            Cancel
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CardTitle from "@/components/platform/CardTitle";
import AddGoogleBucket from "@/components/platform/storage/AddGoogleBucket";
import AddAwsBucket from "@/components/platform/storage/AddAwsBucket";
import AddAzureBucket from "@/components/platform/storage/AddAzureBucket";
import WarningAlert from "@/components/platform/WarningAlert";

export default {
  name: "AddNewBucket",
  components: {
    CardTitle,
    AddGoogleBucket,
    AddAwsBucket,
    AddAzureBucket,
    WarningAlert,
  },
  data() {
    return {
      providers: [],
      selectedProvider: "",
      googleProvided: true,
      awsProvided: true,
      azureProvided: true,
      credentials: [],
      showAlert: false,
      alertKey: 0,
      savingBucket: false,
    };
  },
  props: {
    projectID: String,
  },
  computed: {
    saveDeactivated() {
      if (this.awsSelected && this.$refs.awsBucket.saveDeactivated) {
        return true;
      } else if (this.googleSelected && this.$refs.googleBucket.saveDeactivated) {
        return true;
      } else if (this.azureSelected && this.$refs.azureBucket.saveDeactivated) {
        return true;
      } else {
        return false;
      }
    },
    awsSaveDeactivated() {
      return this.$refs.awsBucket.saveDeactivated();
    },
    awsSelected() {
      return this.selectedProvider == "aws";
    },
    azureSelected() {
      return this.selectedProvider == "azure";
    },
    googleSelected() {
      return this.selectedProvider == "google";
    },
  },
  methods: {
    changeShowAlert(status) {
      this.showAlert = status;
    },
    changeAlertKey(key) {
      this.alertKey += key;
    },
    cancelBtn() {
      if (this.projectID) {
        this.$router.push({
          name: "ProjectDetails",
          params: {
            projectID: this.projectID,
          },
        });
      }
      this.$router.push({ name: "StorageOverall" });
    },
    async saveBucket() {
      this.savingBucket = true;
      if (this.selectedProvider == "aws") {
        await this.$refs.awsBucket.saveBucket();
      } else if (this.selectedProvider == "azure") {
        await this.$refs.azureBucket.saveBucket();
      } else if (this.selectedProvider == "google") {
        await this.$refs.googleBucket.saveBucket();
      }
      this.savingBucket = false;
    },
    selectCloud(provider) {
      this.showAlert = false;
      if (provider == "aws") {
        if (this.awsProvided) {
          this.selectedProvider = "aws";
        }
      } else if (provider == "azure") {
        if (this.azureProvided) {
          this.selectedProvider = "azure"
        }
      } else if (provider == "google") {
        if (this.googleProvided) {
          this.selectedProvider = "google"
        }
      }
    },
  },
  mounted() {
  },
};
</script>
