<template>
  <div class="row">
    <ServiceDetailsModal v-if="showServiceDetailsModal"
      :clusterID="serviceDetails.clusterID"
      :serviceName="serviceDetails.serviceName"
      :serviceServiceName="serviceDetails.serviceServiceName"
      :serviceNamespace="serviceDetails.serviceNamespace"
      :service_type="serviceDetails.service_type"
      :providers="serviceDetails.providers"
    ></ServiceDetailsModal>

    <div
      v-if="$parent.clusterType == 1 || $parent.clusterType == 3"
      class="card mb-4 w-100"
      id="services"
    >
      <div class="card-header py-3 cardHeaderLight">
        <h6 class="m-0 font-weight-bold">Installed Services:</h6>
        <span class="float-sm-right">
          <AddButton text='Add service' @onClickAddButton="$parent.goToMenuItem('store')" />
        </span>
      </div>
      <div class="card-body px-2 m-0 d-flex justify-content-center">
        <div v-if="$parent.loading" class="d-flex justify-content-center">
          <div class="spinner-border" role="status">
            <span class="sr-only">Loading...</span>
          </div>
        </div>

        <div v-else-if="$parent.cluster.serviceList.length === 0">
          <div>
            <h1 class="m-5">
              Add services to your cluster to see them here...
            </h1>
            <button
              class="btn btn-outline-success mb-5"
              @click="$parent.goToMenuItem('store')"
            >
              Go to service catalog
            </button>
          </div>
        </div>

        <div v-else class="row justify-content-start service">
          <div
            class="mb-3 px-0 mx-4"
            v-for="item in $parent.cluster.serviceList"
            :key="item.name"
          >
            <b-card-group deck>
              <b-card
                no-body
                :header="item.name"
                style="min-width: 18.35rem; max-width: 18.5rem; height: 25rem"
                class="mb-2 text-center mx-auto baseBlock"
              >
                <template #header class="custom">
                  <div class="h5 m-auto">
                    {{ item.service__name }}
                  </div>
                </template>
                <!-- <hr class="m-0" /> -->
                <b-card-body class="p-0 m-0">
                  <div class="logoWindow">
                    <img
                      class="logo"
                      :src="matchLogoToService(item.service__name)"
                    />
                  </div>
                  <!-- <hr class="p-0 m-0" /> -->
                  <div v-if="item.providers" class="providers d-flex px-3 justify-content-center">
                    <img
                      v-if="item.providers.toLowerCase().includes('alicloud')"
                      class="providerlogo"
                      src="../../../assets/img/alicloud_logo_small.png"
                      alt=""
                    />
                    <img
                      v-if="item.providers.toLowerCase().includes('azure')"
                      class="providerlogo"
                      src="../../../assets/img/azure_logo_small.png"
                      alt=""
                    />
                    <img
                      v-if="item.providers.toLowerCase().includes('amazon')"
                      class="providerlogo"
                      src="../../../assets/img/aws_logo_small.png"
                      alt=""
                    />
                    <img
                      v-if="item.providers.toLowerCase().includes('google')"
                      class="providerlogo"
                      src="../../../assets/img/googleCloud_logo_small.png"
                      alt=""
                    />
                    <img
                      v-if="item.providers.toLowerCase().includes('premise')"
                      class="providerlogo"
                      src="../../../assets/img/onpremise.svg"
                      alt=""
                    />
                    <img
                      v-if="item.providers.toLowerCase().includes('arm')"
                      class="providerlogo"
                      src="../../../assets/img/IoTArm_logo_small.svg"
                      alt=""
                    />
                  </div>

                  <!-- <hr class="p-0 m-0"/> -->
                  <b-card-text class="py-2 px-3 px-1 text-left">
                    <span
                      v-if="item.name"
                      class="d-flex justify-content-between">
                      Name: <b>{{ item.name }}</b></span
                    >
                    <span
                      v-if="item.namespace"
                      class="d-flex justify-content-between">
                      Namespace: <b>{{ item.namespace }}</b></span
                    >
                    <span
                      v-if="item.service_type"
                      class="d-flex justify-content-between">
                      Service Type: <b>{{ item.service_type }}</b></span
                    >
                    <span
                      v-if="item.publicIP"
                      class="d-flex justify-content-between"
                    >
                      Public IP: <b>{{ item.publicIP }}</b></span
                    >
                    <span class="d-flex justify-content-between">
                      Status:
                      <b :class="serviceStatusTextDecoration(item.status)">{{
                        serviceStatus(item.status)
                      }}</b></span
                    >
                  </b-card-text>
                </b-card-body>

                <template #footer>
                  <b-button
                    class="btn btn-outline-success mx-4 col-6 mx-auto"
                    @click="goToServiceDetailsModal(item)"
                    >Details</b-button
                  >
                </template>
              </b-card>
            </b-card-group>
          </div>
        </div>
      </div>
    </div>
    <br />
  </div>
</template>

<script>
import axios from "axios";
import ServiceDetailsModal from "@/components/platform/popup_modals/ServiceDetailsModal";
import AddButton from "@/components/platform/AddButton"

