import { mount } from '@vue/test-utils';
import Vue from 'vue';
import axios from "axios";
import VueAxios from "vue-axios";
import { BootstrapVue } from 'bootstrap-vue';
import Notifications from 'vue-notification';
import AddCloudCredentials from '@/components/platform/AddCloudCredentials.vue';
import AddAwsAccount from '@/components/platform/addProviderCredentials/AddAwsAccount.vue';
import WarningAlert from '@/components/platform/WarningAlert.vue';

Vue.config.silent = true;
Vue.use(VueAxios, axios);
Vue.use(BootstrapVue);
Vue.use(Notifications);

describe('Add Cloud Credentials - Amazon', () => {
	const mocked_get_response = {
		data: {
			credentials: [{
				id: 1,
				label: "aws-1",
				provider: "aws",
				type: "aws",
				contact: "admin@mail.mail",
				valid: true,
				description: "desc",
				created_at: "4/1/2022",
				has_associated_environments: false,
			},]
		},
	};

	let credential = {
		label: "aws-0",
		description: "desc",
		aws_access_key_id: "01234567892020202020",
		aws_secret_access_key: "0123456789202020202040404040404040404040",
	};

	let wrapper, amazon;
	beforeEach(async () => {
		wrapper = mount(AddCloudCredentials, {
			data() {
				return {
					computed_theme: "daiteap",
					get_axiosConfig: () => { return {}; },
					selectedProvider: " ",
					computed_account_settings: {
						enable_kubernetes_capi: true,
					},
				};
			},
			mocks: {
				getCredentials: function () {
					return mocked_get_response.data.credentials;
				},
				$router: [],
			},
		});

		wrapper.setData({ selectedProvider: "aws" });
		await Vue.nextTick();
		amazon = wrapper.findComponent(AddAwsAccount);
		amazon.setData({ get_axiosConfig: () => { return {}; } });

		// Add Credential
		let input = amazon.find('[data-test-id="input-label"]');
		await input.setValue(credential.label);

		input = amazon.find('[data-test-id="input-description"]');
		await input.setValue(credential.description);

		input = amazon.find('[data-test-id="input-id"]');
		await input.setValue(credential.aws_access_key_id);

		input = amazon.find('[data-test-id="input-secret"]');
		await input.setValue(credential.aws_secret_access_key);
	});

	afterEach(async () => {
		jest.clearAllMocks();
	});

	jest.spyOn(document, 'getElementById')
		.mockImplementation((id) => {
			switch (id) {
				case 'awsLabel':
					return { value: credential.label };
				case 'awsdescription':
					return { value: credential.description };
				case 'awsAccessKey':
					return { value: credential.aws_access_key_id };
				case 'secretAccessKey':
					return { value: credential.aws_secret_access_key };
				default:
					return;
			}
		});

	test('checks if label is taken', async () => {
		let input = amazon.find('[data-test-id="input-label"]');
		let saveButton = amazon.find('[data-test-id="input-save"]');

		await input.setValue('aws-1');
		expect(saveButton.classes().includes("deactivated")).toBe(true);

		await input.setValue('aws-2');
		expect(saveButton.classes().includes("deactivated")).toBe(false);
	});

	test('adds valid aws credentials', async () => {
		const mocked_post_response = {
			data: {
				taskId: 0,
				status: "ok",
				errorMessage: "",
				lcmStatuses: {
					"dlcmV2Images": true,
					"capiImages": true,
					"yaookCapiImages": true,
					"externalNetwork": true
				}
			},
		};
		jest.spyOn(axios, 'post').mockResolvedValue(mocked_post_response);
		jest.spyOn(axios, 'get').mockResolvedValue(mocked_post_response);

		let saveButton = amazon.find('[data-test-id="input-save"]');
		saveButton.trigger('click');
		await Vue.nextTick();
		expect(amazon.vm.newAws).toEqual(credential);
		await Vue.nextTick();

		let alert = wrapper.findComponent(WarningAlert);
		expect(alert.exists()).toBe(false);

		expect(wrapper.vm.$router[0].name).toBe("CloudProfile");
		expect(axios.post).toHaveBeenCalledTimes(2);
		expect(axios.get).toHaveBeenCalledTimes(1);
	});

	test('does not add invalid aws credentials', async () => {
		const mocked_post_response = {
			data: {
				taskId: 0,
				status: "ok",
				error: true,
				errorMessage: "",
				lcmStatuses: {
					"dlcmV2Images": true,
					"capiImages": true,
					"yaookCapiImages": true,
					"externalNetwork": true
				}
			},
		};
		jest.spyOn(axios, 'post').mockResolvedValue(mocked_post_response);
		jest.spyOn(axios, 'get').mockResolvedValue(mocked_post_response);

		let saveButton = amazon.find('[data-test-id="input-save"]');
		saveButton.trigger('click');
		await Vue.nextTick();
		expect(amazon.vm.newAws).toEqual(credential);
		await Vue.nextTick();

		let alert = wrapper.findComponent(WarningAlert);
		expect(alert.exists()).toBe(true);

		expect(wrapper.vm.$router[0]).toBe(undefined);
		expect(axios.post).toHaveBeenCalledTimes(1);
		expect(axios.get).toHaveBeenCalledTimes(1);
	});

	test('adds aws credentials without capi images or external network', async () => {
		const mocked_post_response = {
			data: {
				taskId: 0,
				status: "ok",
				error: false,
				errorMessage: "",
				lcmStatuses: {
					"dlcmV2Images": true,
					"capiImages": false,
					"yaookCapiImages": true,
					"externalNetwork": false
				}
			},
		};
		jest.spyOn(axios, 'post').mockResolvedValue(mocked_post_response);
		jest.spyOn(axios, 'get').mockResolvedValue(mocked_post_response);

		let saveButton = amazon.find('[data-test-id="input-save"]');
		saveButton.trigger('click');
		await Vue.nextTick();
		expect(amazon.vm.newAws).toEqual(credential);
		await Vue.nextTick();

		let alert = wrapper.findComponent(WarningAlert);
		expect(alert.exists()).toBe(false);

		expect(wrapper.vm.$router[0].name).toBe("CloudProfile");
		expect(axios.post).toHaveBeenCalledTimes(2);
		expect(axios.get).toHaveBeenCalledTimes(1);
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
		jest.spyOn(axios, 'get').mockResolvedValue(mocked_post_response);

		expect(amazon.vm.sharedCredentials).toBe(false);
		let input = amazon.find('[data-test-id="shared-credential"]');
		input.trigger('click');
		await Vue.nextTick();
		expect(amazon.vm.sharedCredentials).toBe(true);

		let saveButton = amazon.find('[data-test-id="input-save"]');
		saveButton.trigger('click');
		await Vue.nextTick();
		expect(amazon.vm.newAws).toEqual(credential);
		await Vue.nextTick();

		let alert = wrapper.findComponent(WarningAlert);
		expect(alert.exists()).toBe(false);

		expect(wrapper.vm.$router[0].name).toBe("CloudProfile");
		expect(axios.post).toHaveBeenCalledTimes(2);
		expect(axios.get).toHaveBeenCalledTimes(1);

		expect(axios.post).toHaveBeenLastCalledWith(
			"/server/tenants/undefined/cloud-credentials", {
			"account_params": credential,
			"provider": "aws",
			"sharedCredentials": true
		}, {});
	});
});