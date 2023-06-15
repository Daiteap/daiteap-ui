import {shallowMount} from "@vue/test-utils";
import ClusterStorage from "@/components/platform/tables/ClusterStorage.vue";

describe("ClusterStorage", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(ClusterStorage, {
      propsData: {
        cluster: {
          longhorn_username: "testuser",
          longhorn_password: "testpassword",
          longhorn_address: "testaddress",
        },
        clusterID: "testcluster",
        longhornPWCopied: false,
      },
      data() {
        return {
          get_axiosConfig: () => {
            return {};
          },
        };
      },
      mocks: {
        axios: {
          get: jest.fn(() =>
            Promise.resolve({
              data: {
                nodes: [
                  {
                    name: "testnode1",
                    type: "worker",
                    storageMaximum: 1000000000,
                    storageAvailable: 500000000,
                  },
                  {
                    name: "testnode2",
                    type: "worker",
                    storageMaximum: 2000000000,
                    storageAvailable: 1000000000,
                  },
                ],
              },
            }),
          ),
        },
      },
    });
  });

  afterEach(() => {
    wrapper.destroy();
  });

  it("renders the component", () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("displays the longhorn storage information", () => {
    const username = wrapper.find("tbody tr:first-child td:first-child").text();
    const password = wrapper.find("#pwd").text();
    const address = wrapper.find("a").text();

    expect(username).toBe("testuser");
    expect(password).toBe("*".repeat("testpassword".length));
    expect(address).toBe("testaddress");
  });

  it("displays the storage information for each node", async () => {
    wrapper.setData({
      allNodes: [
        {
          name: "testnode1",
          storageMaximum: 1000000000,
          storageAvailable: 500000000,
        },
        {
          name: "testnode2",
          storageMaximum: 2000000000,
          storageAvailable: 1000000000,
        },
      ],
      get_axiosConfig: () => {
        return {};
      },
      loadingTable: false,
      showStorage: true,
    });

    await wrapper.vm.$nextTick();

    const node1Name = wrapper.findAll(".node-name").at(0).text();
    const node1Type = wrapper
      .findAll("tbody")
      .at(1)
      .findAll("tr")
      .at(0)
      .findAll("td")
      .at(1)
      .text();
    const node1Storage = wrapper
      .findAll("tbody")
      .at(1)
      .findAll("tr td")
      .at(2)
      .text();
    const node2Name = wrapper.findAll(".node-name").at(1).text();
    const node2Type = wrapper
      .findAll("tbody")
      .at(1)
      .findAll("tr")
      .at(1)
      .findAll("td")
      .at(1)
      .text();
    const node2Storage = wrapper
      .findAll("tbody")
      .at(1)
      .findAll("tr td")
      .at(5)
      .text();

    expect(node1Name).toBe("testnode1");
    expect(node1Type).toBe("Worker");
    expect(node1Storage).toContain("0.47");
    expect(node2Name).toBe("testnode2");
    expect(node2Type).toBe("Worker");
    expect(node2Storage).toContain("1.86");
  });

  it("displays a loading spinner when the table is loading", () => {
    wrapper.setData({loadingTable: true});

    const spinner = wrapper.find(".spinner-border");

    expect(spinner.exists()).toBe(true);
  });

  it("displays a message when storage information is not available",
    async () => {
      wrapper.setData({showStorage: false, loadingTable: false});

      await wrapper.vm.$nextTick();

      const message = wrapper.find("div.justify-content-center");

      expect(message.text()).toBe("Storage information not available");
    });
});
