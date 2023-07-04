import {mount, config} from "@vue/test-utils";
import {nextTick} from "vue";
import mitt from "mitt";
import {BootstrapVueNext} from "bootstrap-vue-next";
import Notifications from "@kyvg/vue3-notification";
import AddCloudCredentials from "@/components/platform/AddCloudCredentials.vue";
import AddIotArmAccount
  from "@/components/platform/addProviderCredentials/AddIotArmAccount.vue";
import WarningAlert from "@/components/platform/WarningAlert.vue";

config.silent = true;
const emitter = mitt();

describe("Add Cloud Credentials - IOT ARM", () => {
  const mockedGetResponse = {
    data: {
      credentials: [{
        id: 1,
        label: "iotarm-1",
        provider: "iotarm",
        type: "iotarm",
        contact: "admin@mail.mail",
        valid: true,
        description: "desc",
        created_at: "4/1/2022",
        has_associated_environments: false,
      }],
    },
  };

  const credential = {
    label: "iotarm-0",
    description: "desc",
    vpcCidr: "aaaaaaaaaa",
    gw_public_ip: "aaaaaaaaaa",
    gw_private_ip: "aaaaaaaaaa",
    admin_username: "aaaaaaaaaa",
    admin_private_key: "aaaaaaaaaa",
    admin_private_key_password: "aaaaaaaaaa",
  };

  let wrapper; let iotarm;
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

    wrapper.setData({selectedProvider: "iotarm"});
    await nextTick();
    iotarm = wrapper.findComponent(AddIotArmAccount);
    iotarm.setData({get_axiosConfig: () => {
      return {};
    }});

    // Add Credential
    let input = iotarm.find("[data-test-id=\"input-label\"]");
    await input.setValue(credential.label);

    input = iotarm.find("[data-test-id=\"input-description\"]");
    await input.setValue(credential.description);

    input = iotarm.find("[data-test-id=\"input-vpc\"]");
    await input.setValue(credential.vpcCidr);

    input = iotarm.find("[data-test-id=\"input-public\"]");
    await input.setValue(credential.gw_public_ip);

    input = iotarm.find("[data-test-id=\"input-private\"]");
    await input.setValue(credential.gw_private_ip);

    input = iotarm.find("[data-test-id=\"input-username\"]");
    await input.setValue(credential.admin_username);

    jest.spyOn(FileReader.prototype, "readAsText")
      .mockImplementation(() => {
        return;
      });
    input = iotarm.find("[data-test-id=\"input-key\"]");
    input.trigger("change");
    expect(FileReader.prototype.readAsText).toHaveBeenCalledTimes(1);
    iotarm.vm.iotarm.admin_private_key = credential.admin_private_key;
    iotarm.vm.newIotArme.admin_private_key = credential.admin_private_key;

    input = iotarm.find("[data-test-id=\"input-password\"]");
    await input.setValue(credential.admin_private_key_password);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  jest.spyOn(document, "getElementById")
    .mockImplementation((id) => {
      switch (id) {
      case "iotarmlabel":
        return {value: credential.label};
      case "iotarmdescription":
        return {value: credential.description};
      case "vpcCidr":
        return {value: credential.vpcCidr};
      case "iotGwPublicIP":
        return {value: credential.gw_public_ip};
      case "iotGwPrivateIP":
        return {value: credential.gw_private_ip};
      case "iotAdminUsername":
        return {value: credential.admin_username};
      case "iotAdminPrivateKeyPassword":
        return {value: credential.admin_private_key_password};
      default:
        return;
      }
    });

  test("checks if label is taken", async () => {
    const input = iotarm.find("[data-test-id=\"input-label\"]");
    const saveButton = iotarm.find("[data-test-id=\"input-save\"]");

    await input.setValue("iotarm-1");
    expect(saveButton.classes().includes("deactivated")).toBe(true);

    await input.setValue("iotarm-2");
    expect(saveButton.classes().includes("deactivated")).toBe(false);
  });

  test("adds valid iot arm credentials", async () => {
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

    const saveButton = iotarm.find("[data-test-id=\"input-save\"]");
    saveButton.trigger("click");
    await nextTick();
    expect(iotarm.vm.newIotArme).toEqual(credential);
    await nextTick();

    const alert = wrapper.findComponent(WarningAlert);
    expect(alert.exists()).toBe(false);

    // expect(wrapper.vm.$router[0].name).toBe("CloudProfile");
    expect(wrapper.vm.axios.post).toHaveBeenCalledTimes(2);
    expect(wrapper.vm.axios.get).toHaveBeenCalledTimes(1);
  });

  test("does not add invalid iot arm credentials", async () => {
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

    const saveButton = iotarm.find("[data-test-id=\"input-save\"]");
    saveButton.trigger("click");
    await nextTick();
    expect(iotarm.vm.newIotArme).toEqual(credential);
    await nextTick();

    const alert = wrapper.findComponent(WarningAlert);
    // expect(alert.exists()).toBe(true);

    // expect(wrapper.vm.$router[0]).toBe(undefined);
    expect(wrapper.vm.axios.post).toHaveBeenCalledTimes(1);
    expect(wrapper.vm.axios.get).toHaveBeenCalledTimes(1);
  });

  test(
    "adds iot arm credentials without capi images or external network",
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

      const saveButton = iotarm.find("[data-test-id=\"input-save\"]");
      saveButton.trigger("click");
      await nextTick();
      expect(iotarm.vm.newIotArme).toEqual(credential);
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

    expect(iotarm.vm.sharedCredentials).toBe(false);
    const input = iotarm.find("[data-test-id=\"shared-credential\"]");
    input.trigger("click");
    await nextTick();
    expect(iotarm.vm.sharedCredentials).toBe(true);

    const saveButton = iotarm.find("[data-test-id=\"input-save\"]");
    saveButton.trigger("click");
    await nextTick();
    expect(iotarm.vm.newIotArme).toEqual(credential);
    await nextTick();

    const alert = wrapper.findComponent(WarningAlert);
    expect(alert.exists()).toBe(false);

    // expect(wrapper.vm.$router[0].name).toBe("CloudProfile");
    expect(wrapper.vm.axios.post).toHaveBeenCalledTimes(2);
    expect(wrapper.vm.axios.get).toHaveBeenCalledTimes(1);

    expect(wrapper.vm.axios.post).toHaveBeenLastCalledWith(
      "/server/tenants/undefined/cloud-credentials", {
        "account_params": credential,
        "provider": "iotarm",
        "sharedCredentials": true,
      }, {});
  });
});
