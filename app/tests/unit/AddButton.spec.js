import {shallowMount, config} from "@vue/test-utils";
import AddButton from "@/components/platform/AddButton.vue";

config.silent = true;

describe("AddButton.vue", () => {
  it("renders the correct text", () => {
    const text = "Add Project";
    const wrapper = shallowMount(AddButton, {
      propsData: {text},
    });
    expect(wrapper.text()).toMatch(text);
  });

  it("emits a click event when clicked", () => {
    const wrapper = shallowMount(AddButton);
    wrapper.find("img").trigger("click");
    expect(wrapper.emitted("onClickAddButton")).toBeTruthy();
  });

  it("calls hoverOn when mouseover", () => {
    const hoverOn = jest.spyOn(AddButton.methods, "hoverOn");
    const wrapper = shallowMount(AddButton);
    wrapper.find("img").trigger("mouseover");
    expect(hoverOn).toHaveBeenCalled();
  });

  it("calls hoverOut when mouseout", () => {
    const hoverOut = jest.spyOn(AddButton.methods, "hoverOut");
    const wrapper = shallowMount(AddButton);
    wrapper.find("img").trigger("mouseleave");
    expect(hoverOut).toHaveBeenCalled();
  });
});
