<template>
  <div>
    <div
      v-if="!template.name"
      style="margin-top: 6rem"
      class="d-flex justify-content-center"
    >
      <div class="spinner-border" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>
    <div v-else class="card daiteap-content-card">
      <div>
        <CardTitle :title="`Template Details - ${template.name}`" />
        <div v-if="template.description">
          <strong>Description:</strong> {{ template.description }}
        </div>
      </div>
      <div>
        <div v-if="template.config">
          <div class="box pt-1">
            <div>
              <hr :class="templateProvidersList.length == 5 ? 'pb-0' : ''" />

              <div>
                <div v-if="template.config" class="form-group col- lg-12 mb-3">
                  <div class="row px-3">
                    <div class="col-6 p-0 m-0 mb-2">
                      <b>Template:</b> {{ template.name }}
                    </div>
                    <div class="col-6 p-0 m-0 mb-2">
                      <b>From:</b> {{ formatDate(template.created_at) }}
                    </div>
                    <div v-if="template.type == 1" class="col-6 p-0 m-0 mb-2">
                      <b>Type:</b>
                      Kubernetes Cluster (DLCM)
                    </div>
                    <div
                      v-else-if="template.type == 3"
                      class="col-6 p-0 m-0 mb-2"
                    >
                      <b>Type:</b>
                      K3S
                    </div>
                    <div
                      v-else-if="template.type == 5"
                      class="col-6 p-0 m-0 mb-2"
                    >
                      <b>Type:</b>
                      Kubernetes Cluster (CAPI)
                    </div>
                    <div
                      v-else-if="template.type == 7"
                      class="col-6 p-0 m-0 mb-2"
                    >
                      <b>Type:</b>
                      Kubernetes Cluster (DLCMv2)
                    </div>
                    <div v-else class="col-6 p-0 m-0 mb-2">
                      <b>Type:</b>
                      Compute (VM)
                    </div>
                    <div
                      v-if="template.config['kubernetesConfiguration']"
                      class="col-6 p-0 m-0 mb-2"
                    >
                      <div
                        v-if="
                          template.config['kubernetesConfiguration'][
                            'networkPlugin'
                          ]
                        "
                      >
                        <b>CNI:</b>
                        {{
                          template.config["kubernetesConfiguration"][
                            "networkPlugin"
                          ]
                        }}
                      </div>
                    </div>
                    <div class="col-6 p-0 m-0 mb-2">
                      <b>Providers: </b>
                      <img
                        v-for="provider in templateProvidersList"
                        :key="provider + 'logo'"
                        :title="provider"
                        margin-top="auto"
                        margin-bottom="auto"
                        class="pr-2"
                        width="auto"
                        style="height: 20px"
                        :src="
                          require('@/assets/img/' +
                            providerImageFilename(provider))
                        "
                      />
                    </div>
                    <div
                      v-if="template.config.load_balancer_integration"
                      class="col-6 p-0 m-0 mb-2"
                    >
                      <b>Load Balancer: </b>
                      {{ template.config.load_balancer_integration }}
                    </div>
                    <div
                      v-if="template.config.kubernetesConfiguration"
                      class="col-6 p-0 m-0 mb-2"
                    >
                      <b>Kubernetes Version: </b>
                      {{ template.config.kubernetesConfiguration.version }}
                    </div>
                  </div>

                  <br />

                  <!-- DLCMv2 -->
                  <div
                    class="mt-2"
                    style="max-height: 600px; overflow-y: auto"
                    v-if="
                      template.type == 7 ||
                      template.type == 2 ||
                      template.type == 6
                    "
                  >
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
                            <th>vpcCidr</th>
                            <th v-if="template.type == 7">Nodes</th>
                            <th v-else>VMs</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr
                            v-for="provider in templateProvidersList"
                            :key="provider"
                          >
                            <td>
                              <img
                                :key="provider + 'logo'"
                                :title="provider"
                                margin-top="auto"
                                margin-bottom="auto"
                                class="pr-2"
                                width="auto"
                                style="height: 20px"
                                :src="
                                  require('@/assets/img/' +
                                    providerImageFilename(provider))
                                "
                              />
                            </td>
                            <td>
                              {{ template.config[provider].region }}
                            </td>
                            <td>
                              {{ template.config[provider].vpcCidr }}
                            </td>
                            <td>
                              <div
                                v-for="node in template.config[provider].nodes"
                                :key="node"
                              >
                                <div>
                                  <div v-if="template.type == 7">
                                    <div v-if="node.is_control_plane">
                                      <b>NODE</b>: Control plane
                                    </div>
                                    <div v-else><b>NODE</b>: Worker node</div>
                                  </div>
                                  <div>Zone: {{ node.zone }}</div>
                                  <div>
                                    Instance Type: {{ node.instanceType }}
                                  </div>
                                  <div>OS: {{ node.operatingSystem }}</div>
                                </div>
                                <br />
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <!-- CAPI -->
                  <div
                    class="mt-2"
                    style="max-height: 600px; overflow-y: auto"
                    v-else-if="template.type == 5"
                  >
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
                            <th>Nodes</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr
                            v-for="provider in templateProvidersList"
                            :key="provider"
                          >
                            <td>
                              <img
                                :key="provider + 'logo'"
                                :title="provider"
                                margin-top="auto"
                                margin-bottom="auto"
                                class="pr-2"
                                width="auto"
                                style="height: 20px"
                                :src="
                                  require('@/assets/img/' +
                                    providerImageFilename(provider))
                                "
                              />
                            </td>
                            <td>
                              {{ template.config[provider].region }}
                            </td>
                            <td>
                              <div>
                                <div
                                  v-for="i in template.config[provider]
                                    .controlPlane.replicas"
                                  :key="i"
                                >
                                  <div><b>NODE</b>: Control plane</div>
                                  <div>
                                    Zone:
                                    {{
                                      template.config[provider].controlPlane
                                        .zone
                                    }}
                                  </div>
                                  <div>
                                    Instance Type:
                                    {{
                                      template.config[provider].controlPlane
                                        .instanceType
                                    }}
                                  </div>
                                  <div>
                                    OS:
                                    {{
                                      template.config[provider].controlPlane
                                        .operatingSystem
                                    }}
                                  </div>
                                </div>
                              </div>
                              <div
                                v-for="node in template.config[provider]
                                  .workerNodes"
                                :key="node"
                              >
                                <div>
                                  <div><b>NODE</b>: Worker node</div>
                                  <div>Zone: {{ node.zone }}</div>
                                  <div>
                                    Instance Type: {{ node.instanceType }}
                                  </div>
                                  <div>OS: {{ node.operatingSystem }}</div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <!-- DLCM -->
                  <div
                    class="mt-2"
                    style="max-height: 600px; overflow-y: auto"
                    v-else
                  >
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
                            <th>Zone</th>
                            <th>vpcCidr</th>
                            <th>Nodes</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr
                            v-for="provider in templateProvidersList"
                            :key="provider"
                          >
                            <td>
                              {{ provider }}
                            </td>
                            <td>
                              {{ template.config[provider].region }}
                            </td>
                            <td>
                              <div
                                v-if="
                                  Array.isArray(template.config[provider].zone)
                                "
                              >
                                {{ template.config[provider].zone[0] }}
                              </div>
                              <div v-else>
                                {{ template.config[provider].zone }}
                              </div>
                            </td>

                            <td>
                              <div v-if="template.config[provider].vpcCidr">
                                {{ template.config[provider].vpcCidr }}
                              </div>
                            </td>
                            <td>
                              <div
                                v-if="
                                  template.config[provider].instanceTypeName
                                "
                              >
                                {{ template.config[provider].instanceTypeName }}
                              </div>
                              <div v-else>
                                {{ template.config[provider].instanceType }}
                              </div>
                              <div
                                v-if="
                                  template.config[provider].operatingSystemName
                                "
                              >
                                {{
                                  template.config[provider].operatingSystemName
                                }}
                              </div>
                              <div v-else>
                                {{ template.config[provider].operatingSystem }}
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <br />
              </div>
            </div>
          </div>
        </div>
        <br />
      </div>
    </div>
  </div>
