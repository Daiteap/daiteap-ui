<template>
  <div data-app>
    <div class="card daiteap-content-card">
      <div class="d-flex justify-content-between cardHeaderLight">
        <span class="fa-stack landing-page-icon">
          <i class="fas fa-square fa-stack-2x"></i>
          <i class="fas fa-database fas fa-stack-1x fa-inverse"></i>
        </span>
        <CardTitle title="Storage" />
        <span class="text-right h4 ml-auto" />
      </div>
      <span>
        <br />
        Access your AWS or Google Buckets and Azure Containers.
      </span>
      <hr />
      <br />

      <div>
        <h5>Details: {{ bucket.name }}</h5>
        <h5>Cloud: {{ bucket.provider }}</h5>
        <h5>Project: {{ bucket.project.name }}</h5>
        <h5>Credential: {{ bucket.credential.label }}</h5>
        <h5>Created At: {{ bucket.created_at | FormatDateFilter }}</h5>
        <h5 v-if="details.storage_class">
          Storage Class: {{ details.storage_class }}
        </h5>
        <h5 v-if="details.location_type">
          Location Type: {{ details.location_type }}
        </h5>
        <h5 v-if="details.location">
          Location:
          <span v-if="bucket.provider == 'aws'">
            {{
              computed_aws_bucket_locations.filter(
                (loc) => loc.name == details.location
              )[0].description
            }}
          </span>
          <span
            v-if="
              bucket.provider == 'google' &&
              details.location_type == 'multi-region'
            "
          >
            {{
              computed_google_bucket_locations.multiRegion.filter(
                (loc) => loc.name == details.location
              )[0].description
            }}
          </span>
          <span
            v-if="
              bucket.provider == 'google' &&
              details.location_type == 'dual-region'
            "
          >
            {{
              computed_google_bucket_locations.dualRegion.filter((loc) =>
                details.location.includes(loc.name)
              )[0].description
            }}
            and
            {{
              computed_google_bucket_locations.dualRegion.filter((loc) =>
                details.location.includes(loc.name)
              )[1].description
            }}
          </span>
          <span
            v-if="
              bucket.provider == 'google' && details.location_type == 'region'
            "
          >
            {{
              computed_google_bucket_locations.region.filter(
                (loc) => loc.name == details.location
              )[0].description
            }}
          </span>
        </h5>
        <h5 v-if="bucket.provider == 'azure'">
          Storage Account:
          {{
            bucket.storage_account
              .replace("https://", "")
              .replace(".blob.core.windows.net/", "")
          }}
        </h5>
        <hr />
      </div>

      <FileBrowser :bucket="bucket" :tree="false" />
    </div>
  </div>
</template>

<script>
import FileBrowser from "@/components/platform/fileManager/FileBrowser";
import CardTitle from "@/components/platform/CardTitle";

export default {
  name: "BucketDetails",
  components: {
    FileBrowser,
    CardTitle,
  },
  props: {
    bucket: Object,
  },
  data() {
    return {
      details: {},
      interval: "",
    };
  },
  created() {
    this.getDetails();
  },
  mounted() {
    this.interval = setInterval(() => {
      this.getDetails();
    }, 5000);
  },
  destroyed() {
    clearInterval(this.interval);
  },
  methods: {
    async getDetails() {
      this.details = await this.getBucketDetails(this.bucket.id);
    },
  },
};
</script>

<style scoped>
</style>