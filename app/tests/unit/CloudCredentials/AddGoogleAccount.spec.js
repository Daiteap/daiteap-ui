import {mount, config} from "@vue/test-utils";
import {nextTick} from "vue";
import mitt from "mitt";
import {BootstrapVueNext} from "bootstrap-vue-next";
import Notifications from "@kyvg/vue3-notification";
import AddCloudCredentials from "@/components/platform/AddCloudCredentials.vue";
import AddGoogleAccount
  from "@/components/platform/addProviderCredentials/AddGoogleAccount.vue";
import WarningAlert from "@/components/platform/WarningAlert.vue";

config.silent = true;
const emitter = mitt();

describe("Add Cloud Credentials - Google", () => {
  const mockedGetResponse = {
    data: {
      credentials: [{
        id: 1,
        label: "google-1",
        provider: "google",
        type: "google",
        contact: "admin@mail.mail",
        valid: true,
        description: "desc",
        created_at: "4/1/2022",
        has_associated_environments: false,
      }],
    },
  };

  const credential = {
    label: "google-0",
    description: "desc",
    google_key: "{\"type\": \"type\",\"project_id\": \"project-id\"}",
  };

  let wrapper; let google;
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

    wrapper.setData({selectedProvider: "google"});
    await nextTick();
    google = wrapper.findComponent(AddGoogleAccount);
    google.setData({get_axiosConfig: () => {
      return {};
    }});

    // Add Credential
    let input = google.find("[data-test-id=\"input-label\"]");
    await input.setValue(credential.label);

    input = google.find("[data-test-id=\"input-description\"]");
    await input.setValue(credential.description);

    wrapper.setData({selectedProvider: "google"});
    await nextTick();

    jest.spyOn(FileReader.prototype, "readAsText")
      .mockImplementation(() => {
        return;
      });
    input = google.find("[data-test-id=\"input-key\"]");
    input.trigger("change");
    expect(FileReader.prototype.readAsText).toHaveBeenCalledTimes(1);
    google.vm.google.google_key = credential.google_key;
    google.vm.newGoogle.google_key = credential.google_key;
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  jest.spyOn(document, "getElementById")
    .mockImplementation((id) => {
      switch (id) {
      case "googleLabel":
        return {value: credential.label};
      case "googledescription":
        return {value: credential.description};
      default:
        return;
      }
    });

  test("checks if label is taken", async () => {
    const input = google.find("[data-test-id=\"input-label\"]");
    const saveButton = google.find("[data-test-id=\"input-save\"]");

    await input.setValue("google-1");
    expect(saveButton.classes().includes("deactivated")).toBe(true);

    await input.setValue("google-2");
    expect(saveButton.classes().includes("deactivated")).toBe(false);
  });

  test("adds valid google credentials", async () => {
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

    const saveButton = google.find("[data-test-id=\"input-save\"]");
    saveButton.trigger("click");
    await nextTick();
    expect(google.vm.newGoogle).toEqual(credential);
    await nextTick();

    const alert = wrapper.findComponent(WarningAlert);
    expect(alert.exists()).toBe(false);

    // expect(wrapper.vm.$router[0].name).toBe("CloudProfile");
    expect(wrapper.vm.axios.post).toHaveBeenCalledTimes(2);
    expect(wrapper.vm.axios.get).toHaveBeenCalledTimes(1);
  });

  test("does not add invalid google credentials", async () => {
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

    const saveButton = google.find("[data-test-id=\"input-save\"]");
    saveButton.trigger("click");
    await nextTick();
    expect(google.vm.newGoogle).toEqual(credential);
    await nextTick();

    const alert = wrapper.findComponent(WarningAlert);
    // expect(alert.exists()).toBe(true);

    // expect(wrapper.vm.$router[0]).toBe(undefined);
    expect(wrapper.vm.axios.post).toHaveBeenCalledTimes(1);
    expect(wrapper.vm.axios.get).toHaveBeenCalledTimes(1);
  });

  test(
    "adds google credentials without capi images or external network",
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

      const saveButton = google.find("[data-test-id=\"input-save\"]");
      saveButton.trigger("click");
      await nextTick();
      expect(google.vm.newGoogle).toEqual(credential);
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

    expect(google.vm.sharedCredentials).toBe(false);
    const input = google.find("[data-test-id=\"shared-credential\"]");
    input.trigger("click");
    await nextTick();
    expect(google.vm.sharedCredentials).toBe(true);

    const saveButton = google.find("[data-test-id=\"input-save\"]");
    saveButton.trigger("click");
    await nextTick();
    expect(google.vm.newGoogle).toEqual(credential);
    await nextTick();

    const alert = wrapper.findComponent(WarningAlert);
    expect(alert.exists()).toBe(false);

    // expect(wrapper.vm.$router[0].name).toBe("CloudProfile");
    expect(wrapper.vm.axios.post).toHaveBeenCalledTimes(2);
    expect(wrapper.vm.axios.get).toHaveBeenCalledTimes(1);

    expect(wrapper.vm.axios.post).toHaveBeenLastCalledWith(
      "/server/tenants/undefined/cloud-credentials", {
        "account_params": credential,
        "provider": "google",
        "sharedCredentials": true,
      }, {});
  });
});
