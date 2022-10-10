import { mount } from '@vue/test-utils';
import Vue from 'vue';
import axios from "axios";
import VueAxios from "vue-axios";
import { BootstrapVue } from 'bootstrap-vue';
import Notifications from 'vue-notification';
import AddCloudCredentials from '@/components/platform/AddCloudCredentials.vue';
import AddGoogleAccount from '@/components/platform/addProviderCredentials/AddGoogleAccount.vue';
import WarningAlert from '@/components/platform/WarningAlert.vue';

Vue.config.silent = true;
Vue.use(VueAxios, axios);
Vue.use(BootstrapVue);
Vue.use(Notifications);

describe('Add Cloud Credentials - Google', () => {
    const mocked_get_response = {
        data: {
            credentials: [
                {
                    id: 1,
                    label: "google-1",
                    provider: "google",
                    type: "google",
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
        label: "google-0",
        description: "desc",
        google_key: '{"type": "type","project_id": "project-id"}',
    };

    let wrapper, google;
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

        wrapper.setData({ selectedProvider: "google" })
        await Vue.nextTick();
        google = wrapper.findComponent(AddGoogleAccount);
        google.setData({ get_axiosConfig: () => { return {} } });

        // Add Credential
        let input = google.find('[data-test-id="input-label"]');
        await input.setValue(credential.label);

        input = google.find('[data-test-id="input-description"]');
        await input.setValue(credential.description);

        wrapper.setData({ selectedProvider: "google" })
        await Vue.nextTick();

        jest.spyOn(FileReader.prototype, 'readAsText')
        .mockImplementation(() => {
                return;
        });
        input = google.find('[data-test-id="input-key"]');
        input.trigger('change')
        expect(FileReader.prototype.readAsText).toHaveBeenCalledTimes(1);
        google.vm.google.google_key = credential.google_key;
        google.vm.newGoogle.google_key = credential.google_key;
    });

    afterEach(async () => {
        jest.clearAllMocks();
    });

    jest.spyOn(document, 'getElementById')
        .mockImplementation((id) => {
            switch (id) {
                case 'googleLabel':
                    return { value: credential.label };
                case 'googledescription':
                    return { value: credential.description };
                default:
                    return;
            }
        });

    test('checks if label is taken', async () => {
        let input = google.find('[data-test-id="input-label"]');
        let saveButton = google.find('[data-test-id="input-save"]');
        
        await input.setValue('google-1');
        expect(saveButton.attributes().disabled).toBe("disabled");

        await input.setValue('google-2');
        expect(saveButton.attributes().disabled).toBe(undefined);
    });

    test('adds valid google credentials', async () => {
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
        
        let saveButton = google.find('[data-test-id="input-save"]');
        saveButton.trigger('click');
        await Vue.nextTick();
        expect(google.vm.newGoogle).toEqual(credential);
        await Vue.nextTick();

        let alert = wrapper.findComponent(WarningAlert);
        expect(alert.exists()).toBe(false);

        expect(wrapper.vm.$router[0].name).toBe("CloudProfile");
        expect(axios.post).toHaveBeenCalledTimes(3);
    });

    test('does not add invalid google credentials', async () => {
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

        let saveButton = google.find('[data-test-id="input-save"]');
        saveButton.trigger('click');
        await Vue.nextTick();
        expect(google.vm.newGoogle).toEqual(credential);
        await Vue.nextTick();

        let alert = wrapper.findComponent(WarningAlert);
        expect(alert.exists()).toBe(true);

        expect(wrapper.vm.$router[0]).toBe(undefined);
        expect(axios.post).toHaveBeenCalledTimes(2);
    });

    test('does not add google credentials without dlcmv2 images', async () => {
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

        let saveButton = google.find('[data-test-id="input-save"]');
        saveButton.trigger('click');
        await Vue.nextTick();
        expect(google.vm.newGoogle).toEqual(credential);
        await Vue.nextTick();

        let alert = wrapper.findComponent(WarningAlert);
        expect(alert.exists()).toBe(true);

        expect(wrapper.vm.$router[0]).toBe(undefined);
        expect(axios.post).toHaveBeenCalledTimes(2);
    });
 
    test('adds google credentials without capi images or external network', async () => {
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

        let saveButton = google.find('[data-test-id="input-save"]');
        saveButton.trigger('click');
        await Vue.nextTick();
        expect(google.vm.newGoogle).toEqual(credential);
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

        expect(google.vm.sharedCredentials).toBe(false);
        let input = google.find('[data-test-id="shared-credential"]');
        await input.setChecked();
        expect(google.vm.sharedCredentials).toBe(true);
        
        let saveButton = google.find('[data-test-id="input-save"]');
        saveButton.trigger('click');
        await Vue.nextTick();
        expect(google.vm.newGoogle).toEqual(credential);
        await Vue.nextTick();

        let alert = wrapper.findComponent(WarningAlert);
        expect(alert.exists()).toBe(false);

        expect(wrapper.vm.$router[0].name).toBe("CloudProfile");
        expect(axios.post).toHaveBeenCalledTimes(3);
        
        expect(axios.post).toHaveBeenLastCalledWith(
            "/server/createCloudCredentials", {
                "account_params": credential,
                "provider": "google",
                "sharedCredentials": true
            }, {});
    });
});