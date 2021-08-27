import { createStore } from "vuex";
import authModule, { moduleName as authModuleName } from "./modules/auth";
import notesModule, { moduleName as notesModuleName } from "./modules/notes";

const modules: Record<string, any> = {
  [authModuleName]: authModule,
  [notesModuleName]: notesModule,
};

export default createStore({
  modules: modules,
});
