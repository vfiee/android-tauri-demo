import { createPinia } from "pinia";
import { AppContext, createApp } from "vue";
import App from "./App.vue";

createApp(App).mount("#app");

function setup(app: AppContext["app"]) {
	app.use(createPinia()).mount("#app")
}

setup(createApp(App))