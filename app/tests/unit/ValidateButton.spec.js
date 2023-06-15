import {shallowMount} from "@vue/test-utils";
import ValidateButton from "@/components/platform/ValidateButton.vue";

describe("ValidateButton", () => {
  let wrapper;
  const account = {id: 1};
  const alerts = [{id: 1, show: false}];
  const validationStatus = false;
  const listOfAccountsInDeletion = [];
  const updateStatus = 0;

  beforeEach(() => {
    wrapper = shallowMount(ValidateButton, {
      propsData: {
        account,
        alerts,
        validationStatus,
        listOfAccountsInDeletion,
        updateStatus,
      },
    });
  });

  afterEach(() => {
    wrapper.destroy();
  });

  it("renders the component", () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("displays the check and question icons when validationStatus is false", () => {
    expect(wrapper.find(".fa-check-circle").exists()).toBe(true);
    expect(wrapper.find(".fa-question-circle").exists()).toBe(true);
  });

  it("displays the timed out message when validationStatus is \"timedOut\"", async () => {
    await wrapper.setProps({validationStatus: "timedOut"});
    expect(wrapper.find(".fa-clock").exists()).toBe(true);
    expect(wrapper.find(".ml-3").text()).toBe("Timed out");
  });

  it("displays the deleting message when account is in listOfAccountsInDeletion", async () => {
    await wrapper.setProps({listOfAccountsInDeletion: [1]});
    await wrapper.setProps({validationStatus: true});
    expect(wrapper.find(".text-danger").text()).toBe("Deleting...");
  });

  it("displays the success checkmark when validationStatus is true and alert show is false", async () => {
    await wrapper.setProps({validationStatus: true});
    expect(wrapper.find(".checkmark").exists()).toBe(true);
  });

  it("displays the failure icon when validationStatus is \"error\"", async () => {
    await wrapper.setProps({validationStatus: "error"});
    expect(wrapper.find(".load-failure").exists()).toBe(true);
  });

  it("displays the partial success icon when validationStatus is true and alert show is true", async () => {
    await wrapper.setProps({
      validationStatus: true,
      alerts: [{id: 1, show: true}],
    });
    expect(wrapper.find(".load-partial-success").exists()).toBe(true);
  });
});
