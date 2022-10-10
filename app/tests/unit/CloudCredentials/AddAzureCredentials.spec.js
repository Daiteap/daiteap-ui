import { mount } from '@vue/test-utils';
import Vue from 'vue';
import axios from "axios";
import VueAxios from "vue-axios";
import { BootstrapVue } from 'bootstrap-vue';
import Notifications from 'vue-notification';
import AddCloudCredentials from '@/components/platform/AddCloudCredentials.vue';
import AddAzureAccount from '@/components/platform/addProviderCredentials/AddAzureAccount.vue';
import WarningAlert from '@/components/platform/WarningAlert.vue';

Vue.config.silent = true;
Vue.use(VueAxios, axios);
Vue.use(BootstrapVue);
Vue.use(Notifications);

describe('Add Cloud Credentials - Azure', () => {
    const mocked_get_response = {
        data: {
            credentials: [
                {
                    id: 1,
                    label: "azure-1",
                    provider: "azure",
                    type: "azure",
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
        label: "azure-0",
        description: "desc",
        azure_tenant_id: "111111111111111111111111111111111111",
        azure_subscription_id: "111111111111111111111111111111111111",
        azure_client_id: "111111111111111111111111111111111111",
        azure_client_secret: "111111111111111111111111111111111111",
    };

    let wrapper, azure;
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

        wrapper.setData({ selectedProvider: "azure" })
        await Vue.nextTick();
        azure = wrapper.findComponent(AddAzureAccount);
        azure.setData({ get_axiosConfig: () => { return {} } });

        // Add Credential
        let input = azure.find('[data-test-id="input-label"]');
        await input.setValue(credential.label);

        input = azure.find('[data-test-id="input-description"]');
        await input.setValue(credential.description);

        input = azure.find('[data-test-id="input-directory"]');
        await input.setValue(credential.azure_tenant_id);

        input = azure.find('[data-test-id="input-subscription"]');
        await input.setValue(credential.azure_subscription_id);

        input = azure.find('[data-test-id="input-id"]');
        await input.setValue(credential.azure_client_id);

        input = azure.find('[data-test-id="input-secret"]');
        await input.setValue(credential.azure_client_secret);
    });

    afterEach(async () => {
        jest.clearAllMocks();
    });

    jest.spyOn(document, 'getElementById')
        .mockImplementation((id) => {
            switch (id) {
                case 'azureLabel':
                    return { value: credential.label };
                case 'azuredescription':
                    return { value: credential.description };
                case 'azureTenantID':
                    return { value: credential.azure_tenant_id };
                case 'azureSubscriptionID':
                    return { value: credential.azure_subscription_id };
                case 'azureClientID':
                    return { value: credential.azure_client_id };
                case 'azureClientSecret':
                    return { value: credential.azure_client_secret };
                default:
                    return;
            }
        });

    test('checks if label is taken', async () => {
        let input = azure.find('[data-test-id="input-label"]');
        let saveButton = azure.find('[data-test-id="input-save"]');

        await input.setValue('azure-1');
        expect(saveButton.attributes().disabled).toBe("disabled");

        await input.setValue('azure-2');
        expect(saveButton.attributes().disabled).toBe(undefined);
    });

    test('adds valid azure credentials', async () => {
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

        let saveButton = azure.find('[data-test-id="input-save"]');
        saveButton.trigger('click');
        await Vue.nextTick();
        expect(azure.vm.newAzure).toEqual(credential);
        await Vue.nextTick();

        let alert = wrapper.findComponent(WarningAlert);
        expect(alert.exists()).toBe(false);

        expect(wrapper.vm.$router[0].name).toBe("CloudProfile");
        expect(axios.post).toHaveBeenCalledTimes(3);
    });

    test('does not add invalid azure credentials', async () => {
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

        let saveButton = azure.find('[data-test-id="input-save"]');
        saveButton.trigger('click');
        await Vue.nextTick();
        expect(azure.vm.newAzure).toEqual(credential);
        await Vue.nextTick();

        let alert = wrapper.findComponent(WarningAlert);
        expect(alert.exists()).toBe(true);

        expect(wrapper.vm.$router[0]).toBe(undefined);
        expect(axios.post).toHaveBeenCalledTimes(2);
    });

    test('does not add azure credentials without dlcmv2 images', async () => {
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

        let saveButton = azure.find('[data-test-id="input-save"]');
        saveButton.trigger('click');
        await Vue.nextTick();
        expect(azure.vm.newAzure).toEqual(credential);
        await Vue.nextTick();

        let alert = wrapper.findComponent(WarningAlert);
        expect(alert.exists()).toBe(true);

        expect(wrapper.vm.$router[0]).toBe(undefined);
        expect(axios.post).toHaveBeenCalledTimes(2);
    });

    test('adds azure credentials without capi images or external network', async () => {
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

        let saveButton = azure.find('[data-test-id="input-save"]');
        saveButton.trigger('click');
        await Vue.nextTick();
        expect(azure.vm.newAzure).toEqual(credential);
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

        expect(azure.vm.sharedCredentials).toBe(false);
        let input = azure.find('[data-test-id="shared-credential"]');
        await input.setChecked();
        expect(azure.vm.sharedCredentials).toBe(true);
        
        let saveButton = azure.find('[data-test-id="input-save"]');
        saveButton.trigger('click');
        await Vue.nextTick();
        expect(azure.vm.newAzure).toEqual(credential);
        await Vue.nextTick();

        let alert = wrapper.findComponent(WarningAlert);
        expect(alert.exists()).toBe(false);

        expect(wrapper.vm.$router[0].name).toBe("CloudProfile");
        expect(axios.post).toHaveBeenCalledTimes(3);
        
        expect(axios.post).toHaveBeenLastCalledWith(
            "/server/createCloudCredentials", {
                "account_params": credential,
                "provider": "azure",
                "sharedCredentials": true
            }, {});
    });
});