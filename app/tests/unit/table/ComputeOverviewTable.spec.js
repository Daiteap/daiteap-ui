import {shallowMount} from "@vue/test-utils";
import ComputeOverviewTable from
  "@/components/platform/tables/ComputeOverviewTable.vue";
import Vue from "vue";
import BootstrapVue from "bootstrap-vue";

Vue.use(BootstrapVue);
Vue.filter("formatDate", function(value) {
  if (value) {
    return value;
  }
});

describe("ComputeOverviewTable", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(ComputeOverviewTable, {
      propsData: {
        projectName: "",
      },
      data() {
        return {
          computed_theme: "daiteap",
          clustersList: [
            {
              ID: 1,
              Name: "Cluster 1",
              Description: "This is the first cluster",
              ProjectName: "Project A",
              Providers: ["Azure", "Amazon"],
              Credentials: {
                azure: "azure-credentials",
                aws: "aws-credentials",
              },
              CreatedAt: "2021-08-01T12:00:00Z",
              Contact: "John Doe",
              Status: "running",
              InstallStep: 0,
              ResizeStep: 0,
            },
            {
              ID: 2,
              Name: "Cluster 2",
              Description: "This is the second cluster",
              ProjectName: "Project B",
              Providers: ["Google", "Onpremise"],
              Credentials: {
                google: "google-credentials",
                onpremise: "onpremise-credentials",
              },
              CreatedAt: "2021-08-02T12:00:00Z",
              Contact: "Jane Smith",
              Status: "starting",
              InstallStep: 50,
              ResizeStep: 0,
            },
            {
              ID: 3,
              Name: "Cluster 3",
              Description: "This is the third cluster",
              ProjectName: "Project C",
              Providers: ["Openstack", "IotArm"],
              Credentials: {
                openstack: "openstack-credentials",
                iotarm: "iotarm-credentials",
              },
              CreatedAt: "2021-08-03T12:00:00Z",
              Contact: "Bob Johnson",
              Status: "stopping",
              InstallStep: 100,
              ResizeStep: 0,
            },
          ],
          loading: false,
          computed_account_settings: {
            enable_templates: false,
          },
        };
      },
    });
  });

  afterEach(() => {
    wrapper.destroy();
  });

  it("renders the component", () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("displays the clusters list", async () => {
    await wrapper.vm.$nextTick();

    const cluster1Name = wrapper.findAll("td").at(0).text();
    const cluster1Description = wrapper.findAll("td").at(1).text();
    const cluster1Project = wrapper.findAll("td").at(2).text();
    const cluster1CreatedAt = wrapper.findAll("td").at(4).text();
    const cluster1CreatedBy = wrapper.findAll("td").at(5).text();
    const cluster2Name = wrapper.findAll("td").at(8).text();
    const cluster2Description = wrapper.findAll("td").at(9).text();
    const cluster2Project = wrapper.findAll("td").at(10).text();
    const cluster2CreatedAt = wrapper.findAll("td").at(12).text();
    const cluster2CreatedBy = wrapper.findAll("td").at(13).text();

    expect(cluster1Name).toBe("Cluster 1");
    expect(cluster1Description).toBe("This is the first cluster");
    expect(cluster1Project).toBe("Project A");
    expect(cluster1CreatedAt).toBe("1 Aug 2021, 15:00");
    expect(cluster1CreatedBy).toBe("John Doe");
    expect(cluster2Name).toBe("Cluster 2");
    expect(cluster2Description).toBe("This is the second cluster");
    expect(cluster2Project).toBe("Project B");
    expect(cluster2CreatedAt).toBe("2 Aug 2021, 15:00");
    expect(cluster2CreatedBy).toBe("Jane Smith");
  });

  it("displays a loading spinner when the table is loading", async () => {
    wrapper.setData({loading: true});

    await wrapper.vm.$nextTick();

    const spinner = wrapper.find(".spinner-border");

    expect(spinner.exists()).toBe(true);
  });

  it("displays a message when there are no clusters", async () => {
    wrapper.setData({clustersList: []});

    await wrapper.vm.$nextTick();

    const message = wrapper.findAll("div").at(0);

    expect(message.text()).toBe("No Compute (VMs) currently.");
  });
});
