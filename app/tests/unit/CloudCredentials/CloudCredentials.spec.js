import { mount } from '@vue/test-utils';
import Vue from 'vue';
import axios from "axios";
import VueAxios from "vue-axios";
import CloudProfile from '@/components/platform/CloudProfile.vue';
import CloudProfileTable from '@/components/platform/tables/CloudProfileTable.vue';
import RemoveAccountButton from '@/components/platform/RemoveAccountButton.vue';
import ValidateButton from '@/components/platform/ValidateButton.vue';
import { BootstrapVue } from 'bootstrap-vue';
import Notifications from 'vue-notification';

Vue.config.silent = true;
Vue.use(VueAxios, axios);
Vue.use(BootstrapVue);
Vue.use(Notifications);

describe('Cloud Credentials', () => {
	const mocked_get_response = {
		data: {
			credentials: [{
				id: 1,
				label: "openstack-1",
				provider: "openstack",
				type: "openstack",
				contact: "admin@mail.mail",
				valid: true,
				description: "desc",
				created_at: "2023-01-04T05:45:00.000000Z",
				has_associated_environments: false,
			},
			{
				id: 2,
				label: "openstack-1",
				provider: "openstack",
				type: "openstack",
				contact: "user@mail.mail",
				valid: false,
				description: "desc",
				created_at: "2023-02-04T05:45:00.000000Z",
				has_associated_environments: false,
			},
			{
				id: 3,
				label: "aws-1",
				provider: "aws",
				type: "aws",
				contact: "user@mail.mail",
				valid: true,
				description: "desc",
				created_at: "2023-03-04T05:45:00.000000Z",
				has_associated_environments: false,
			},
			{
				id: 4,
				label: "azure-1",
				provider: "azure",
				type: "azure",
				contact: "user@mail.mail",
				valid: true,
				description: "desc",
				created_at: "2023-04-04T05:45:00.000000Z",
				has_associated_environments: false,
			},
			{
				id: 5,
				label: "google-1",
				provider: "google",
				type: "google",
				contact: "user@mail.mail",
				valid: true,
				description: "desc",
				created_at: "2023-05-04T05:45:00.000000Z",
				has_associated_environments: false,
			},
			{
				id: 6,
				label: "onpremise-1",
				provider: "onpremise",
				type: "onpremise",
				contact: "user@mail.mail",
				valid: true,
				description: "desc",
				created_at: "2023-06-04T05:45:00.000000Z",
				has_associated_environments: false,
			},
			{
				id: 7,
				label: "iotarm-1",
				provider: "iotarm",
				type: "iotarm",
				contact: "user@mail.mail",
				valid: true,
				description: "desc",
				created_at: "2023-07-04T05:45:00.000000Z",
				has_associated_environments: false,
			},
			]
		},
	};

	let wrapper, table;
	beforeEach(async () => {
		wrapper = mount(CloudProfile, {
			data() {
				return {
					computed_theme: "daiteap",
					get_axiosConfig: () => { return {}; },
					computed_account_settings: {
						enable_kubernetes_capi: true,
					},
				};
			},
			mocks: {
				computed_userInfo: {
					id: 1,
					image: "",
					news_subscribbed: null,
					username: "testUser"
				},
				getCredentials: function () {
					return mocked_get_response.data.credentials;
				}
			},
		});

		await Vue.nextTick();
		table = wrapper.findComponent(CloudProfileTable);
	});

	test('gets cloud credentials on mount', async () => {
		expect(wrapper.vm.allAccounts).toEqual(mocked_get_response.data.credentials);
		expect(table.vm.allAccounts).toEqual(mocked_get_response.data.credentials);
	});

	test('displays credentials in table', () => {
		let options = {
			year: "numeric",
			month: "numeric",
			day: "numeric",
			hour: "numeric",
			minute: "numeric",
		};

		let cells = table.findAll('[data-test-id="table"]').at(0).findAll('td');
		let date = Date.parse(mocked_get_response.data.credentials[0].created_at.replace(" ", "T"));
		date = new Date(date).toLocaleString("en-US", options);
		expect(cells.at(0).text()).toEqual(mocked_get_response.data.credentials[0].label);
		expect(cells.at(1).text()).toEqual(mocked_get_response.data.credentials[0].description);
		expect(cells.at(2).find('img').exists()).toBe(true);
		expect(cells.at(4).text()).toEqual(date);
		expect(cells.at(5).text()).toEqual(mocked_get_response.data.credentials[0].contact);

		cells = table.findAll('[data-test-id="table"]').at(1).findAll('td');
		date = Date.parse(mocked_get_response.data.credentials[1].created_at.replace(" ", "T"));
		date = new Date(date).toLocaleString("en-US", options);
		expect(cells.at(0).text()).toEqual(mocked_get_response.data.credentials[1].label);
		expect(cells.at(1).text()).toEqual(mocked_get_response.data.credentials[1].description);
		expect(cells.at(2).find('img').exists()).toBe(true);
		expect(cells.at(4).text()).toEqual(date);
		expect(cells.at(5).text()).toEqual(mocked_get_response.data.credentials[1].contact);

		cells = table.findAll('[data-test-id="table"]').at(2).findAll('td');
		date = Date.parse(mocked_get_response.data.credentials[2].created_at.replace(" ", "T"));
		date = new Date(date).toLocaleString("en-US", options);
		expect(cells.at(0).text()).toEqual(mocked_get_response.data.credentials[2].label);
		expect(cells.at(1).text()).toEqual(mocked_get_response.data.credentials[2].description);
		expect(cells.at(2).find('img').exists()).toBe(true);
		expect(cells.at(4).text()).toEqual(date);
		expect(cells.at(5).text()).toEqual(mocked_get_response.data.credentials[2].contact);

		cells = table.findAll('[data-test-id="table"]').at(3).findAll('td');
		date = Date.parse(mocked_get_response.data.credentials[3].created_at.replace(" ", "T"));
		date = new Date(date).toLocaleString("en-US", options);
		expect(cells.at(0).text()).toEqual(mocked_get_response.data.credentials[3].label);
		expect(cells.at(1).text()).toEqual(mocked_get_response.data.credentials[3].description);
		expect(cells.at(2).find('img').exists()).toBe(true);
		expect(cells.at(4).text()).toEqual(date);
		expect(cells.at(5).text()).toEqual(mocked_get_response.data.credentials[3].contact);

		cells = table.findAll('[data-test-id="table"]').at(4).findAll('td');
		date = Date.parse(mocked_get_response.data.credentials[4].created_at.replace(" ", "T"));
		date = new Date(date).toLocaleString("en-US", options);
		expect(cells.at(0).text()).toEqual(mocked_get_response.data.credentials[4].label);
		expect(cells.at(1).text()).toEqual(mocked_get_response.data.credentials[4].description);
		expect(cells.at(2).find('img').exists()).toBe(true);
		expect(cells.at(4).text()).toEqual(date);
		expect(cells.at(5).text()).toEqual(mocked_get_response.data.credentials[4].contact);

		cells = table.findAll('[data-test-id="table"]').at(5).findAll('td');
		date = Date.parse(mocked_get_response.data.credentials[5].created_at.replace(" ", "T"));
		date = new Date(date).toLocaleString("en-US", options);
		expect(cells.at(0).text()).toEqual(mocked_get_response.data.credentials[5].label);
		expect(cells.at(1).text()).toEqual(mocked_get_response.data.credentials[5].description);
		expect(cells.at(2).find('img').exists()).toBe(true);
		expect(cells.at(4).text()).toEqual(date);
		expect(cells.at(5).text()).toEqual(mocked_get_response.data.credentials[5].contact);

		cells = table.findAll('[data-test-id="table"]').at(6).findAll('td');
		date = Date.parse(mocked_get_response.data.credentials[6].created_at.replace(" ", "T"));
		date = new Date(date).toLocaleString("en-US", options);
		expect(cells.at(0).text()).toEqual(mocked_get_response.data.credentials[6].label);
		expect(cells.at(1).text()).toEqual(mocked_get_response.data.credentials[6].description);
		expect(cells.at(2).find('img').exists()).toBe(true);
		expect(cells.at(4).text()).toEqual(date);
		expect(cells.at(5).text()).toEqual(mocked_get_response.data.credentials[6].contact);
	});

	test('removes credentials correctly', async () => {
		jest.spyOn(axios, 'post').mockResolvedValue();

		let deleteButton = table.findComponent(RemoveAccountButton).find('[data-test-id="remove-button"]');
		let popup = wrapper.find('#bv-modal-removeaccountwarning');
		let confirmDeleteButton = popup.find('[data-test-id="confirm-remove"]');

		expect(popup.isVisible()).toBe(false);
		deleteButton.trigger('click');
		await Vue.nextTick();
		expect(popup.isVisible()).toBe(true);

		expect(popup.find('[data-test-id="label-to-remove"]').text()).toBe("openstack-1");
		confirmDeleteButton.trigger('click');
		await Vue.nextTick();
		expect(popup.isVisible()).toBe(false);
	});

	test('status check passes if credentials are valid', async () => {
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
		jest.spyOn(axios, 'get').mockResolvedValue(mocked_post_response);

		let validateButton = table.find('[data-test-id="validate-button"]');
		let buttonComponent = table.findComponent(ValidateButton);
		let icon = buttonComponent.find('[data-test-id="status-icon"]');

		validateButton.trigger('click');
		await Vue.nextTick();
		expect(icon.attributes().class).toBe("circle-loader");
		await Vue.nextTick();
		await Vue.nextTick();
		await Vue.nextTick();
		expect(icon.attributes().class).toBe("circle-loader load-complete load-success");

		expect(buttonComponent.vm.validationStatus).toBe(true);
		let alert = buttonComponent.vm.alerts.find(alert => alert.label === buttonComponent.vm.account.label);
		expect(alert.show).toBe(false);
	});

	test('status check fails if credentials are not valid', async () => {
		const mocked_post_response = {
			data: {
				taskId: 0,
				status: "ok",
				error: true,
				errorMessage: "error"
			},
		};
		jest.spyOn(axios, 'post').mockResolvedValue(mocked_post_response);
		jest.spyOn(axios, 'get').mockResolvedValue(mocked_post_response);

		let validateButton = table.find('[data-test-id="validate-button"]');
		let buttonComponent = table.findComponent(ValidateButton);
		let icon = buttonComponent.find('[data-test-id="status-icon"]');

		validateButton.trigger('click');
		await Vue.nextTick();
		expect(icon.attributes().class).toBe("circle-loader");
		await Vue.nextTick();
		await Vue.nextTick();
		await Vue.nextTick();
		expect(icon.attributes().class).toBe("circle-loader load-complete load-failure");

		expect(buttonComponent.vm.validationStatus).toBe("error");
		let alert = buttonComponent.vm.alerts.find(alert => alert.label === buttonComponent.vm.account.label);
		expect(alert.show).toBe(true);
	});

	test('status check fails if capi images are false when capi is on', async () => {
		const mocked_post_response = {
			data: {
				taskId: 0,
				status: "ok",
				error: true,
				errorMessage: "",
				lcmStatuses: {
					"dlcmV2Images": true,
					"capiImages": false,
					"yaookCapiImages": true,
					"externalNetwork": true
				}
			},
		};
		jest.spyOn(axios, 'post').mockResolvedValue(mocked_post_response);

		let validateButton = table.find('[data-test-id="validate-button"]');
		let buttonComponent = table.findComponent(ValidateButton);
		let icon = buttonComponent.find('[data-test-id="status-icon"]');

		validateButton.trigger('click');
		await Vue.nextTick();
		expect(icon.attributes().class).toBe("circle-loader");
		await Vue.nextTick();
		await Vue.nextTick();
		await Vue.nextTick();
		expect(icon.attributes().class).toBe("circle-loader load-complete load-failure");

		expect(buttonComponent.vm.validationStatus).toBe("error");
		let alert = buttonComponent.vm.alerts.find(alert => alert.label === buttonComponent.vm.account.label);
		expect(alert.show).toBe(true);
	});

	test('status check passes if capi images are false when capi is off', async () => {
		wrapper = mount(CloudProfile, {
			data() {
				return {
					computed_theme: "daiteap",
					get_axiosConfig: () => { return {}; },
					computed_account_settings: {
						enable_kubernetes_capi: false,
					},
				};
			},
			mocks: {
				computed_userInfo: {
					id: 1,
					image: "",
					news_subscribbed: null,
					username: "testUser"
				},
				getCredentials: function () {
					return mocked_get_response.data.credentials;
				}
			},
		});

		await Vue.nextTick();
		table = wrapper.findComponent(CloudProfileTable);

		const mocked_post_response = {
			data: {
				taskId: 0,
				status: "ok",
				errorMessage: "",
				lcmStatuses: {
					"dlcmV2Images": true,
					"capiImages": false,
					"yaookCapiImages": true,
					"externalNetwork": true
				}
			},
		};
		jest.spyOn(axios, 'post').mockResolvedValue(mocked_post_response);
		jest.spyOn(axios, 'get').mockResolvedValue(mocked_post_response);

		let validateButton = table.find('[data-test-id="validate-button"]');
		let buttonComponent = table.findComponent(ValidateButton);
		let icon = buttonComponent.find('[data-test-id="status-icon"]');

		validateButton.trigger('click');
		await Vue.nextTick();
		expect(icon.attributes().class).toBe("circle-loader");
		await Vue.nextTick();
		await Vue.nextTick();
		await Vue.nextTick();
		expect(icon.attributes().class).toBe("circle-loader load-complete load-success");

		expect(buttonComponent.vm.validationStatus).toBe(true);
		let alert = buttonComponent.vm.alerts.find(alert => alert.label === buttonComponent.vm.account.label);
		expect(alert.show).toBe(false);
	});

	test('status check fails if dlcmv2 images are false', async () => {
		const mocked_post_response = {
			data: {
				taskId: 0,
				status: "ok",
				error: true,
				errorMessage: "",
				lcmStatuses: {
					"dlcmV2Images": false,
					"capiImages": true,
					"yaookCapiImages": true,
					"externalNetwork": true
				}
			},
		};
		jest.spyOn(axios, 'post').mockResolvedValue(mocked_post_response);
		jest.spyOn(axios, 'get').mockResolvedValue(mocked_post_response);

		let validateButton = table.find('[data-test-id="validate-button"]');
		let buttonComponent = table.findComponent(ValidateButton);
		let icon = buttonComponent.find('[data-test-id="status-icon"]');

		validateButton.trigger('click');
		await Vue.nextTick();
		expect(icon.attributes().class).toBe("circle-loader");
		await Vue.nextTick();
		await Vue.nextTick();
		await Vue.nextTick();
		expect(icon.attributes().class).toBe("circle-loader load-complete load-failure");

		expect(buttonComponent.vm.validationStatus).toBe("error");
		let alert = buttonComponent.vm.alerts.find(alert => alert.label === buttonComponent.vm.account.label);
		expect(alert.show).toBe(true);
	});

	test('status check fails if external network is false', async () => {
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
					"externalNetwork": false
				}
			},
		};
		jest.spyOn(axios, 'post').mockResolvedValue(mocked_post_response);
		jest.spyOn(axios, 'get').mockResolvedValue(mocked_post_response);

		let validateButton = table.find('[data-test-id="validate-button"]');
		let buttonComponent = table.findComponent(ValidateButton);
		let icon = buttonComponent.find('[data-test-id="status-icon"]');

		validateButton.trigger('click');
		await Vue.nextTick();
		expect(icon.attributes().class).toBe("circle-loader");
		await Vue.nextTick();
		await Vue.nextTick();
		await Vue.nextTick();
		expect(icon.attributes().class).toBe("circle-loader load-complete load-failure");

		expect(buttonComponent.vm.validationStatus).toBe("error");
		let alert = buttonComponent.vm.alerts.find(alert => alert.label === buttonComponent.vm.account.label);
		expect(alert.show).toBe(true);
	});
});