<template>
  <b-card
    no-body
    class="col-auto overflow-hidden mb-2 mx-1"
    style="min-width: 340px; max-width: 340px"
    v-if="
      cluster.machinesList.filter((el) => el.provider === provider).length > 0
    "
  >
    <b-row no-gutters>
      <b-col sm="12" md="4">
        <b-img
          :src="providerLogo"
          height="60rem"
          alt="Image"
          class="py-2 my-2"
        />
      </b-col>
      <b-col sm="12" md="8">
        <b-card-text class="py-2 my-2">
          <div v-if="isCompute">
            <div>
              VMs:
              {{
                cluster.machinesList.filter(function (el) {
                  return el.provider === provider;
                }).length
              }}
            </div>
          </div>
          <div v-else>
            <div>
              Control plane nodes:
              {{
                cluster.machinesList.filter(function (el) {
                  return el.provider === provider && el.kube_master === true;
                }).length
              }}
            </div>
            <div>
              Worker nodes:
              {{
                cluster.machinesList.filter(function (el) {
                  return el.provider === provider && el.kube_master !== true;
                }).length
              }}
            </div>
          </div>
        </b-card-text>
      </b-col>
    </b-row>
    <b-row no-gutters>
      <b-col md="12">
        <b-card-text class="px-0 pb-2 mx-0">
          <div>
            {{
              cluster.machinesList
                .filter(function (el) {
                  return el.provider === provider;
                })
                .reduce(function (acc, cur) {
                  return acc + cur.cpu;
                }, 0)
            }}
            CPUs,
            {{
              cluster.machinesList
                .filter(function (el) {
                  return el.provider === provider;
                })
                .reduce(function (acc, cur) {
                  return acc + cur.ram;
                }, 0)
            }}
            GB RAM,
            {{
              cluster.machinesList
                .filter(function (el) {
                  return el.provider === provider;
                })
                .reduce(function (acc, cur) {
                  return acc + cur.hdd;
                }, 0)
            }}
            GB Disk
          </div>
        </b-card-text>
      </b-col>
    </b-row>
  </b-card>
</template>

<script>
export default {
  name: "ProviderNodesCard",
  props: {
    providerLogo: {
      type: String,
      required: true,
    },
    provider: {
      type: String,
      required: true,
    },
    cluster: {
      type: Object,
      required: true,
    },
    isCompute: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
};
</script>