<template>
  <div>
    <div>
      <div style="margin-top: 6rem">
        <h3 class="ml-3">Welcome {{ computed_userInfo.username }}</h3>
        <br />
        <h5 class="ml-3">
          Your Console overview for a quick navigation and operation to support
          your daily development and operations teams. Happy dev-ops :-)
        </h5>
        <div class="my-5"></div>

        <ProfileProgressBar
          :resourcesCount="
            kubernetesClustersCount + computeCount + computed_buckets.length
          "
        />

        <div class="px-3 py-0 col-12">
          <b-card-group deck>
            <CreateResourceCard
              text="Setup Project"
              redirectPage="addnewproject"
            />
            <CreateResourceCard
              text="Create Kubernetes Cluster"
              redirectPage="createcluster"
            />
            <CreateResourceCard
              text="Create Virtual Machine"
              redirectPage="createvms"
            />
            <CreateResourceCard
              text="Setup Storage"
              redirectPage="AddNewBucket"
            />
            <CreateResourceCard
              text="Add Credentials"
              redirectPage="addcloudcredentials"
            />
          </b-card-group>
        </div>

        <b-row>
          <b-col class="px-3 py-0 col-12">
            <div>
              <b-card-group deck>
                <OverviewCard
                  redirectPage="ProjectList"
                  title="Projects"
                  class="w-100"
                  :showCount="true"
                  :count="computed_projects.length"
                  favIcon="fas fa-project-diagram"
                  cardText="Define and set up your project with Kubernetes Cluster and Compute Engines side-by-side. Add users and services out of the service catalog. Access all details at a glance and drill down to each machine to keep track and monitor."
                  videoTitle="https://www.youtube.com/watch?v=hx7b_UVfpf4"
                />
              </b-card-group>

              <b-card-group deck>
                <OverviewCard
                  redirectPage="KubernetesClusterList"
                  title="Kubernetes Clusters"
                  :showCount="true"
                  :count="kubernetesClustersCount"
                  favIcon="fas fa-server"
                  cardText="Setup Kubernetes Cluster to deploy and manage containerized applications. Add as many Kubernetes Clusters to your project as you need. Customize according to your requirements and process management operations."
                  videoTitle="https://www.youtube.com/watch?v=fUuvv0YUEPY"
                />

                <OverviewCard
                  v-if="isComputeEnabled()"
                  redirectPage="computeoverviewall"
                  title="Compute (VMs)"
                  :showCount="true"
                  :count="computeCount"
                  favIcon="fas fa-laptop-code"
                  cardText="Create a virtual machine that will run Linux. Choose an image during setup. Complete the create process for full customization to deploy a VM of your choice in your project. Individually operate your virtual machines."
                  videoTitle="https://www.youtube.com/watch?v=txYf5DGViTo"
                />
              </b-card-group>

              <b-card-group deck>
                <OverviewCard
                  v-if="computed_account_settings.enable_storage"
                  redirectPage="StorageOverall"
                  title="Storage"
                  :showCount="true"
                  :count="computed_buckets.length"
                  favIcon="fas fa-database"
                  cardText="Use your cloud credentials to create and access AWS and Google buckets and Azure containers. Assign them to a project. Manage folders. Upload, download and delete files."
                  videoTitle="https://www.youtube.com/watch?v=txYf5DGViTo"
                />

                <OverviewCard
                  redirectPage="ServiceCatalog"
                  title="Service Catalog"
                  :count="servicesCount"
                  favIcon="fas fa-shopping-basket"
                  cardText="Select and deploy services to your project without hesitation. Configure and decide target projects and resources and install services on the fly."
                  videoTitle="https://www.youtube.com/watch?v=txYf5DGViTo"
                />
              </b-card-group>

              <b-card-group deck>
                <OverviewCard
                  v-if="computed_isAdmin"
                  redirectPage="userslist"
                  title="Users"
                  :showCount="true"
                  :count="computed_users.length"
                  favIcon="far fa-user"
                  cardText="Get a list of users and manage members. Add users to your projects. Development and operations can work together on one platform to create, deliver and scale applications fast."
                  videoTitle="https://www.youtube.com/watch?v=txYf5DGViTo"
                />

                <OverviewCard
                  redirectPage="CloudProfile"
                  title="Cloud Credentials"
                  :showCount="true"
                  :count="computed_credentials.length"
                  favIcon="fas fa-key"
                  cardText="Integrate multiple infrastructure providers and cloud platforms. Add your credentials manually or use OAuth where possible for an easy to use platform deployment access.    "
                  videoTitle="https://www.youtube.com/watch?v=txYf5DGViTo"
                />
              </b-card-group>

              <b-card-group deck>
                <OverviewCard
                  redirectPage="templates"
                  title="Templates"
                  class="w-100"
                  :showCount="false"
                  favIcon="fas fa-save"
                  cardText="Use templates to configure your environments faster. You can save a template of any Kubernetes or Compute environment, while creating them or once they're ready."
                  videoTitle="https://www.youtube.com/watch?v=txYf5DGViTo"
                />
              </b-card-group>
            </div>
          </b-col>
        </b-row>
      </div>
    </div>
  </div>
