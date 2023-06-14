import {mount} from "@vue/test-utils";
import Vue from "vue";
import axios from "axios";
import VueAxios from "vue-axios";
import {BootstrapVue} from "bootstrap-vue";
import Notifications from "vue-notification";
import AddCloudCredentials from "@/components/platform/AddCloudCredentials.vue";
import AddIotArmAccount
  from "@/components/platform/addProviderCredentials/AddIotArmAccount.vue";
import WarningAlert from "@/components/platform/WarningAlert.vue";

Vue.config.silent = true;
Vue.use(VueAxios, axios);
Vue.use(BootstrapVue);
Vue.use(Notifications);

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
    wrapper = mount(AddCloudCredentials, {
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
      },
    });

    wrapper.setData({selectedProvider: "iotarm"});
    await Vue.nextTick();
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
    jest.spyOn(axios, "post").mockResolvedValue(mockedPostResponse);
    jest.spyOn(axios, "get").mockResolvedValue(mockedPostResponse);

    const saveButton = iotarm.find("[data-test-id=\"input-save\"]");
    saveButton.trigger("click");
    await Vue.nextTick();
    expect(iotarm.vm.newIotArme).toEqual(credential);
    await Vue.nextTick();

    const alert = wrapper.findComponent(WarningAlert);
    expect(alert.exists()).toBe(false);

    expect(wrapper.vm.$router[0].name).toBe("CloudProfile");
    expect(axios.post).toHaveBeenCalledTimes(2);
    expect(axios.get).toHaveBeenCalledTimes(1);
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
    jest.spyOn(axios, "post").mockResolvedValue(mockedPostResponse);
    jest.spyOn(axios, "get").mockResolvedValue(mockedPostResponse);

    const saveButton = iotarm.find("[data-test-id=\"input-save\"]");
    saveButton.trigger("click");
    await Vue.nextTick();
    expect(iotarm.vm.newIotArme).toEqual(credential);
    await Vue.nextTick();

    const alert = wrapper.findComponent(WarningAlert);
    expect(alert.exists()).toBe(true);

    expect(wrapper.vm.$router[0]).toBe(undefined);
    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledTimes(1);
  });

  test("adds iot arm credentials without capi images or external network", async () => {
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
    jest.spyOn(axios, "post").mockResolvedValue(mockedPostResponse);
    jest.spyOn(axios, "get").mockResolvedValue(mockedPostResponse);

    const saveButton = iotarm.find("[data-test-id=\"input-save\"]");
    saveButton.trigger("click");
    await Vue.nextTick();
    expect(iotarm.vm.newIotArme).toEqual(credential);
    await Vue.nextTick();

    const alert = wrapper.findComponent(WarningAlert);
    expect(alert.exists()).toBe(false);

    expect(wrapper.vm.$router[0].name).toBe("CloudProfile");
    expect(axios.post).toHaveBeenCalledTimes(2);
    expect(axios.get).toHaveBeenCalledTimes(1);
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
    jest.spyOn(axios, "post").mockResolvedValue(mockedPostResponse);
    jest.spyOn(axios, "get").mockResolvedValue(mockedPostResponse);

    expect(iotarm.vm.sharedCredentials).toBe(false);
    const input = iotarm.find("[data-test-id=\"shared-credential\"]");
    input.trigger("click");
    await Vue.nextTick();
    expect(iotarm.vm.sharedCredentials).toBe(true);

    const saveButton = iotarm.find("[data-test-id=\"input-save\"]");
    saveButton.trigger("click");
    await Vue.nextTick();
    expect(iotarm.vm.newIotArme).toEqual(credential);
    await Vue.nextTick();

    const alert = wrapper.findComponent(WarningAlert);
    expect(alert.exists()).toBe(false);

    expect(wrapper.vm.$router[0].name).toBe("CloudProfile");
    expect(axios.post).toHaveBeenCalledTimes(2);
    expect(axios.get).toHaveBeenCalledTimes(1);

    expect(axios.post).toHaveBeenLastCalledWith(
      "/server/tenants/undefined/cloud-credentials", {
        "account_params": credential,
        "provider": "iotarm",
        "sharedCredentials": true,
      }, {});
  });
});
