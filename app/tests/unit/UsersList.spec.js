import {shallowMount} from "@vue/test-utils";
import UsersList from "@/components/platform/UsersList.vue";
import {
  BootstrapVueNext,
} from "bootstrap-vue-next";
import {nextTick} from "vue";
import {expect} from "@jest/globals";

describe("UsersList", () => {
  let wrapper;
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
          axios: {
            get: jest.fn(() =>
              Promise.resolve({
                data: {
                  name: "Test Tenant",
                  description: "A test tenant",
                },
              }),
            ),
          },
          getUsers: () => {
            return users;
          },
        };
      },
      global: {
        plugins: [
          BootstrapVueNext,
        ],
      },
    });
  });

  it("renders the component", () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("displays a loading spinner when loading is true", async () => {
    wrapper.setData({loading: true});
    await nextTick();
    expect(wrapper.find(".spinner-border").exists()).toBe(true);
  });

  it("displays a message when there are no users", async () => {
    wrapper.setData({loading: false, users: []});
    await nextTick();
    expect(wrapper.find(".users-list-empty").text()).toBe(
      "No users currently.",
    );
  });

  it("displays the users list when there are users", async () => {
    wrapper.setData({
      loading: false,
    });

    await nextTick();
    expect(wrapper.vm.users).toStrictEqual(users);
    expect(wrapper.find(".users-list-table").exists()).toBe(true);
  });
});