</template>

<script>
import OverviewCard from "@/components/platform/OverviewCard";
import ProfileProgressBar from "@/components/platform/ProfileProgressBar";
import CreateResourceCard from "@/components/platform/CreateResourceCard";

const options = {
  title: {
    display: true,
    text: "",
  },
  legend: {
    display: true,
    labels: {
      boxWidth: 10,
      boxHeight: 2,
      padding: 0,
    },
  },
  responsive: true,
  animation: {
    animateRotate: false,
  },
  elements: {
    center: {
      text: "",
      color: "#000", // Default is #000000
      // fontStyle: "Arial", // Default is Arial
      sidePadding: 20, // Default is 20 (as a percentage)
      minFontSize: 10, // Default is 20 (in px), set to false and text will not wrap.
      lineHeight: 25, // Default is 25 (in px), used for when text wraps
    },
  },
  scales: {
    scaleLabel: true,
  },
  tooltips: {
    enabled: false,
  },
  cutoutPercentage: 90,
};

const optionsAccounts = {
  title: {
    display: true,
    text: "",
  },
  legend: {
    display: true,
    labels: {
      boxWidth: 10,
      boxHeight: 2,
      padding: 0,
    },
  },
  responsive: true,
  animation: {
    animateRotate: false,
  },
  elements: {
    center: {
      text: "Create new environments to see their current status here",
      color: "#000", // Default is #000000
      // fontStyle: "Arial", // Default is Arial
      sidePadding: 20, // Default is 20 (as a percentage)
      minFontSize: 10, // Default is 20 (in px), set to false and text will not wrap.
      lineHeight: 25, // Default is 25 (in px), used for when text wraps
    },
  },
  scales: {
    scaleLabel: true,
  },
  tooltips: {
    enabled: false,
  },
  cutoutPercentage: 90,
};

export default {
  name: "TenantLandingPage",
  components: {
    OverviewCard,
    ProfileProgressBar,
    CreateResourceCard,
  },
  data() {
    return {
      servicesCount: 0,
      kubernetesClustersCount: 0,
      computeCount: 0,
      interval: "",
      templatesList: [],
      infoEnvironments: {
        total: "",
        status: {
          running: "",
          installing: "",
        },
      },
      options,
      optionsAccounts,
      loadingStatusesInfo: true,
    };
  },
  created() {
    this.getUserInfo();

    this.getCredentials();
    this.getUsers();
    this.getProjects();
    this.getClusters();
    this.getAccountSettings();
    this.getBuckets();
  },
  mounted() {
    let self = this;

    self.interval = setInterval(() => {
      self.getProjects();
      self.getCredentials();
      self.getUsers();
      self.getClusters();
      self.getBuckets();
    }, 15000);

    window.intervals = [];
    window.intervals.push(this.interval);

    this.getQuotas();
  },
  destroyed() {
    for (let i = 0; i < window.intervals.length; i++) {
      clearInterval(window.intervals[i]);
    }
    clearInterval(this.interval);
  },
  methods: {
    isComputeEnabled() {
      return this.computed_account_settings.enable_compute;
    },
    async getClusters() {
      let clusters = await this.getAllClusters();

      this.computeCount = clusters.filter(
        (el) => el.type == 2 || el.type == 6
      ).length;
      this.kubernetesClustersCount = clusters.filter(
        (el) =>
          el.type == 1 ||
          el.type == 3 ||
          el.type == 5 ||
          el.type == 7 ||
          el.type == 8
      ).length;
      this.servicesCount = 0;
      for (let i = 0; i < clusters.length; i++) {
        this.servicesCount += clusters[i].services_count;
      }

      this.loadingStatusesInfo = false;
    },
    getQuotas() {
      this.profile = this.computed_userInfo.profile;
      this.username = this.computed_userInfo.username;
      this.loadingStatusesInfo = false;
    },
  },
};
</script>

<style scoped>
#accountsChart:hover,
#environmentsChart:hover,
#statusesChart:hover {
  cursor: pointer;
}
</style>