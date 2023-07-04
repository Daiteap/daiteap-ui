import {mount, config} from "@vue/test-utils";
import {nextTick} from "vue";
import mitt from "mitt";
import {BootstrapVueNext} from "bootstrap-vue-next";
import Notifications from "@kyvg/vue3-notification";
import AddCloudCredentials from "@/components/platform/AddCloudCredentials.vue";
import AddOnpremiseAccount
  from "@/components/platform/addProviderCredentials/AddOnpremiseAccount.vue";
import WarningAlert from "@/components/platform/WarningAlert.vue";

config.silent = true;
const emitter = mitt();

describe("Add Cloud Credentials - On Premise", () => {
  const mockedGetResponse = {
    data: {
      credentials: [{
        id: 1,
        label: "onpremise-1",
        provider: "onpremise",
        type: "onpremise",
        contact: "admin@mail.mail",
        valid: true,
        description: "desc",
        created_at: "4/1/2022",
        has_associated_environments: false,
      }],
    },
  };

  const credential = {
    label: "onpremise-0",
    description: "desc",
    gw_public_ip: "aaaaaaaaaa",
    gw_private_ip: "aaaaaaaaaa",
    admin_username: "aaaaaaaaaa",
    admin_private_key: "aaaaaaaaaa",
    admin_private_key_password: "aaaaaaaaaa",
  };

  let wrapper; let onpremise;
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

    wrapper.setData({selectedProvider: "onpremise"});
    await nextTick();
    onpremise = wrapper.findComponent(AddOnpremiseAccount);
    onpremise.setData({get_axiosConfig: () => {
      return {};
    }});

    // Add Credential
    let input = onpremise.find("[data-test-id=\"input-label\"]");
    await input.setValue(credential.label);

    input = onpremise.find("[data-test-id=\"input-description\"]");
    await input.setValue(credential.description);

    input = onpremise.find("[data-test-id=\"input-public\"]");
    await input.setValue(credential.gw_public_ip);

    input = onpremise.find("[data-test-id=\"input-private\"]");
    await input.setValue(credential.gw_private_ip);

    input = onpremise.find("[data-test-id=\"input-username\"]");
    await input.setValue(credential.admin_username);

    jest.spyOn(FileReader.prototype, "readAsText")
      .mockImplementation(() => {
        return;
      });
    input = onpremise.find("[data-test-id=\"input-key\"]");
    input.trigger("change");
    expect(FileReader.prototype.readAsText).toHaveBeenCalledTimes(1);
    onpremise.vm.onpremise.admin_private_key = credential.admin_private_key;
    onpremise.vm.newOnpremise.admin_private_key = credential.admin_private_key;

    input = onpremise.find("[data-test-id=\"input-password\"]");
    await input.setValue(credential.admin_private_key_password);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  jest.spyOn(document, "getElementById")
    .mockImplementation((id) => {
      switch (id) {
      case "onPremislabel":
        return {value: credential.label};
      case "onpremisedescription":
        return {value: credential.description};
      case "gwPublicIP":
        return {value: credential.gw_public_ip};
      case "gwPrivateIP":
        return {value: credential.gw_private_ip};
      case "adminUsername":
        return {value: credential.admin_username};
      case "adminPrivateKeyPassword":
        return {value: credential.admin_private_key_password};
      default:
        return;
      }
    });

  test("checks if label is taken", async () => {
    const input = onpremise.find("[data-test-id=\"input-label\"]");
    const saveButton = onpremise.find("[data-test-id=\"input-save\"]");

    await input.setValue("onpremise-1");
    expect(saveButton.classes().includes("deactivated")).toBe(true);

    await input.setValue("onpremise-2");
    expect(saveButton.classes().includes("deactivated")).toBe(false);
  });

  test("adds valid on-premise credentials", async () => {
    const mockedPostResponse = {
      data: {
        taskId: 0,
        status: "ok",
        msg: {
          dlcmV2Images: true,
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

    const saveButton = onpremise.find("[data-test-id=\"input-save\"]");
    saveButton.trigger("click");
    await nextTick();
    expect(onpremise.vm.newOnpremise).toEqual(credential);
    await nextTick();

    const alert = wrapper.findComponent(WarningAlert);
    expect(alert.exists()).toBe(false);

    // expect(wrapper.vm.$router[0].name).toBe("CloudProfile");
    expect(wrapper.vm.axios.post).toHaveBeenCalledTimes(2);
    expect(wrapper.vm.axios.get).toHaveBeenCalledTimes(1);
  });

  test("does not add invalid on-premise credentials", async () => {
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

    const saveButton = onpremise.find("[data-test-id=\"input-save\"]");
    saveButton.trigger("click");
    await nextTick();
    expect(onpremise.vm.newOnpremise).toEqual(credential);
    await nextTick();

    const alert = wrapper.findComponent(WarningAlert);
    // expect(alert.exists()).toBe(true);

    // expect(wrapper.vm.$router[0]).toBe(undefined);
    expect(wrapper.vm.axios.post).toHaveBeenCalledTimes(1);
    expect(wrapper.vm.axios.get).toHaveBeenCalledTimes(1);
  });

  test(
    "adds on-premise credentials without capi images or external network",
    async () => {
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

      const saveButton = onpremise.find("[data-test-id=\"input-save\"]");
      saveButton.trigger("click");
      await nextTick();
      expect(onpremise.vm.newOnpremise).toEqual(credential);
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
          dlcmV2Images: true,
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

    expect(onpremise.vm.sharedCredentials).toBe(false);
    const input = onpremise.find("[data-test-id=\"shared-credential\"]");
    input.trigger("click");
    await nextTick();
    expect(onpremise.vm.sharedCredentials).toBe(true);

    const saveButton = onpremise.find("[data-test-id=\"input-save\"]");
    saveButton.trigger("click");
    await nextTick();
    expect(onpremise.vm.newOnpremise).toEqual(credential);
    await nextTick();

    const alert = wrapper.findComponent(WarningAlert);
    expect(alert.exists()).toBe(false);

    // expect(wrapper.vm.$router[0].name).toBe("CloudProfile");
    expect(wrapper.vm.axios.post).toHaveBeenCalledTimes(2);
    expect(wrapper.vm.axios.get).toHaveBeenCalledTimes(1);

    expect(wrapper.vm.axios.post).toHaveBeenLastCalledWith(
      "/server/tenants/undefined/cloud-credentials", {
        "account_params": credential,
        "provider": "onpremise",
        "sharedCredentials": true,
      }, {});
  });
});
