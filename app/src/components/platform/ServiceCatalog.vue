<template>
  <div>
    <div v-if="loading" class="card daiteap-content-card">
      <div class="d-flex justify-content-center">
        <div class="spinner-border" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
    </div>
    <div
      class="card daiteap-content-card"
      id="services"
    >
      <div class="d-flex justify-content-between cardHeaderLight">
        <span class="fa-stack landing-page-icon">
          <i class="fas fa-square fa-stack-2x" style="line-height: 1.5;"></i>
          <i class="fas fa-shopping-basket fas fa-stack-1x fa-inverse" style="line-height: 3;"></i>
        </span>
        <CardTitle title="Service Catalog"  style="line-height: 2;"/>
        <div class="ml-auto col-6 d-flex justify-content-end align-items-center">
          <p class="m-0 pr-2">Search in services:</p>
          <input v-model="serchQuery" type="text" style="background-color:LightGray; border: 1px solid black;"/>
        </div>
      </div>
      <hr />
      <div class="card-body px-0 m-0">
        <AddService
          ref="addServiceComponent"
          :clusterID="clusterID"
        ></AddService>
      </div>
    </div>
    <br />
  </div>
</template>

<script>
import AddService from "@/components/platform/AddService.vue";
import CardTitle from "@/components/platform/CardTitle";

export default {
  name: 'ServiceCatalog',
  components: {
    AddService,
    CardTitle,
  },
  data() {
    return {
      serchQuery: "",
    };
  },
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    clusterID: {
      type: String,
      default: ""
    },
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
