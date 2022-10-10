import { mount } from '@vue/test-utils';
import Vue from 'vue';
import axios from "axios";
import VueAxios from "vue-axios";
import { BootstrapVue } from 'bootstrap-vue';
import Notifications from 'vue-notification';
import AddCloudCredentials from '@/components/platform/AddCloudCredentials.vue';
import AddOpenstackAccount from '@/components/platform/addProviderCredentials/AddOpenstackAccount.vue';
import WarningAlert from '@/components/platform/WarningAlert.vue';

Vue.config.silent = true;
Vue.use(VueAxios, axios);
Vue.use(BootstrapVue);
Vue.use(Notifications);

describe('Add Cloud Credentials - Openstack', () => {
    const mocked_get_response = {
        data: {
            credentials: [
                {
                    id: 1,
                    label: "openstack-1",
                    provider: "openstack",
                    type: "openstack",
                    contact: "admin@mail.mail",
                    valid: true,
                    description: "desc",
                    created_at: "4/1/2022",
                    has_associated_environments: false,
                },
            ]
        },
    };
    jest.spyOn(axios, 'get').mockResolvedValue(mocked_get_response);

    let credential = {
        label: "openstack-0",
        description: "desc",
        application_credential_id: "32323232323232323232323232323232",
        application_credential_secret: "123456",
        region_name: "a1",
        auth_url: "www/url",
        external_network_id: "363636363636363636363636363636363636",
    };

    jest.spyOn(AddOpenstackAccount.methods, 'suggestParams')
        .mockImplementation(() => {
                return;
        });

    let wrapper, openstack;
    beforeEach(async () => {
        wrapper = mount(AddCloudCredentials, {
            data() {
                return {
                    computed_theme: "daiteap",
                    get_axiosConfig: () => { return {} },
                    selectedProvider: " ",
                    computed_account_settings: {
                        enable_kubernetes_capi: true,
                    },
                }
            },
            mocks: {
                $router: [],
            },
        });

        wrapper.setData({ selectedProvider: "openstack" })
        await Vue.nextTick();
        openstack = wrapper.findComponent(AddOpenstackAccount);
        openstack.setData({ get_axiosConfig: () => { return {} } });

        // Add Credential
        let input = openstack.find('[data-test-id="input-label"]');
        await input.setValue(credential.label);

        input = openstack.find('[data-test-id="input-description"]');
        await input.setValue(credential.description);

        input = openstack.find('[data-test-id="input-id"]');
        await input.setValue(credential.application_credential_id);

        input = openstack.find('[data-test-id="input-secret"]');
        await input.setValue(credential.application_credential_secret);

        input = openstack.find('[data-test-id="input-region"]');
        await input.setValue(credential.region_name);

        input = openstack.find('[data-test-id="input-url"]');
        await input.setValue(credential.auth_url);

        input = openstack.find('[data-test-id="input-network"]');
        await input.setValue(credential.external_network_id);
    });

    afterEach(async () => {
        jest.clearAllMocks();
    });

    jest.spyOn(document, 'getElementById')
        .mockImplementation((id) => {
            switch (id) {
                case 'openstackLabel':
                    return { value: credential.label };
                case 'openstackdescription':
                    return { value: credential.description };
                case 'applicationCredentialId':
                    return { value: credential.application_credential_id };
                case 'applicationCredentialSecret':
                    return { value: credential.application_credential_secret };
                case 'regionName':
                    return { value: credential.region_name };
                case 'authUrl':
                    return { value: credential.auth_url };
                case 'externalNetworkId':
                    return { value: credential.external_network_id };
                default:
                    return;
            }
        });

    test('checks if label is taken', async () => {
        let input = openstack.find('[data-test-id="input-label"]');
        let saveButton = openstack.find('[data-test-id="input-save"]');
        
        await input.setValue('openstack-1');
        expect(saveButton.attributes().disabled).toBe("disabled");

        await input.setValue('openstack-2');
        expect(saveButton.attributes().disabled).toBe(undefined);
    });

    test('adds valid openstack credentials', async () => {
        const mocked_post_response = {
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
        jest.spyOn(axios, 'post').mockResolvedValue(mocked_post_response);
        
        let saveButton = openstack.find('[data-test-id="input-save"]');
        saveButton.trigger('click');
        await Vue.nextTick();
        expect(openstack.vm.newOpenstack).toEqual(credential);
        await Vue.nextTick();

        let alert = wrapper.findComponent(WarningAlert);
        expect(alert.exists()).toBe(false);

        expect(wrapper.vm.$router[0].name).toBe("CloudProfile");
        expect(axios.post).toHaveBeenCalledTimes(3);
    });

    test('does not add invalid openstack credentials', async () => {
        const mocked_post_response = {
            data: {
                taskId: 0,
                status: "ok",
                msg: {
                    error: "",
                },
            },
        };
        jest.spyOn(axios, 'post').mockResolvedValue(mocked_post_response);

        let saveButton = openstack.find('[data-test-id="input-save"]');
        saveButton.trigger('click');
        await Vue.nextTick();
        expect(openstack.vm.newOpenstack).toEqual(credential);
        await Vue.nextTick();

        let alert = wrapper.findComponent(WarningAlert);
        expect(alert.exists()).toBe(true);

        expect(wrapper.vm.$router[0]).toBe(undefined);
        expect(axios.post).toHaveBeenCalledTimes(2);
    });

    test('does not add openstack credentials without dlcmv2 images', async () => {
        const mocked_post_response = {
            data: {
                taskId: 0,
                status: "ok",
                msg: {
                    capiImages: true,
                    dlcmV2Images: false,
                    externalNetwork: true,
                },
            },
        };
        jest.spyOn(axios, 'post').mockResolvedValue(mocked_post_response);

        let saveButton = openstack.find('[data-test-id="input-save"]');
        saveButton.trigger('click');
        await Vue.nextTick();
        expect(openstack.vm.newOpenstack).toEqual(credential);
        await Vue.nextTick();

        let alert = wrapper.findComponent(WarningAlert);
        expect(alert.exists()).toBe(true);

        expect(wrapper.vm.$router[0]).toBe(undefined);
        expect(axios.post).toHaveBeenCalledTimes(2);
    });

    test('does not add openstack credentials without capi images when capi is on', async () => {
        const mocked_post_response = {
            data: {
                taskId: 0,
                status: "ok",
                msg: {
                    capiImages: false,
                    dlcmV2Images: true,
                    externalNetwork: true,
                },
            },
        };
        jest.spyOn(axios, 'post').mockResolvedValue(mocked_post_response);

        let saveButton = openstack.find('[data-test-id="input-save"]');
        saveButton.trigger('click');
        await Vue.nextTick();
        expect(openstack.vm.newOpenstack).toEqual(credential);
        await Vue.nextTick();

        let alert = wrapper.findComponent(WarningAlert);
        expect(alert.exists()).toBe(true);

        expect(wrapper.vm.$router[0]).toBe(undefined);
        expect(axios.post).toHaveBeenCalledTimes(2);
    });

    test('does not add openstack credentials without external network', async () => {
        const mocked_post_response = {
            data: {
                taskId: 0,
                status: "ok",
                msg: {
                    capiImages: true,
                    dlcmV2Images: true,
                    externalNetwork: false,
                },
            },
        };
        jest.spyOn(axios, 'post').mockResolvedValue(mocked_post_response);

        let saveButton = openstack.find('[data-test-id="input-save"]');
        saveButton.trigger('click');
        await Vue.nextTick();
        expect(openstack.vm.newOpenstack).toEqual(credential);
        await Vue.nextTick();

        let alert = wrapper.findComponent(WarningAlert);
        expect(alert.exists()).toBe(true);

        expect(wrapper.vm.$router[0]).toBe(undefined);
        expect(axios.post).toHaveBeenCalledTimes(2);
    });

    test('adds openstack credentials without capi images when capi is off', async () => {
        wrapper.setData({ computed_account_settings: { enable_kubernetes_capi: false } })
        await Vue.nextTick();

        const mocked_post_response = {
            data: {
                taskId: 0,
                status: "ok",
                msg: {
                    capiImages: false,
                    dlcmV2Images: true,
                    externalNetwork: true,
                },
            },
        };
        jest.spyOn(axios, 'post').mockResolvedValue(mocked_post_response);

        let saveButton = openstack.find('[data-test-id="input-save"]');
        saveButton.trigger('click');
        await Vue.nextTick();
        expect(openstack.vm.newOpenstack).toEqual(credential);
        await Vue.nextTick();

        let alert = wrapper.findComponent(WarningAlert);
        expect(alert.exists()).toBe(false);

        expect(wrapper.vm.$router[0].name).toBe("CloudProfile");
        expect(axios.post).toHaveBeenCalledTimes(3);
    });

    test('shared credentials checkbox works', async () => {
        const mocked_post_response = {
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
        jest.spyOn(axios, 'post').mockResolvedValue(mocked_post_response);

        expect(openstack.vm.sharedCredentials).toBe(false);
        let input = openstack.find('[data-test-id="shared-credential"]');
        await input.setChecked();
        expect(openstack.vm.sharedCredentials).toBe(true);
        
        let saveButton = openstack.find('[data-test-id="input-save"]');
        saveButton.trigger('click');
        await Vue.nextTick();
        expect(openstack.vm.newOpenstack).toEqual(credential);
        await Vue.nextTick();

        let alert = wrapper.findComponent(WarningAlert);
        expect(alert.exists()).toBe(false);

        expect(wrapper.vm.$router[0].name).toBe("CloudProfile");
        expect(axios.post).toHaveBeenCalledTimes(3);
        
        expect(axios.post).toHaveBeenLastCalledWith(
            "/server/createCloudCredentials", {
                "account_params": credential,
                "provider": "openstack",
                "sharedCredentials": true
            }, {});
    });
});