import { mount } from '@vue/test-utils';
import Vue from 'vue';
import axios from "axios";
import VueAxios from "vue-axios";
import { BootstrapVue } from 'bootstrap-vue';
import Notifications from 'vue-notification';
import AddCloudCredentials from '@/components/platform/AddCloudCredentials.vue';
import AddOnpremiseAccount from '@/components/platform/addProviderCredentials/AddOnpremiseAccount.vue';
import WarningAlert from '@/components/platform/WarningAlert.vue';

Vue.config.silent = true;
Vue.use(VueAxios, axios);
Vue.use(BootstrapVue);
Vue.use(Notifications);

describe('Add Cloud Credentials - On Premise', () => {
    const mocked_get_response = {
        data: {
            credentials: [
                {
                    id: 1,
                    label: "onpremise-1",
                    provider: "onpremise",
                    type: "onpremise",
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
        label: "onpremise-0",
        description: "desc",
        gw_public_ip: "aaaaaaaaaa",
        gw_private_ip: "aaaaaaaaaa",
        admin_username: "aaaaaaaaaa",
        admin_private_key: "aaaaaaaaaa",
        admin_private_key_password: "aaaaaaaaaa",
    };

    let wrapper, onpremise;
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

        wrapper.setData({ selectedProvider: "onpremise" })
        await Vue.nextTick();
        onpremise = wrapper.findComponent(AddOnpremiseAccount);
        onpremise.setData({ get_axiosConfig: () => { return {} } });

        // Add Credential
        let input = onpremise.find('[data-test-id="input-label"]');
        await input.setValue(credential.label);

        input = onpremise.find('[data-test-id="input-description"]');
        await input.setValue(credential.description);

        input = onpremise.find('[data-test-id="input-public"]');
        await input.setValue(credential.gw_public_ip);

        input = onpremise.find('[data-test-id="input-private"]');
        await input.setValue(credential.gw_private_ip);

        input = onpremise.find('[data-test-id="input-username"]');
        await input.setValue(credential.admin_username);

        jest.spyOn(FileReader.prototype, 'readAsText')
        .mockImplementation(() => {
                return;
        });
        input = onpremise.find('[data-test-id="input-key"]');
        input.trigger('change')
        expect(FileReader.prototype.readAsText).toHaveBeenCalledTimes(1);
        onpremise.vm.onpremise.admin_private_key = credential.admin_private_key;
        onpremise.vm.newOnpremise.admin_private_key = credential.admin_private_key;
        
        input = onpremise.find('[data-test-id="input-password"]');
        await input.setValue(credential.admin_private_key_password);
    });

    afterEach(async () => {
        jest.clearAllMocks();
    });

    jest.spyOn(document, 'getElementById')
        .mockImplementation((id) => {
            switch (id) {
                case 'onPremislabel':
                    return { value: credential.label };
                case 'onpremisedescription':
                    return { value: credential.description };
                case 'gwPublicIP':
                    return { value: credential.gw_public_ip };
                case 'gwPrivateIP':
                    return { value: credential.gw_private_ip };
                case 'adminUsername':
                    return { value: credential.admin_username };
                case 'adminPrivateKeyPassword':
                    return { value: credential.admin_private_key_password };
                default:
                    return;
            }
        });

    test('checks if label is taken', async () => {
        let input = onpremise.find('[data-test-id="input-label"]');
        let saveButton = onpremise.find('[data-test-id="input-save"]');

        await input.setValue('onpremise-1');
        expect(saveButton.attributes().disabled).toBe("disabled");

        await input.setValue('onpremise-2');
        expect(saveButton.attributes().disabled).toBe(undefined);
    });

    test('adds valid on-premise credentials', async () => {
        const mocked_post_response = {
            data: {
                taskId: 0,
                status: "ok",
                msg: {
                    dlcmV2Images: true,
                },
            },
        };
        jest.spyOn(axios, 'post').mockResolvedValue(mocked_post_response);

        let saveButton = onpremise.find('[data-test-id="input-save"]');
        saveButton.trigger('click');
        await Vue.nextTick();
        expect(onpremise.vm.newOnpremise).toEqual(credential);
        await Vue.nextTick();

        let alert = wrapper.findComponent(WarningAlert);
        expect(alert.exists()).toBe(false);

        expect(wrapper.vm.$router[0].name).toBe("CloudProfile");
        expect(axios.post).toHaveBeenCalledTimes(3);
    });

    test('does not add invalid on-premise credentials', async () => {
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

        let saveButton = onpremise.find('[data-test-id="input-save"]');
        saveButton.trigger('click');
        await Vue.nextTick();
        expect(onpremise.vm.newOnpremise).toEqual(credential);
        await Vue.nextTick();

        let alert = wrapper.findComponent(WarningAlert);
        expect(alert.exists()).toBe(true);

        expect(wrapper.vm.$router[0]).toBe(undefined);
        expect(axios.post).toHaveBeenCalledTimes(2);
    });

    test('does not add on-premise credentials without dlcmv2 images', async () => {
        const mocked_post_response = {
            data: {
                taskId: 0,
                status: "ok",
                msg: {
                    dlcmV2Images: false,
                },
            },
        };
        jest.spyOn(axios, 'post').mockResolvedValue(mocked_post_response);

        let saveButton = onpremise.find('[data-test-id="input-save"]');
        saveButton.trigger('click');
        await Vue.nextTick();
        expect(onpremise.vm.newOnpremise).toEqual(credential);
        await Vue.nextTick();

        let alert = wrapper.findComponent(WarningAlert);
        expect(alert.exists()).toBe(true);

        expect(wrapper.vm.$router[0]).toBe(undefined);
        expect(axios.post).toHaveBeenCalledTimes(2);
    });

    test('adds on-premise credentials without capi images or external network', async () => {
        const mocked_post_response = {
            data: {
                taskId: 0,
                status: "ok",
                msg: {
                    capiImages: false,
                    dlcmV2Images: true,
                    externalNetwork: false,
                },
            },
        };
        jest.spyOn(axios, 'post').mockResolvedValue(mocked_post_response);

        let saveButton = onpremise.find('[data-test-id="input-save"]');
        saveButton.trigger('click');
        await Vue.nextTick();
        expect(onpremise.vm.newOnpremise).toEqual(credential);
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
                    dlcmV2Images: true,
                },
            },
        };
        jest.spyOn(axios, 'post').mockResolvedValue(mocked_post_response);

        expect(onpremise.vm.sharedCredentials).toBe(false);
        let input = onpremise.find('[data-test-id="shared-credential"]');
        await input.setChecked();
        expect(onpremise.vm.sharedCredentials).toBe(true);
        
        let saveButton = onpremise.find('[data-test-id="input-save"]');
        saveButton.trigger('click');
        await Vue.nextTick();
        expect(onpremise.vm.newOnpremise).toEqual(credential);
        await Vue.nextTick();

        let alert = wrapper.findComponent(WarningAlert);
        expect(alert.exists()).toBe(false);

        expect(wrapper.vm.$router[0].name).toBe("CloudProfile");
        expect(axios.post).toHaveBeenCalledTimes(3);
        
        expect(axios.post).toHaveBeenLastCalledWith(
            "/server/createCloudCredentials", {
                "account_params": credential,
                "provider": "onpremise",
                "sharedCredentials": true
            }, {});
    });
});