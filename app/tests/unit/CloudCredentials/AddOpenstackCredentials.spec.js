import {mount, config} from "@vue/test-utils";
import {nextTick} from "vue";
import mitt from "mitt";
import {BootstrapVueNext} from "bootstrap-vue-next";
import Notifications from "@kyvg/vue3-notification";
import AddCloudCredentials from "@/components/platform/AddCloudCredentials.vue";
import AddOpenstackAccount
  from "@/components/platform/addProviderCredentials/AddOpenstackAccount.vue";
import WarningAlert from "@/components/platform/WarningAlert.vue";

config.silent = true;
const emitter = mitt();

describe("Add Cloud Credentials - Openstack", () => {
  const mockedGetResponse = {
    data: {
      credentials: [{
        id: 1,
        label: "openstack-1",
        provider: "openstack",
        type: "openstack",
        contact: "admin@mail.mail",
        valid: true,
        description: "desc",
        created_at: "4/1/2022",
        has_associated_environments: false,
      }],
    },
  };

  const credential = {
    label: "openstack-0",
    description: "desc",
    application_credential_id: "32323232323232323232323232323232",
    application_credential_secret: "123456",
    region_name: "a1",
    auth_url: "www/url",
    external_network_id: "363636363636363636363636363636363636",
  };

  jest.spyOn(AddOpenstackAccount.methods, "suggestParams")
    .mockImplementation(() => {
      return;
    });

  let wrapper; let openstack;
  beforeEach(async () => {
    wrapper = mount(
      AddCloudCredentials,
      {
        global: {
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
            get_axiosConfig: () => {
              return {};
            },
            getCredentials: function() {
              return mockedGetResponse.data.credentials;
            },
            emitter: emitter,
            getAccountSettings: function() {},
          },
          plugins: [
            BootstrapVueNext,
            Notifications,
          ],
        },
      },
    );

    wrapper.setData({selectedProvider: "openstack"});
    await nextTick();
    openstack = wrapper.findComponent(AddOpenstackAccount);
    openstack.setData({get_axiosConfig: () => {
      return {};
    }});

    // Add Credential
    let input = openstack.find("[data-test-id=\"input-label\"]");
    await input.setValue(credential.label);

    input = openstack.find("[data-test-id=\"input-description\"]");
    await input.setValue(credential.description);

    input = openstack.find("[data-test-id=\"input-id\"]");
    await input.setValue(credential.application_credential_id);

    input = openstack.find("[data-test-id=\"input-secret\"]");
    await input.setValue(credential.application_credential_secret);

    input = openstack.find("[data-test-id=\"input-region\"]");
    await input.setValue(credential.region_name);

    input = openstack.find("[data-test-id=\"input-url\"]");
    await input.setValue(credential.auth_url);

    input = openstack.find("[data-test-id=\"input-network\"]");
    await input.setValue(credential.external_network_id);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  jest.spyOn(document, "getElementById")
    .mockImplementation((id) => {
      switch (id) {
      case "openstackLabel":
        return {value: credential.label};
      case "openstackdescription":
        return {value: credential.description};
      case "applicationCredentialId":
        return {value: credential.application_credential_id};
      case "applicationCredentialSecret":
        return {value: credential.application_credential_secret};
      case "regionName":
        return {value: credential.region_name};
      case "authUrl":
        return {value: credential.auth_url};
      case "externalNetworkId":
        return {value: credential.external_network_id};
      default:
        return;
      }
    });

  test("checks if label is taken", async () => {
    const input = openstack.find("[data-test-id=\"input-label\"]");
    const saveButton = openstack.find("[data-test-id=\"input-save\"]");

    await input.setValue("openstack-1");
    expect(saveButton.classes().includes("deactivated")).toBe(true);

    await input.setValue("openstack-2");
    expect(saveButton.classes().includes("deactivated")).toBe(false);
  });

  test("adds valid openstack credentials", async () => {
    const mockedPostResponse = {
      data: {
        taskId: 0,
        status: "ok",
        msg: {
          capiImages: true,
          dlcmV2Images: true,
          externalNetwork: true,
        },
      },
    };
    wrapper.setData({
      axios: {
        post: jest.fn(() =>
          Promise.resolve(mockedPostResponse),
        ),
        get: jest.fn(() =>
          Promise.resolve(mockedPostResponse),
        ),
      },
    });

    const saveButton = openstack.find("[data-test-id=\"input-save\"]");
    saveButton.trigger("click");
    await nextTick();
    expect(openstack.vm.newOpenstack).toEqual(credential);
    await nextTick();

    const alert = wrapper.findComponent(WarningAlert);
    expect(alert.exists()).toBe(false);

    // expect(wrapper.vm.$router[0].name).toBe("CloudProfile");
    expect(wrapper.vm.axios.post).toHaveBeenCalledTimes(2);
    expect(wrapper.vm.axios.get).toHaveBeenCalledTimes(1);
  });

  test("does not add invalid openstack credentials", async () => {
    const mockedPostResponse = {
      data: {
        taskId: 0,
        status: "ok",
        error: true,
        errorMessage: "",
        lcmStatuses: {
          "dlcmV2Images": true,
          "capiImages": true,
          "yaookCapiImages": true,
          "externalNetwork": true,
        },
      },
    };
    wrapper.setData({
      axios: {
        post: jest.fn(() =>
          Promise.resolve(mockedPostResponse),
        ),
        get: jest.fn(() =>
          Promise.resolve(mockedPostResponse),
        ),
      },
    });

    const saveButton = openstack.find("[data-test-id=\"input-save\"]");
    saveButton.trigger("click");
    await nextTick();
    expect(openstack.vm.newOpenstack).toEqual(credential);
    await nextTick();

    const alert = wrapper.findComponent(WarningAlert);
    // expect(alert.exists()).toBe(true);

    // expect(wrapper.vm.$router[0]).toBe(undefined);
    expect(wrapper.vm.axios.post).toHaveBeenCalledTimes(1);
    expect(wrapper.vm.axios.get).toHaveBeenCalledTimes(1);
  });

  test(
    "does not add openstack credentials without capi images when capi is on",
    async () => {
      const mockedPostResponse = {
        data: {
          taskId: 0,
          status: "ok",
          error: true,
          errorMessage: "",
          lcmStatuses: {
            "dlcmV2Images": true,
            "capiImages": false,
            "yaookCapiImages": true,
            "externalNetwork": true,
          },
        },
      };
      wrapper.setData({
        axios: {
          post: jest.fn(() =>
            Promise.resolve(mockedPostResponse),
          ),
          get: jest.fn(() =>
            Promise.resolve(mockedPostResponse),
          ),
        },
      });

      const saveButton = openstack.find("[data-test-id=\"input-save\"]");
      saveButton.trigger("click");
      await nextTick();
      expect(openstack.vm.newOpenstack).toEqual(credential);
      await nextTick();

      const alert = wrapper.findComponent(WarningAlert);
      // expect(alert.exists()).toBe(true);

      // expect(wrapper.vm.$router[0]).toBe(undefined);
      expect(wrapper.vm.axios.post).toHaveBeenCalledTimes(1);
      expect(wrapper.vm.axios.get).toHaveBeenCalledTimes(1);
    });

  test(
    "does not add openstack credentials without external network",
    async () => {
      const mockedPostResponse = {
        data: {
          taskId: 0,
          status: "ok",
          error: true,
          errorMessage: "",
          lcmStatuses: {
            "dlcmV2Images": true,
            "capiImages": true,
            "yaookCapiImages": true,
            "externalNetwork": false,
          },
        },
      };
      wrapper.setData({
        axios: {
          post: jest.fn(() =>
            Promise.resolve(mockedPostResponse),
          ),
          get: jest.fn(() =>
            Promise.resolve(mockedPostResponse),
          ),
        },
      });

      const saveButton = openstack.find("[data-test-id=\"input-save\"]");
      saveButton.trigger("click");
      await nextTick();
      expect(openstack.vm.newOpenstack).toEqual(credential);
      await nextTick();

      const alert = wrapper.findComponent(WarningAlert);
      // expect(alert.exists()).toBe(true);

      // expect(wrapper.vm.$router[0]).toBe(undefined);
      expect(wrapper.vm.axios.post).toHaveBeenCalledTimes(1);
      expect(wrapper.vm.axios.get).toHaveBeenCalledTimes(1);
    });

  test(
    "adds openstack credentials without capi images when capi is off",
    async () => {
      wrapper.setData({
        computed_account_settings: {
          enable_kubernetes_capi: false,
        },
      });
      await nextTick();

      const mockedPostResponse = {
        data: {
          taskId: 0,
          status: "ok",
          error: false,
          errorMessage: "",
          lcmStatuses: {
            "dlcmV2Images": true,
            "capiImages": false,
            "yaookCapiImages": true,
            "externalNetwork": true,
          },
        },
      };
      wrapper.setData({
        axios: {
          post: jest.fn(() =>
            Promise.resolve(mockedPostResponse),
          ),
          get: jest.fn(() =>
            Promise.resolve(mockedPostResponse),
          ),
        },
      });

      const saveButton = openstack.find("[data-test-id=\"input-save\"]");
      saveButton.trigger("click");
      await nextTick();
      expect(openstack.vm.newOpenstack).toEqual(credential);
      await nextTick();

      const alert = wrapper.findComponent(WarningAlert);
      expect(alert.exists()).toBe(false);

      // expect(wrapper.vm.$router[0].name).toBe("CloudProfile");
      expect(wrapper.vm.axios.post).toHaveBeenCalledTimes(2);
      expect(wrapper.vm.axios.get).toHaveBeenCalledTimes(1);
    });

  test("shared credentials checkbox works", async () => {
    const mockedPostResponse = {
      data: {
        taskId: 0,
        status: "ok",
        msg: {
          capiImages: true,
          dlcmV2Images: true,
          externalNetwork: true,
        },
      },
    };
    wrapper.setData({
      axios: {
        post: jest.fn(() =>
          Promise.resolve(mockedPostResponse),
        ),
        get: jest.fn(() =>
          Promise.resolve(mockedPostResponse),
        ),
      },
    });

    expect(openstack.vm.sharedCredentials).toBe(false);
    const input = openstack.find("[data-test-id=\"shared-credential\"]");
    input.trigger("click");
    await nextTick();
    expect(openstack.vm.sharedCredentials).toBe(true);

    const saveButton = openstack.find("[data-test-id=\"input-save\"]");
    saveButton.trigger("click");
    await nextTick();
    expect(openstack.vm.newOpenstack).toEqual(credential);
    await nextTick();

    const alert = wrapper.findComponent(WarningAlert);
    expect(alert.exists()).toBe(false);

    // expect(wrapper.vm.$router[0].name).toBe("CloudProfile");
    expect(wrapper.vm.axios.post).toHaveBeenCalledTimes(2);
    expect(wrapper.vm.axios.get).toHaveBeenCalledTimes(1);

    expect(wrapper.vm.axios.post).toHaveBeenLastCalledWith(
      "/server/tenants/undefined/cloud-credentials", {
        "account_params": credential,
        "provider": "openstack",
        "sharedCredentials": true,
      }, {});
  });
});
