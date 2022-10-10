import { mount } from '@vue/test-utils';
import Vue from 'vue';
import axios from "axios";
import VueAxios from "vue-axios";
import Vuex from 'vuex';
import AccountSettings from '@/components/platform/AccountSettings.vue';
import Notifications from 'vue-notification';

Vue.config.silent = true;
Vue.use(VueAxios, axios);
Vue.use(Vuex);
Vue.use(Notifications);

describe('AccountSettings.vue', () => {
  const mocked_get_response = {
    data: {
      account_settings: {
        enable_compute: true,
        enable_storage: false,
        enable_service_catalog: false,
        enable_templates: true,
        enable_kubernetes_dlcm: true,
        enable_kubernetes_k3s: false,
        enable_kubernetes_capi: false,
        enable_kubernetes_yaookcapi: false,

        providers_enable_aws: true,
        providers_enable_ali: false,
        providers_enable_azure: false,
        providers_enable_gcp: false,
        providers_enable_onprem: true,
        providers_enable_openstack: false,
        providers_enable_arm: false,
      },
      name: "Tenant",
    },
  };
  const mocked_post_response = {
    config: {
      data: {
        enable_compute: false,
        enable_storage: false,
        enable_service_catalog: false,
        enable_templates: true,
        enable_kubernetes_dlcm: false,
        enable_kubernetes_k3s: false,
        enable_kubernetes_capi: false,
        enable_kubernetes_yaookcapi: false,

        providers_enable_aws: true,
        providers_enable_ali: false,
        providers_enable_azure: false,
        providers_enable_gcp: false,
        providers_enable_onprem: true,
        providers_enable_openstack: false,
        providers_enable_arm: false,
      },
    },
  };
  jest.spyOn(axios, 'get').mockResolvedValue(mocked_get_response);
  jest.spyOn(axios, 'post').mockResolvedValue(mocked_post_response);

  let wrapper;
  beforeEach(() => {
    wrapper = mount(AccountSettings, {
      data() {
        return {
          get_axiosConfig: () => { return {} },
          boolToOnOff: (bv) => {
            if (bv) {
              return "On";
            } else {
              return "Off";
            }
          },
        }
      },
      mocks: {
        $store: new Vuex.Store({
          state: {
            account_settings: {
              enable_compute: false,
              enable_storage: false,
              enable_service_catalog: false,
              enable_templates: false,
              enable_kubernetes_dlcm: false,
              enable_kubernetes_k3s: false,
              enable_kubernetes_capi: false,
              enable_kubernetes_yaookcapi: false,

              providers_enable_aws: false,
              providers_enable_ali: false,
              providers_enable_azure: false,
              providers_enable_gcp: false,
              providers_enable_onprem: false,
              providers_enable_openstack: false,
              providers_enable_arm: false,
            },
          },
          mutations: {
            updateAccountSettings(state, account_settings) {
              state.account_settings = account_settings;
            },
          },
        }),
        $router: [],
      },
      computed: {
        computed_account_settings() {
          return this.$store.state.account_settings
        },
      },
    });
  });

  test('gets settings on mount', async () => {
    expect(axios.get).toHaveBeenCalledTimes(2);
    await Vue.nextTick();
    expect(wrapper.vm.computed_account_settings).toEqual(mocked_get_response.data.account_settings);
  });

  test('displays and changes settings correctly', async () => {
    let title = wrapper.find('[data-test-id="page-title"]');
    expect(title.text()).toBe("Tenant Settings - " + mocked_get_response.data.name);

    let saveButton = wrapper.find('[data-test-id="save-button"]');
    expect(wrapper.vm.changes).toBe(false);
    expect(saveButton.attributes().disabled).toBe("disabled");

    let button = wrapper.find('[data-test-id="compute-option-button"]').find('input[type="checkbox"]');
    let text = wrapper.find('[data-test-id="compute-option-text"]');
    expect(text.text()).toBe("On");
    button.trigger('change');
    await Vue.nextTick();
    expect(text.text()).toBe("Off");

    button = wrapper.find('[data-test-id="storage-option-button"]').find('input[type="checkbox"]');
    text = wrapper.find('[data-test-id="storage-option-text"]');
    expect(text.text()).toBe("Off");
    button.trigger('change');
    await Vue.nextTick();
    expect(text.text()).toBe("On");

    button = wrapper.find('[data-test-id="capi-option-button"]').find('input[type="checkbox"]');
    text = wrapper.find('[data-test-id="capi-option-text"]');
    expect(text.text()).toBe("Off");
    button.trigger('change');
    await Vue.nextTick();
    expect(text.text()).toBe("On");

    button = wrapper.find('[data-test-id="yaook-option-button"]').find('input[type="checkbox"]');
    text = wrapper.find('[data-test-id="yaook-option-text"]');
    expect(text.text()).toBe("Off");
    button.trigger('change');
    await Vue.nextTick();
    expect(text.text()).toBe("On");

    button = wrapper.find('[data-test-id="k3s-option-button"]').find('input[type="checkbox"]');
    text = wrapper.find('[data-test-id="k3s-option-text"]');
    expect(text.text()).toBe("Off");
    button.trigger('change');
    await Vue.nextTick();
    expect(text.text()).toBe("On");

    button = wrapper.find('[data-test-id="service-catalog-option-button"]').find('input[type="checkbox"]');
    text = wrapper.find('[data-test-id="service-catalog-option-text"]');
    expect(text.text()).toBe("Off");
    button.trigger('change');
    await Vue.nextTick();
    expect(text.text()).toBe("On");

    button = wrapper.find('[data-test-id="templates-option-button"]').find('input[type="checkbox"]');
    text = wrapper.find('[data-test-id="templates-option-text"]');
    expect(text.text()).toBe("On");
    button.trigger('change');
    await Vue.nextTick();
    expect(text.text()).toBe("Off");

    button = wrapper.find('[data-test-id="ali-option-button"]').find('input[type="checkbox"]');
    text = wrapper.find('[data-test-id="ali-option-text"]');
    expect(text.text()).toBe("Off");
    button.trigger('change');
    await Vue.nextTick();
    expect(text.text()).toBe("On");

    button = wrapper.find('[data-test-id="aws-option-button"]').find('input[type="checkbox"]');
    text = wrapper.find('[data-test-id="aws-option-text"]');
    expect(text.text()).toBe("On");
    button.trigger('change');
    await Vue.nextTick();
    expect(text.text()).toBe("Off");

    button = wrapper.find('[data-test-id="azure-option-button"]').find('input[type="checkbox"]');
    text = wrapper.find('[data-test-id="azure-option-text"]');
    expect(text.text()).toBe("Off");
    button.trigger('change');
    await Vue.nextTick();
    expect(text.text()).toBe("On");

    button = wrapper.find('[data-test-id="google-option-button"]').find('input[type="checkbox"]');
    text = wrapper.find('[data-test-id="google-option-text"]');
    expect(text.text()).toBe("Off");
    button.trigger('change');
    await Vue.nextTick();
    expect(text.text()).toBe("On");

    button = wrapper.find('[data-test-id="openstack-option-button"]').find('input[type="checkbox"]');
    text = wrapper.find('[data-test-id="openstack-option-text"]');
    expect(text.text()).toBe("Off");
    button.trigger('change');
    await Vue.nextTick();
    expect(text.text()).toBe("On");

    button = wrapper.find('[data-test-id="onpremise-option-button"]').find('input[type="checkbox"]');
    text = wrapper.find('[data-test-id="onpremise-option-text"]');
    expect(text.text()).toBe("On");
    button.trigger('change');
    await Vue.nextTick();
    expect(text.text()).toBe("Off");

    button = wrapper.find('[data-test-id="iotarm-option-button"]').find('input[type="checkbox"]');
    text = wrapper.find('[data-test-id="iotarm-option-text"]');
    expect(text.text()).toBe("Off");
    button.trigger('change');
    await Vue.nextTick();
    expect(text.text()).toBe("On");

    expect(wrapper.vm.changes).toBe(true);
    expect(saveButton.attributes().disabled).toBe(undefined);
  });

  test('saves settings successfully', async () => {
    let button = wrapper.find('[data-test-id="compute-option-button"]').find('input[type="checkbox"]');
    button.trigger('change');
    await Vue.nextTick();

    let saveButton = wrapper.find('[data-test-id="save-button"]');
    saveButton.trigger('click');
    await Vue.nextTick();

    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(wrapper.vm.computed_account_settings).toEqual(mocked_post_response.config.data);
  });
});