export default {
  name: 'ClusterServices',
  components: {
    ServiceDetailsModal,
    AddButton,
  },
  data() {
    return {
      serviceStoreList: [],
      showServiceDetailsModal: false,
      serviceDetails: {
        clusterID: "",
        serviceName: "",
        serviceServiceName: "",
        serviceNamespace: "",
        service_type: "",
        providers: "",
      },
    };
  },
  mounted() {
    this.getServicesList(this);
  },
  methods: {
    getServicesList(currentObject) {
      let self = currentObject;
      axios
        .get("/server/services", this.get_axiosConfig())
        .then(function (response) {
          self.serviceStoreList = [];
          for (let i = 0; i < response.data.serviceList.length; i++) {
            self.serviceStoreList.push({
              name: response.data.serviceList[i].name,
              description: response.data.serviceList[i].description,
              logo_url: response.data.serviceList[i].logo_url,
            });
          }
          self.loadingSrvices = false;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    matchLogoToService(service) {
      let logo_url = "";
      for (let i = 0; i < this.serviceStoreList.length; i++) {
        if (this.serviceStoreList[i].name === service) {
          logo_url = this.serviceStoreList[i].logo_url;
        }
      }
      return logo_url;
    },
    serviceStatus(status) {
      let statusDescription = "";
      if (status == 1) {
        statusDescription = "Deploying";
      } else if (status == -1) {
        statusDescription = "Error Deploying";
      } else if (status == 10) {
        statusDescription = "Deleting";
      } else if (status == -10) {
        statusDescription = "Error Deleting";
      } else if (status == 0) {
        statusDescription = "Installed";
      }
      return statusDescription;
    },
    serviceStatusTextDecoration(status) {
      let statusDescription = "";
      if (status == 1) {
        statusDescription = "text-info";
      } else if (status == -1) {
        statusDescription = "text-danger";
      } else if (status == 10) {
        statusDescription = "text-warning";
      } else if (status == -10) {
        statusDescription = "text-danger";
      } else {
        statusDescription = "text-secondary";
      }
      return statusDescription;
    },
    goToServiceDetailsModal(service) {
      for (let i = 0; i < window.intervals.length; i++) {
        clearInterval(window.intervals[i]);
      }
      this.$router.push({
        name: "ServiceDetails",
        params: {
          clusterID: this.$parent.clusterID,
          serviceName: service.name,
          serviceServiceName: service.service__name,
          serviceNamespace: service.namespace,
          service_type: service.service_type,
          providers: service.providers,
        },
      });
    },
    goToServiceDetailsModsal(service) {
      this.serviceDetails.clusterID = this.$parent.clusterID;
      this.serviceDetails.serviceName = service.name;
      this.serviceDetails.serviceServiceName = service.service__name;
      this.serviceDetails.serviceNamespace = service.namespace;
      this.serviceDetails.service_type = service.service_type;
      this.serviceDetails.providers = service.providers;
      this.showServiceDetailsModal = true;
      this.$bvModal.show("bv-modal-servicedetailsmodal");
    },
  },
};
</script>

<style scoped>
a:not([href]):not([tabindex]) {
  color: #4e73df;
  text-decoration: none;
  cursor: pointer;
}

a:not([href]):not([tabindex]):hover {
  color: #224abe;
  text-decoration: underline;
  cursor: pointer;
}

.fa-user-plus {
  color: #000;
}

.fa-server {
  color: #000;
}

.card-header {
  display: block;
}

.card-header > h6 {
  display: inline-block;
}
* {
  white-space: inherit;
}

.row {
  display: flex;
  width: 100%;
  align-items: stretch;
}
.sidebar {
  position: fixed;
  padding-left: 1rem;
  margin-left: 1rem;
  top: 5rem;
}
.btn-muted.btn-muted.btn-muted {
  color: rgb(94, 94, 94);
}
.hoverPointer {
  cursor: pointer;
}

.service .card-header {
  background-color: white;
  border: none;
}
.card-footer {
  background-color: white;
  border: none;
}
.logoWindow {
  height: 6rem;
}

.logo {
  object-fit: cover;
  max-height: 5.6rem;
  max-width: 10rem;
  position: relative;
  top: 50%;
  -webkit-transform: translateY(-50%);
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
}
.baseBlock {
  -moz-transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
  -o-transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
  transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.baseBlock:hover {
  -webkit-transform: translate(0, 2px);
  -moz-transform: translate(0, 2px);
  -ms-transform: translate(0, 2px);
  -o-transform: translate(0, 2px);
  transform: translate(0, 2px);
  box-shadow: 0 10px 10px rgba(0, 0, 0, 0.2);
}
.providerlogo {
  object-fit: cover;
  max-height: 2rem;
  max-width: 4rem;
  padding: 4px;
}
b {
  word-break: break-all;
}
.cardHeaderLight {
  background-color: #fff;
  color: #1d1e22;
  border-bottom: #eaebed 2px solid;
  border: #d1d1d1 1px solid;
}
.card-body {
  border: #00708c10 1px solid;
  border-top: none;
  border-bottom: none;
}
.card-text {
  border: none;
}
</style>
