import {mount, config} from "@vue/test-utils";
import WarningAlert from "@/components/platform/WarningAlert.vue";

config.silent = true;

describe("WarningAlert.vue", () => {
  let wrapper; let bAlert;
  const message = "Message";
  const colour = "info";

  beforeEach(() => {
    wrapper = mount(WarningAlert);
    bAlert = wrapper.find("b-alert");
  });

  test("renders props.msg when passed", async () => {
    await wrapper.setProps({msg: message});

    expect(wrapper.text()).toMatch(message);
  });

  test("sets props.color when passed", async () => {
    await wrapper.setProps({color: colour});

    expect(bAlert.attributes().variant).toMatch(colour);
  });

  test("sets props.dismissible when passed", async () => {
    await wrapper.setProps({closeOption: false});
    expect(bAlert.attributes().dismissible).toBe(undefined);

    await wrapper.setProps({closeOption: true});
    expect(bAlert.attributes().dismissible).toBe("true");

    await wrapper.setProps({closeOption: undefined});
    expect(bAlert.attributes().dismissible).toBe("true");
  });
});
