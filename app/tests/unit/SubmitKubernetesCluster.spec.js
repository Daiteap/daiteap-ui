import {shallowMount, mount} from "@vue/test-utils";
import SubmitKubernetesCluster from "@/components/platform/SubmitKubernetesCluster.vue";
import axios from "axios";

const mockedGetResponse = {
  data: {
    credentials: [
      {
        id: 1,
        label: "aws-1",
        provider: "aws",
        type: "aws",
        contact: "admin@mail.mail",
        valid: true,
        description: "desc",
        created_at: "4/1/2022",
        has_associated_environments: false,
      },
    ],
  },
};

const mockCluster = {
  id: 1,
  title: "cluster-1",
  provider: "aws",
};

describe("SubmitKubernetesCluster.vue", () => {
  describe("SubmitKubernetesCluster", () => {
    let wrapper;

    beforeEach(() => {
      wrapper = shallowMount(SubmitKubernetesCluster, {
        data() {
          return {
            computed_theme: "daiteap",
            get_axiosConfig: () => {
              return {};
            },
            selectedProvider: " ",
            computed_account_settings: {
              enable_kubernetes_capi: true,
            },
          };
        },
        mocks: {
          getCredentials: function() {
            return mockedGetResponse.data.credentials;
          },
          $router: [],
          get_axiosConfig: () => {
            return {};
          },
          getClusterDetailsMain: () => {
            return mockCluster;
          },
        },
      });

      wrapper.vm.$refs = {
        form: {
          validate: jest.fn(),
        },
      };
    });

    it("calculates dynamic percent correctly", () => {
      const count = 100;
      const expectedPercent = (count / 1527) * 85;
      const actualPercent = wrapper.vm.calcDynamicPercent(count);
      expect(actualPercent).toEqual(expectedPercent);
    });

    it("removes loading state", () => {
      wrapper.setData({loading: true});
      wrapper.vm.removeLoading();
      expect(wrapper.vm.loading).toBe(false);
    });

    it("gets cluster details", async () => {
      await wrapper.vm.getClusterDetails(wrapper.vm);

      expect(wrapper.vm.cluster).toEqual(mockCluster);
      expect(wrapper.vm.clusterName).toEqual(mockCluster.title);
    });

    it("gets cluster details main", async () => {
      const mockGetClusterDetailsMain = jest.fn();
      wrapper.setMethods({getClusterDetailsMain: mockGetClusterDetailsMain});
      await wrapper.vm.getClusterDetailsMain(wrapper.vm);
      expect(mockGetClusterDetailsMain).toHaveBeenCalled();
    });

    it("navigates to cluster details", () => {
      const mockIntervals = [1, 2, 3];
      window.intervals = mockIntervals;
      const mockRouterPush = jest.fn();
      wrapper.setMethods({$router: {push: mockRouterPush}});

      wrapper.vm.goToClusterDetails();

      expect(window.intervals).toEqual([]);
      expect(mockRouterPush).toHaveBeenCalledWith({
        name: "ClusterDetails",
        params: {
          clusterID: wrapper.vm.ID,
          detailPage: "overview",
        },
      });
    });

    it("clears intervals on destroyed", () => {
      const mockIntervals = [1, 2, 3];
      window.intervals = mockIntervals;
      wrapper.vm.interval = 4;

      wrapper.destroy();

      expect(window.intervals).toEqual([]);
    });

    it("updates progress bar percentage", () => {
      const mockPercentage = 50;
      wrapper.vm.updatePercentage(mockPercentage);
      expect(wrapper.vm.progressBar.display).toBe("flex");
      expect(wrapper.vm.progressBar.width).toBe(`${mockPercentage}%`);
    });

    it("shows retry dialog", async () => {
      const mockId = 1;
      const mockName = "Test Cluster";
      const mockSuccessMessage = `You have successfully submitted retry for "${mockName}".`;
      const mockFailureMessage = `Error occured while you tried to submit retry of "${mockName}".`;
      const mockShowRetryDialog = true;
      const mockBvModalShow = jest.fn();
      wrapper.setMethods({$bvModal: {show: mockBvModalShow}});

      await wrapper.vm.retryCluster(mockId, mockName);

      await wrapper.vm.$nextTick();

      expect(wrapper.vm.retryDialogParams.endpoint).toBe(
        "/server/tenants/undefined/clusters/1/dlcm-retry-create",
      );
      expect(wrapper.vm.retryDialogParams.successMessage).toBe(
        mockSuccessMessage,
      );
      expect(wrapper.vm.retryDialogParams.failureMessage).toBe(
        mockFailureMessage,
      );
      expect(wrapper.vm.showRetryDialog).toBe(mockShowRetryDialog);
      expect(mockBvModalShow).toHaveBeenCalledWith("bv-modal-retrydialog");
    });
  });

  describe("changeInstallationStatus", () => {
    let wrapper;

    beforeEach(() => {
      wrapper = shallowMount(SubmitKubernetesCluster, {
        data() {
          return {
            computed_theme: "daiteap",
            get_axiosConfig: () => {
              return {};
            },
            selectedProvider: " ",
            computed_account_settings: {
              enable_kubernetes_capi: true,
            },
          };
        },
        mocks: {
          getCredentials: function() {
            return mockedGetResponse.data.credentials;
          },
          $router: [],
          get_axiosConfig: () => {
            return {};
          },
          getClusterDetailsMain: () => {
            return mockCluster;
          },
        },
      });

      wrapper.vm.$refs = {
        form: {
          validate: jest.fn(),
        },
      };
    });

    afterEach(() => {
      wrapper.destroy();
    });

    it("updates state and percentage for status 1-6", () => {
      wrapper.setData({status: 1});
      wrapper.vm.changeInstallationStatus();
      expect(wrapper.vm.state).toEqual([1, 0, 0, 0, 0]);
      expect(wrapper.vm.progressBar.width).toBe("2%");
    });

    it("updates state and percentage for status 7-8", () => {
      wrapper.setData({status: 7, counter: 100});
      wrapper.vm.changeInstallationStatus();
      const expectedPercent = (100 / 1527) * 85 + 25;
      expect(wrapper.vm.state).toEqual([2, 1, 0, 0, 0]);
      expect(wrapper.vm.progressBar.width).toBe(`${expectedPercent}%`);
    });

    it("updates state and percentage for status 9-12", () => {
      wrapper.setData({status: 9, counter: 100});
      wrapper.vm.changeInstallationStatus();
      const expectedPercent = (100 / 1527) * 85 + 50;
      expect(wrapper.vm.state).toEqual([2, 2, 1, 0, 0]);
      expect(wrapper.vm.progressBar.width).toBe(`${expectedPercent}%`);
    });

    it("updates state and percentage for status 13-24", () => {
      wrapper.setData({status: 13, counter: 100});
      wrapper.vm.changeInstallationStatus();
      const expectedPercent = (100 / 1527) * 85 + 75;
      expect(wrapper.vm.state).toEqual([2, 2, 2, 1, 0]);
      expect(wrapper.vm.progressBar.width).toBe(`${expectedPercent}%`);
    });

    it("updates state and percentage for status 25-30", () => {
      wrapper.setData({status: 25});
      wrapper.vm.changeInstallationStatus();
      expect(wrapper.vm.state).toEqual([2, 2, 2, 2, 1]);
      expect(wrapper.vm.progressBar.width).toBe("95%");
    });

    it("updates state and percentage for status 0", () => {
      wrapper.setData({status: 0});
      wrapper.vm.changeInstallationStatus();
      expect(wrapper.vm.state).toEqual([2, 2, 2, 2, 2]);
      expect(wrapper.vm.progressBar.width).toBe("100%");
    });

    it("updates state and percentage for status -1 to -6", () => {
      wrapper.setData({status: -1});
      wrapper.vm.changeInstallationStatus();
      expect(wrapper.vm.state).toEqual([-1, 0, 0, 0, 0]);
      expect(wrapper.vm.progressBar.width).toBe("100%");
    });

    it("updates state and percentage for status -7 and -8", () => {
      wrapper.setData({status: -7});
      wrapper.vm.changeInstallationStatus();
      expect(wrapper.vm.state).toEqual([2, -1, 0, 0, 0]);
      expect(wrapper.vm.progressBar.width).toBe("100%");
    });

    it("updates state and percentage for status -9 to -12", () => {
      wrapper.setData({status: -9});
      wrapper.vm.changeInstallationStatus();
      expect(wrapper.vm.state).toEqual([2, 2, -1, 0, 0]);
      expect(wrapper.vm.progressBar.width).toBe("100%");
    });

    it("updates state and percentage for status -13 to -22", () => {
      wrapper.setData({status: -13});
      wrapper.vm.changeInstallationStatus();
      expect(wrapper.vm.state).toEqual([2, 2, 2, -1, 0]);
      expect(wrapper.vm.progressBar.width).toBe("100%");
    });

    it("updates state and percentage for status -23 to -29", () => {
      wrapper.setData({status: -23});
      wrapper.vm.changeInstallationStatus();
      expect(wrapper.vm.state).toEqual([2, 2, 2, 2, -1]);
      expect(wrapper.vm.progressBar.width).toBe("100%");
    });
  });

  describe("deleteCluster", () => {
    let wrapper;

    beforeEach(() => {
      wrapper = shallowMount(SubmitKubernetesCluster, {
        data() {
          return {
            computed_theme: "daiteap",
            get_axiosConfig: () => {
              return {};
            },
            selectedProvider: " ",
            computed_account_settings: {
              enable_kubernetes_capi: true,
            },
            computed_active_tenant_id: 1,
          };
        },
        mocks: {
          $bvModal: {
            show: jest.fn(),
          },
          $router: [],
          get_axiosConfig: () => {
            return {};
          },
        },
      });
    });

    afterEach(() => {
      wrapper.destroy();
    });

    it("sets delete dialog params correctly", () => {
      const mockId = 123;
      const mockName = "Test Cluster";
      const expectedEndpoint =
        "/server/tenants/1/clusters/" + mockId + "/delete";
      const expectedText = "Are you sure you want to delete:";
      const expectedSuccessMessage =
        "You have successfully submitted deletion for \"" + mockName + "\".";
      const expectedFailureMessage =
        "Error occured while you tried to submit deletion of \"" +
        mockName +
        "\".";

      wrapper.vm.deleteCluster(mockId, mockName);

      expect(wrapper.vm.deleteDialogParams.text).toEqual(expectedText);
      expect(wrapper.vm.deleteDialogParams.envName).toEqual(mockName);
      expect(wrapper.vm.deleteDialogParams.endpoint).toEqual(expectedEndpoint);
      expect(wrapper.vm.deleteDialogParams.successMessage).toEqual(
        expectedSuccessMessage,
      );
      expect(wrapper.vm.deleteDialogParams.failureMessage).toEqual(
        expectedFailureMessage,
      );
    });

    it("shows delete dialog", () => {
      wrapper.vm.deleteCluster(123, "Test Cluster");
      expect(wrapper.vm.showDeleteDialog).toBe(true);
      expect(wrapper.vm.$bvModal.show).toHaveBeenCalledWith(
        "bv-modal-deletedialog",
      );
    });
  });

  describe("getInstallationStatusInterval", () => {
    let wrapper;

    beforeEach(() => {
      jest.useFakeTimers();

      wrapper = shallowMount(SubmitKubernetesCluster, {
        data() {
          return {
            computed_theme: "daiteap",
            get_axiosConfig: () => {
              return {};
            },
            selectedProvider: " ",
            computed_account_settings: {
              enable_kubernetes_capi: true,
            },
            computed_active_tenant_id: 1,
          };
        },
        mocks: {
          $bvModal: {
            show: jest.fn(),
          },
          $router: [],
          get_axiosConfig: () => {
            return {};
          },
        },
      });
    });

    afterEach(() => {
      if (window.intervals) {
        for (let i = 0; i < window.intervals.length; i++) {
          clearInterval(window.intervals[i]);
        }
      }
      wrapper.destroy();
    });

    it("sets interval correctly", () => {
      const setIntervalSpy = jest.spyOn(window, "setInterval");

      wrapper.vm.getInstallationStatusInterval();

      expect(setIntervalSpy).toHaveBeenCalledTimes(1);
      expect(setIntervalSpy).toHaveBeenLastCalledWith(
        expect.any(Function),
        5000,
      );
    });

    it("adds interval to window.intervals", () => {
      wrapper.vm.getInstallationStatusInterval();
      expect(window.intervals).toContain(wrapper.vm.interval);
    });

    it("calls getInstallationStatus on interval", () => {
      const spy = jest.spyOn(wrapper.vm, "getInstallationStatus");
      wrapper.vm.getInstallationStatusInterval();
      jest.advanceTimersByTime(5000);
      expect(spy).toHaveBeenCalledTimes(1);
      jest.advanceTimersByTime(5000);
      expect(spy).toHaveBeenCalledTimes(2);
      jest.advanceTimersByTime(5000);
      expect(spy).toHaveBeenCalledTimes(3);
      spy.mockRestore();
    });
  });

  describe("getInstallationStatus", () => {
    let wrapper;

    beforeEach(() => {
      jest.useFakeTimers();

      wrapper = shallowMount(SubmitKubernetesCluster, {
        data() {
          return {
            computed_theme: "daiteap",
            get_axiosConfig: () => {
              return {};
            },
            selectedProvider: " ",
            computed_account_settings: {
              enable_kubernetes_capi: true,
            },
            computed_active_tenant_id: 1,
          };
        },
        propsData: {
          ID: 1,
        },
        mocks: {
          $bvModal: {
            show: jest.fn(),
          },
          $router: [],
          get_axiosConfig: () => {
            return {};
          },
          axios: {
            get: jest.fn(() => Promise.resolve({installStep: 2})),
          },
        },
      });
    });

    afterEach(() => {
      if (window.intervals) {
        for (let i = 0; i < window.intervals.length; i++) {
          clearInterval(window.intervals[i]);
        }
      }
      wrapper.destroy();
    });

    it("calls axios get", () => {
      const axiosGetSpy = jest.spyOn(axios, "get");
      wrapper.vm.getInstallationStatus(wrapper.vm);
      expect(axiosGetSpy).toHaveBeenCalledTimes(1);
      expect(axiosGetSpy).toHaveBeenCalledWith(
        "/server/tenants/1/clusters/1/installation-status",
        expect.anything(),
      );
      axiosGetSpy.mockRestore();
    });

    it("calls changeInstallationStatus", async () => {
      const spy = jest.spyOn(wrapper.vm, "changeInstallationStatus");
      await wrapper.vm.getInstallationStatus(wrapper.vm);
      expect(spy).toHaveBeenCalledTimes(1);
      spy.mockRestore();
    });
  });

  describe("showCancelInstallationDialog", () => {
    let wrapper;

    beforeEach(() => {
      jest.useFakeTimers();

      wrapper = shallowMount(SubmitKubernetesCluster, {
        data() {
          return {
            computed_theme: "daiteap",
            get_axiosConfig: () => {
              return {};
            },
            selectedProvider: " ",
            computed_account_settings: {
              enable_kubernetes_capi: true,
            },
            computed_active_tenant_id: 1,
          };
        },
        propsData: {
          ID: 1,
        },
        mocks: {
          $bvModal: {
            show: jest.fn(),
          },
          $router: [],
          get_axiosConfig: () => {
            return {};
          },
          axios: {
            get: jest.fn(() => Promise.resolve({installStep: 2})),
          },
        },
      });
    });

    afterEach(() => {
      if (window.intervals) {
        for (let i = 0; i < window.intervals.length; i++) {
          clearInterval(window.intervals[i]);
        }
      }
      wrapper.destroy();
    });

    it("should set showConfirmDialog parametes correctly", () => {
      wrapper.vm.showCancelInstallationDialog(1, "Test Cluster");
      expect(wrapper.vm.showConfirmDialog).toBe(true);
      expect(wrapper.vm.confirmDialogParams.text).toEqual(
        "Are you sure you want to cancel the installation and delete the existing resources:",
      );
      expect(wrapper.vm.confirmDialogParams.envName).toEqual("Test Cluster");
      expect(wrapper.vm.confirmDialogParams.action).toEqual("Delete");
      expect(wrapper.vm.confirmDialogParams.payload["id"]).toEqual(1);
      expect(wrapper.vm.confirmDialogParams.payload["name"]).toEqual(
        "Test Cluster",
      );
    });
  });

  describe("cancelInstallation", () => {
    let wrapper;

    const payload = {
      id: "test-cluster-id",
      name: "test-cluster-name",
    };

    beforeEach(() => {
      wrapper = mount(SubmitKubernetesCluster, {
        data() {
          return {
            computed_active_tenant_id: "test-tenant-id",
            confirmDialogParams: {
              text: "Are you sure you want to cancel the installation and delete the existing resources:",
              envName: "",
              action: "Delete",
              payload: {
                id: "test-cluster-id",
                name: "test-cluster-name",
              },
              successMessage:
                "You have successfully submitted deletion for \"test-cluster-name\".",
              failureMessage:
                "Error occured while you tried to submit deletion of \"test-cluster-name\".",
            },
            get_axiosConfig: () => {
              return {};
            },
            axios: {
              post: jest.fn(() => Promise.resolve()),
            },
          };
        },
        mocks: {
          $router: {
            push: jest.fn(),
          },
        },
      });

      wrapper.vm.$notify = jest.fn();
    });

    afterEach(() => {
      wrapper.destroy();
    });

    it("should cancel installation and delete resources", async () => {
      await wrapper.vm.cancelInstallation(payload);

      expect(wrapper.vm.axios.post).toHaveBeenCalledWith(
        "/server/tenants/test-tenant-id/clusters/test-cluster-id/cancel-creation",
        {},
        expect.any(Object),
      );

      expect(wrapper.vm.$notify).toHaveBeenCalledWith({
        group: "msg",
        type: "success",
        title: "Notification:",
        text: "You have successfully submitted deletion for \"test-cluster-name\".",
      });

      expect(wrapper.vm.$router.push).toHaveBeenCalledWith({
        name: "ProjectList",
      });
    });

    it("should show access denied notification when request fails with 403 status code", async () => {
      wrapper.setData({
        axios: {
          post: jest.fn(() =>
            Promise.reject({response: {status: 403, data: "test"}}),
          ),
        },
      });

      wrapper.vm.$notify = jest.fn();

      await wrapper.vm.cancelInstallation(payload);
      await wrapper.vm.$nextTick();

      console.log(wrapper.vm.$notify.mock.calls);

      expect(wrapper.vm.$notify).toHaveBeenCalledWith({
        group: "msg",
        type: "error",
        title: "Notification:",
        text: "Access Denied",
      });
    });

    it("should show error notification when request fails with any other status code", async () => {
      wrapper.setData({
        axios: {
          post: jest.fn(() =>
            Promise.reject({response: {status: 500, data: "test"}}),
          ),
        },
      });

      await wrapper.vm.cancelInstallation(payload);
      await wrapper.vm.$nextTick();

      expect(wrapper.vm.$notify).toHaveBeenCalledWith({
        group: "msg",
        type: "error",
        title: "Notification:",
        text: "Error occured while you tried to submit deletion of \"test-cluster-name\".",
      });
    });
  });
});
