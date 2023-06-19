<template>
  <div>
    <div :class="{ 'card daiteap-content-card': !projectID }">
      <div
        class="d-flex justify-content-between cardHeaderLight"
        v-if="!projectID"
      >
        <span class="fa-stack landing-page-icon">
          <i class="fas fa-square fa-stack-2x" style="line-height: 1.5;"></i>
          <i class="fas fa-database fas fa-stack-1x fa-inverse" style="line-height: 3;"></i>
        </span>
        <CardTitle title="Storage" style="line-height: 2" />
        <span class="text-right h4 ml-auto">
          <AddButton
            text="Add New Bucket or Container"
            @onClickAddButton="addNewBucket"
          />
        </span>
      </div>
      <div v-else-if="projectID">
        <b-container fluid class="mx-0 px-0">
          <b-row>
            <b-col lg="8" md="6" sm="4" class="my-auto">
              <h5 class="pl-3 my-auto daiteap-title-left-bar">Storage</h5>
            </b-col>
            <b-col lg="2" md="3" sm="4" class="my-auto text-right"> </b-col>
            <b-col lg="2" md="3" sm="4" class="my-auto text-right">
              <AddButton
                v-if="projectID"
                text="Add New Bucket or Container"
                @onClickAddButton="addNewBucket"
              />
            </b-col>
          </b-row>
        </b-container>
      </div>
      <span v-if="!projectID">
        Access your AWS or Google Buckets and Azure Containers.
      </span>
      <hr v-if="!projectID" />
      <br v-if="projectID" />
      <div v-if="loading" class="d-flex justify-content-center">
        <div class="spinner-border" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
      <div v-else-if="buckets.length == 0">
        No buckets or containers available - please add bucket or container.
      </div>
      <StorageBuckets
        v-else
        :buckets="buckets"
        :projectID="projectID"
      />
    </div>
  </div>
</template>

<script>
import CardTitle from "@/components/platform/CardTitle";
import StorageBuckets from "@/components/platform/storage/StorageBuckets";
import AddButton from "@/components/platform/AddButton";

export default {
  name: "StorageOverall",
  components: {
    CardTitle,
    StorageBuckets,
    AddButton,
  },
  data() {
    return {
      buckets: [],
      loading: true,
      interval: "",
    };
  },
  props: {
    tenantID: String,
    projectID: String,
  },
  created() {
    this.getStorageBuckets();
  },
  mounted() {
    this.interval = setInterval(() => {
      this.getStorageBuckets();
    }, 5000);
  },
  destroyed() {
    clearInterval(this.interval);
  },
  methods: {
    async getStorageBuckets() {
      if (this.tenantID) {
        this.buckets = await this.getTenantBuckets(this.tenantID);
      } else if (this.projectID) {
        let buckets = await this.getBuckets();
        this.buckets = buckets.filter(
          (bucket) => bucket.project.id == this.projectID
        );
      } else {
        this.buckets = await this.getBuckets();
      }

      this.loading = false;
    },
    addNewBucket() {
      if (this.projectID) {
        this.$router.push({
          name: "AddNewBucket",
          params: {
            projectID: this.projectID,
          },
        });
      } else {
        this.$router.push({ name: "AddNewBucket" });
      }
    },
  },
};
</script>

<style scoped>
</style>