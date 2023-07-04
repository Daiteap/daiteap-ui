import {mount, config} from "@vue/test-utils";
import {nextTick} from "vue";
import mitt from "mitt";
import {BootstrapVueNext} from "bootstrap-vue-next";
import Notifications from "@kyvg/vue3-notification";
import AddCloudCredentials from "@/components/platform/AddCloudCredentials.vue";
import AddAzureAccount
  from "@/components/platform/addProviderCredentials/AddAzureAccount.vue";
import WarningAlert from "@/components/platform/WarningAlert.vue";

config.silent = true;
const emitter = mitt();

describe("Add Cloud Credentials - Azure", () => {
  const mockedGetResponse = {
    data: {
      credentials: [{
        id: 1,
        label: "azure-1",
        provider: "azure",
        type: "azure",
        contact: "admin@mail.mail",
        valid: true,
        description: "desc",
        created_at: "4/1/2022",
        has_associated_environments: false,
      }],
    },
  };

  const credential = {
    label: "azure-0",
    description: "desc",
    azure_tenant_id: "111111111111111111111111111111111111",
    azure_subscription_id: "111111111111111111111111111111111111",
    azure_client_id: "111111111111111111111111111111111111",
    azure_client_secret: "111111111111111111111111111111111111",
  };

  let wrapper; let azure;
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

    wrapper.setData({selectedProvider: "azure"});
    await nextTick();
    azure = wrapper.findComponent(AddAzureAccount);
    azure.setData({get_axiosConfig: () => {
      return {};
    }});

    // Add Credential
    let input = azure.find("[data-test-id=\"input-label\"]");
    await input.setValue(credential.label);

    input = azure.find("[data-test-id=\"input-description\"]");
    await input.setValue(credential.description);

    input = azure.find("[data-test-id=\"input-directory\"]");
    await input.setValue(credential.azure_tenant_id);

    input = azure.find("[data-test-id=\"input-subscription\"]");
    await input.setValue(credential.azure_subscription_id);

    input = azure.find("[data-test-id=\"input-id\"]");
    await input.setValue(credential.azure_client_id);

    input = azure.find("[data-test-id=\"input-secret\"]");
    await input.setValue(credential.azure_client_secret);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  jest.spyOn(document, "getElementById")
    .mockImplementation((id) => {
      switch (id) {
      case "azureLabel":
        return {value: credential.label};
      case "azuredescription":
        return {value: credential.description};
      case "azureTenantID":
        return {value: credential.azure_tenant_id};
      case "azureSubscriptionID":
        return {value: credential.azure_subscription_id};
      case "azureClientID":
        return {value: credential.azure_client_id};
      case "azureClientSecret":
        return {value: credential.azure_client_secret};
      default:
        return;
      }
    });

  test("checks if label is taken", async () => {
    const input = azure.find("[data-test-id=\"input-label\"]");
    const saveButton = azure.find("[data-test-id=\"input-save\"]");

    await input.setValue("azure-1");
    expect(saveButton.classes().includes("deactivated")).toBe(true);

    await input.setValue("azure-2");
    expect(saveButton.classes().includes("deactivated")).toBe(false);
  });

  test("adds valid azure credentials", async () => {
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

    const saveButton = azure.find("[data-test-id=\"input-save\"]");
    saveButton.trigger("click");
    await nextTick();
    expect(azure.vm.newAzure).toEqual(credential);
    await nextTick();

    const alert = wrapper.findComponent(WarningAlert);
    expect(alert.exists()).toBe(false);

    // expect(wrapper.vm.$router[0].name).toBe("CloudProfile");
    expect(wrapper.vm.axios.post).toHaveBeenCalledTimes(2);
    expect(wrapper.vm.axios.get).toHaveBeenCalledTimes(1);
  });

  test("does not add invalid azure credentials", async () => {
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

    const saveButton = azure.find("[data-test-id=\"input-save\"]");
    saveButton.trigger("click");
    await nextTick();
    expect(azure.vm.newAzure).toEqual(credential);
    await nextTick();

    const alert = wrapper.findComponent(WarningAlert);
    // expect(alert.exists()).toBe(true);

    // expect(wrapper.vm.$router[0]).toBe(undefined);
    expect(wrapper.vm.axios.post).toHaveBeenCalledTimes(1);
    expect(wrapper.vm.axios.get).toHaveBeenCalledTimes(1);
  });

  test(
    "adds azure credentials without capi images or external network",
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

      const saveButton = azure.find("[data-test-id=\"input-save\"]");
      saveButton.trigger("click");
      await nextTick();
      expect(azure.vm.newAzure).toEqual(credential);
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

    expect(azure.vm.sharedCredentials).toBe(false);
    const input = azure.find("[data-test-id=\"shared-credential\"]");
    input.trigger("click");
    await nextTick();
    expect(azure.vm.sharedCredentials).toBe(true);

    const saveButton = azure.find("[data-test-id=\"input-save\"]");
    saveButton.trigger("click");
    await nextTick();
    expect(azure.vm.newAzure).toEqual(credential);
    await nextTick();

    const alert = wrapper.findComponent(WarningAlert);
    expect(alert.exists()).toBe(false);

    // expect(wrapper.vm.$router[0].name).toBe("CloudProfile");
    expect(wrapper.vm.axios.post).toHaveBeenCalledTimes(2);
    expect(wrapper.vm.axios.get).toHaveBeenCalledTimes(1);

    expect(wrapper.vm.axios.post).toHaveBeenLastCalledWith(
      "/server/tenants/undefined/cloud-credentials", {
        "account_params": credential,
        "provider": "azure",
        "sharedCredentials": true,
      }, {});
  });
});
