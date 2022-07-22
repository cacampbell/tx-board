import { Buffer } from "buffer";
import "@fontsource/nunito/latin-400.css";
import "@fontsource/nunito/latin-500.css";
import "@fontsource/nunito/latin-600.css";
import "@fontsource/nunito/latin-700.css";
import { createPinia } from "pinia";
import { createApp } from "vue";
import App from "./App.vue";
import setupI18n from "./i18n";
import "./index.css";
import setupRouter from "./router";

globalThis.Buffer = Buffer;

const app = createApp(App);
const router = setupRouter();
const store = createPinia();

app.use(store);
app.use(router);
app.use(setupI18n(router));

app.mount("#app");
