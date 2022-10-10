<template>
  <div v-if="!loading">
    <CardTitle
      v-if="!summary.resize"
      :title="`Cluster Summary - ${summary.clusterName}`"
    />
    <CardTitle v-else title="Cluster Summary" />
    <br />

    <div class="form-group">
      <div v-if="!summary.resize">
        <div v-if="summary.clusterDescription">
          <b>Description</b>: {{ summary.clusterDescription }}
        </div>
        <!-- <div><b>Project</b>: {{}}</div> -->
        <div>
          <b>Type</b>:
          <span v-if="summary.type == 1">Kubernetes Cluster (DLCM)</span>
          <span v-else-if="summary.type == 3">K3S</span>
          <span v-else-if="summary.type == 5">Kubernetes Cluster (CAPI)</span>
          <span v-else-if="summary.type == 7">Kubernetes Cluster (DLCMv2)</span>
          <span v-else-if="summary.type == 8"
            >Kubernetes Cluster (YaookCAPI)</span
          >
          <span v-else>Compute (VM)</span>
        </div>
        <br />
      </div>

      <div>
        <div>
          <b>Kubernetes version</b>:
          {{ summary.kubernetesConfiguration.version }}
        </div>
        <div v-if="summary.kubernetesConfiguration.serviceAddresses">
          <b>Kubernetes internal network for services</b>:
          {{ summary.kubernetesConfiguration.serviceAddresses }}
        </div>
        <div v-if="summary.kubernetesConfiguration.podsSubnet">
          <b>Kubernetes internal network for pods</b>:
          {{ summary.kubernetesConfiguration.podsSubnet }}
        </div>
        <div v-if="summary.kubernetesConfiguration.networkPlugin">
          <b>Kubernetes network plugin</b>:
          {{ summary.kubernetesConfiguration.networkPlugin }}
        </div>
        <div v-if="summary.load_balancer_integration">
          <b>Load balancer integration</b>:
          {{ summary.load_balancer_integration }}
        </div>
        <br />
      </div>

      <div class="mt-2" style="max-height: 600px; overflow-y: auto">
        <div class="table-responsive">
          <table
            class="table table-bordered"
            id="dataTable"
            width="100%"
            cellspacing="0"
          >
            <thead>
              <tr>
                <th>Provider</th>
                <th>Region</th>
                <th>VPC CIDR</th>
                <th>Nodes</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="provider in providers" :key="provider.name">
                <td>
                  <img
                    :title="provider.name"
                    margin-top="auto"
                    margin-bottom="auto"
                    class="pr-2"
                    width="auto"
                    style="height: 20px"
                    :src="
                      require('@/assets/img/' +
                        providerImageFilename(provider.name))
                    "
                  />
                  {{
                    computed_credentials.filter(
                      (creds) => creds.id == provider.config.account
                    )[0].label
                  }}
                </td>
                <td>
                  {{ provider.config.region }}
                </td>
                <td>
                  {{ provider.config.vpcCidr }}
                </td>
                <td v-if="provider.name == 'openstack'">
                  <div>
                    <div><b>Type</b>: Control plane</div>
                    <div>
                      <b>Instance Type</b>:
                      {{ provider.config.controlPlane.instanceType }}
                    </div>
                    <div>
                      <b>OS</b>:
                      {{ provider.config.controlPlane.operatingSystem }}
                    </div>
                    <div>
                      <b>Count</b>:
                      {{ provider.config.controlPlane.replicas }}
                    </div>
                  </div>
                  <br />
                  <div
                    v-for="(node, index) in provider.config.workerNodes"
                    :key="index"
                  >
                    <div>
                      <div><b>Type</b>: Worker node</div>
                      <div><b>Instance Type</b>: {{ node.instanceType }}</div>
                      <div><b>OS</b>: {{ node.operatingSystem }}</div>
                    </div>
                    <br />
                  </div>
                </td>
                <td v-else>
                  <div
                    v-for="(node, index) in provider.config.nodes"
                    :key="index"
                  >
                    <div>
                      <div v-if="node.is_control_plane">
                        <b>Type</b>: Control plane
                      </div>
                      <div v-else><b>Type</b>: Worker node</div>
                      <div><b>Zone</b>: {{ node.zone }}</div>
                      <div><b>Instance Type</b>: {{ node.instanceType }}</div>
                      <div><b>OS</b>: {{ node.operatingSystem }}</div>
                    </div>
                    <br />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CardTitle from "@/components/platform/CardTitle";

export default {
  name: "ClusterSummary",
  components: {
    CardTitle,
  },
  data() {
    return {
      summary: {},
      providers: [],
      loading: true,
    };
  },
  props: {
    cluster: Object,
  },
  mounted() {
    this.getCredentials();

    setTimeout(() => {
      this.summary = this.cluster;

      if (this.summary.aws) {
        this.providers.push({
          name: "aws",
          config: this.summary.aws,
        });
      }
      if (this.summary.azure) {
        this.providers.push({
          name: "azure",
          config: this.summary.azure,
        });
      }
      if (this.summary.google) {
        this.providers.push({
          name: "google",
          config: this.summary.google,
        });
      }
      if (this.summary.openstack) {
        this.providers.push({
          name: "openstack",
          config: this.summary.openstack,
        });
      }
      if (this.summary.onpremise) {
        this.providers.push({
          name: "onpremise",
          config: this.summary.onpremise,
        });
      }
      if (this.summary.iotarm) {
        this.providers.push({
          name: "iotarm",
          config: this.summary.iotarm,
        });
      }

      this.loading = false;
    }, 100);
  },
  methods: {
    providerImageFilename(provider) {
      if (provider == "google") {
        return "googleCloud_logo_small.png";
      }
      if (provider == "openstack") {
        if (this.computed_theme == "daiteap") {
          return "openstack_logo_small.png";
        }
      }
      if (provider == "alicloud") {
        return "alicloud_logo_small.png";
      }
      if (provider == "aws") {
        return "aws_logo_small.png";
      }
      if (provider == "azure") {
        return "azure_logo_small.png";
      }
      if (provider == "onpremise") {
        return "onpremise.svg";
      }
      if (provider == "iotarm") {
        return "IoTArm_logo_small.svg";
      }
    },
  },
};
</script>