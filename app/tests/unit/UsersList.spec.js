import {shallowMount, mount} from "@vue/test-utils";
import UsersList from "@/components/platform/UsersList.vue";
import Vue from "vue";
import axios from "axios";
import VueAxios from "vue-axios";
import BootstrapVue from "bootstrap-vue";

Vue.use(BootstrapVue);
Vue.use(VueAxios, axios);

describe("UsersList", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(UsersList, {
      propsData: {
        tenantID: "testTenantID",
        tenant: {
          name: "Test Tenant",
          description: "A test tenant",
        },
      },
      data() {
        return {
          computed_theme: "daiteap",
          get_axiosConfig: () => {
            return {};
          },
          computed_account_settings: {
            enable_kubernetes_capi: true,
          },
        };
      },
    });
  });

  it("renders the component", () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("displays a loading spinner when loading is true", async () => {
    wrapper.setData({loading: true});
    await wrapper.vm.$nextTick();
    expect(wrapper.find(".spinner-border").exists()).toBe(true);
  });

  it("displays a message when there are no users", async () => {
    wrapper.setData({loading: false, users: []});
    await wrapper.vm.$nextTick();
    expect(wrapper.find(".users-list-empty").text()).toBe(
      "No users currently.",
    );
  });

  it("displays the users list when there are users", async () => {
    const users = [
      {
        username: "john_doe",
        role: "admin",
        projects: ["project1", "project2"],
        phone: "555-555-5555",
      },
      {
        username: "jane_doe",
        role: "user",
        projects: ["project2", "project3"],
        phone: "555-555-5556",
      },
      {
        username: "bob_smith",
        role: "user",
        projects: ["project1"],
        phone: "555-555-5557",
      },
    ];

    wrapper = mount(UsersList, {
      propsData: {
        tenantID: "testTenantID",
        tenant: {
          name: "Test Tenant",
          description: "A test tenant",
        },
      },
      data() {
        return {
          computed_theme: "daiteap",
          get_axiosConfig: () => {
            return {};
          },
          computed_account_settings: {
            enable_kubernetes_capi: true,
          },
          loading: false,
          users: users,
        };
      },
    });

    await wrapper.vm.$nextTick();
    expect(wrapper.find(".users-list-table").exists()).toBe(true);
    expect(wrapper.findAll(".users-list-table-row")).toHaveLength(users.length);
  });
});
