import {mount} from "@vue/test-utils";
import CloudProfileTable from "@/components/platform/tables/CloudProfileTable.vue";
import RemoveAccountButton from "@/components/platform/RemoveAccountButton.vue";
import SpecificUserInfo from "@/components/platform/popup_modals/SpecificUserInfo";
import Vue from "vue";
import moment from "moment";
import BootstrapVue from "bootstrap-vue";

Vue.use(BootstrapVue);
Vue.filter("formatDate", function(value) {
  if (value) {
    const date = moment(String(value)).format("DD MMM YYYY, HH:mm");
    if (date.startsWith("0")) {
      const newDate = date.substring(1);
      return newDate;
    }
    return date;
  }
});

describe("CloudProfileTable", () => {
  let wrapper;
  const allAccounts = [
    {
      id: 1,
      label: "Account 1",
      description: "Description 1",
      provider: "AWS",
      cloud_account_info: "Account info 1",
      created_at_pretty: "2022-01-01",
      contact: "user1@example.com",
      type: "ONPREM",
      statusOfValidation: "success",
    },
    {
      id: 2,
      label: "Account 2",
      description: "Description 2",
      provider: "GCP",
      cloud_account_info: "Account info 2",
      created_at_pretty: "2022-01-02",
      contact: "user2@example.com",
      type: "IOTARM",
      statusOfValidation: "loading",
    },
  ];
  const providers = [
    {
      name: "AWS",
      logo_small: "aws_logo_small.png",
    },
    {
      name: "GCP",
      logo_small: "googleCloud_logo_small.png",
    },
  ];
  const alerts = [];
  const listOfAccountsInDeletion = [];

  beforeEach(() => {
    wrapper = mount(CloudProfileTable, {
      propsData: {
        allAccounts,
        providers,
        alerts,
        listOfAccountsInDeletion,
      },
      mocks: {
        $bvModal: {
          show: jest.fn(),
        },
        $store: {
          dispatch: jest.fn(),
          state: {
            activeTenantId: 1,
          },
        },
        getSpecificUserInfo: jest.fn(() => Promise.resolve({})),
      },
    });
  });

  afterEach(() => {
    wrapper.destroy();
  });

  it("renders a table with the correct number of rows", () => {
    const rows = wrapper.findAll("tbody tr");
    expect(rows.length).toBe(allAccounts.length);
  });

  it("displays the correct account label in the first column", () => {
    const firstColumnCells = wrapper.findAll("tbody td:first-child");
    expect(firstColumnCells.at(0).text()).toBe(allAccounts[0].label);
    expect(firstColumnCells.at(1).text()).toBe(allAccounts[1].label);
  });

  it("displays the correct account description in the second column", () => {
    const secondColumnCells = wrapper.findAll(
      "[name=\"credentialsHidePriority2\"]",
    );
    expect(secondColumnCells.at(1).text()).toBe(allAccounts[0].description);
    expect(secondColumnCells.at(2).text()).toBe(allAccounts[1].description);
  });

  it("displays the correct account info in the fourth column", () => {
    const fourthColumnCells = wrapper.findAll(
      "[name=\"credentialsHidePriority4\"]",
    );
    expect(fourthColumnCells.at(1).text()).toBe(
      allAccounts[0].cloud_account_info,
    );
    expect(fourthColumnCells.at(2).text()).toBe(
      allAccounts[1].cloud_account_info,
    );
  });

  it("displays the correct contact in the sixth column", () => {
    const sixthColumnCells = wrapper.findAll(
      "[name=\"credentialsHidePriority1\"]",
    );
    expect(sixthColumnCells.at(1).text()).toBe(allAccounts[0].contact);
    expect(sixthColumnCells.at(2).text()).toBe(allAccounts[1].contact);
  });

  it("emits the 'openEditPopup' event when the edit icon is clicked", () => {
    const editIcon = wrapper.find(".editIcon");
    editIcon.trigger("click");
    expect(wrapper.emitted("openEditPopup")).toBeTruthy();
    expect(wrapper.emitted("openEditPopup")[0][0]).toBe(allAccounts[0]);
  });

  it("emits the 'removeAccount' event when the remove button is clicked", () => {
    const removeButton = wrapper.findComponent(RemoveAccountButton);
    removeButton.vm.$emit("removeAccount", allAccounts[1]);
    expect(wrapper.emitted("removeAccount")).toBeTruthy();
    expect(wrapper.emitted("removeAccount")[0][0]).toBe(allAccounts[1]);
  });

  it("displays the SpecificUserInfo component when the 'showUserDetails' method is called", async () => {
    await wrapper.vm.showUserDetails(allAccounts[0].contact);

    await wrapper.vm.$nextTick();

    expect(wrapper.vm.showSpecificUserInfo).toBe(true);
    expect(wrapper.findComponent(SpecificUserInfo).exists()).toBe(true);
    expect(wrapper.findComponent(SpecificUserInfo).props("username")).toBe(
      allAccounts[0].contact,
    );
  });

  it("hides the SpecificUserInfo component when the 'hideUserDetails' method is called", () => {
    wrapper.vm.showUserDetails(allAccounts[0].contact);
    wrapper.vm.hideUserDetails();
    expect(wrapper.findComponent(SpecificUserInfo).exists()).toBe(false);
  });
});