</template>

<script>
import CardTitle from "@/components/platform/CardTitle";

export default {
  name: "TemplateDetails",
  data() {
    return {
      availableAccounts: {
        aws: [],
        azure: [],
        google: [],
        onpremise: [],
        iotarm: [],
        openstack: [],
      },
      template: { name: "" },
      templateProvidersList: [],
    };
  },
  mounted() {
    this.getTemplateConfig(this.templateID);
  },
  props: {
    templateID: String,
  },
  components: {
    CardTitle,
  },
  methods: {
    customisation() {
      let color = "200, 200, 200,";
      let stylings =
        "border: rgba(" +
        color +
        " 0.30) 1px solid; border-radius: 4px; background: linear-gradient(172deg, rgba(" +
        color +
        " 0.03) 0% , rgba(" +
        color +
        " 0.01) 48%, rgba(255,255,255,0) 100%);";
      return stylings;
    },
    providerImageFilename(provider) {
      if (provider == "google") {
        return "googleCloud_logo_small.png";
      }
      if (provider == "openstack") {
        if(this.computed_theme == "daiteap") {
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
    formatDate(date) {
      let options = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      };
      date = new Date(date);
      date = date.toLocaleString("en-US", options);
      return date;
    },
    getProviderAccountsList(provider) {
      let self = this;
      this.axios
        .get(
          "/server/tenants/" +
            this.computed_active_tenant_id +
            "/cloud-credentials/providers/" +
            provider,
          this.get_axiosConfig()
        )
        .then(function (response) {
          for (let i = 0; i < response.data.accounts.length; i++) {
            self.availableAccounts[provider].push(
              response.data.accounts[i].label
            );
          }
          self.loadingAccounts = false;
        })
        .catch(function (error) {
          self.errorMsg = error;
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
              title: "Notification:",
              text: "Error while getting cloud credentials information! " + error,
            });
          }
        });
    },
    getAvailableAccounts() {
      let provider = this.template.providers;

      if (provider.toLowerCase().includes("amazon")) {
        this.getProviderAccountsList("aws");
        this.templateProvidersList.push("aws");
      }
      if (provider.toLowerCase().includes("azure")) {
        this.getProviderAccountsList("azure");
        this.templateProvidersList.push("azure");
      }
      if (provider.toLowerCase().includes("google")) {
        this.getProviderAccountsList("google");
        this.templateProvidersList.push("google");
      }
      if (provider.toLowerCase().includes("premise")) {
        this.getProviderAccountsList("onpremise");
        this.templateProvidersList.push("onpremise");
      }
      if (provider.toLowerCase().includes("arm")) {
        this.getProviderAccountsList("iotarm");
        this.templateProvidersList.push("iotarm");
      }
      if (provider.toLowerCase().includes("openstack")) {
        this.getProviderAccountsList("openstack");
        this.templateProvidersList.push("openstack");
      }
    },
    getTemplateConfig(environmentTemplateId) {
      let self = this;
      this.axios
        .get(
          "/server/tenants/" +
            this.computed_active_tenant_id +
            "/environment-templates/" +
            environmentTemplateId,
          this.get_axiosConfig()
        )
        .then(function (response) {
          self.template = response.data;
          self.getAvailableAccounts();
        })
        .catch(function (error) {
          self.error = error;
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
              title: "Notification:",
              text: "Error getting template configuration " + error,
            });
          }
        });
    },
  },
};
</script>

