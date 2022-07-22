import { createTestingPinia } from "@pinia/testing";
import { config, mount } from "@vue/test-utils";
import { describe, test, expect, vi } from "vitest";
import en from "../../locales/en.json";
import Home from "../../src/views/Home.vue";

const testingPinia = createTestingPinia({ createSpy: vi.fn });
const translate = (msg: string): string => (en as Record<string, string>)[msg];
config.global.mocks = {
  $t: translate,
};

describe("<Home />", () => {
  test("it contains expected text", () => {
    const wrapper = mount(Home, {
      plugins: [testingPinia],
    });

    expect(wrapper.find("[data-test='home.message']").text()).to.equal(
      translate("home.message")
    );
  });
});
