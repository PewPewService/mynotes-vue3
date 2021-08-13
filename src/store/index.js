import { createStore } from "vuex";
import authModule, { moduleName as authModuleName } from "./modules/auth";
import notesModule, { moduleName as notesModuleName } from "./modules/notes";

export default createStore({
  modules: {
    [authModuleName]: authModule,
    [notesModuleName]: notesModule,
  },
});
