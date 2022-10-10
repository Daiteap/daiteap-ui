<template>
  <div>
    <div v-if="$parent.loading" class="card daiteap-content-card">
      <div class="d-flex justify-content-center">
        <div class="spinner-border" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
    </div>
    <div
      v-if="$parent.clusterType == 1 || $parent.clusterType == 3"
      class="card daiteap-content-card"
      id="services"
    >
      <div class="d-flex justify-content-between cardHeaderLight">
        <CardTitle title="Services Catalog" />
        <div class="col-6 d-flex justify-content-end align-items-center">
          <p class="m-0 pr-2">Search in services:</p>
          <input v-model="serchQuery" type="text" />
        </div>
      </div>
      <div class="card-body px-0 m-0">
        <AddService ref="addServiceComponent"></AddService>
      </div>
    </div>
    <br />
  </div>
</template>

<script>
import AddService from "../AddService.vue";
import CardTitle from "@/components/platform/CardTitle";

export default {
  name: 'ClusterServicesStore',
  components: {
    AddService,
    CardTitle,
  },
  data() {
    return {
      serchQuery: "",
    };
  },
  methods: {},
  beforeUpdate() {
    if (this.$refs.addServiceComponent) {
      this.$refs.addServiceComponent.serchQuery = this.serchQuery;
    }
  },
};
</script>

<style scoped>
</style>
