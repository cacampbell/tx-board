import { Selector } from "testcafe";

fixture`Visit Home`.page`http://localhost:4173/`;

test("Hello, World", async (t) => {
  const homeMessage = await Selector("[data-test='home.message']").textContent;
  await t
    .expect(homeMessage)
    .eql("Hello, World", "visiting / displays greeting message");
});
