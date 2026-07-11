import { t as getServerFnById } from "../__23tanstack-start-server-fn-resolver-MllkSnwY.mjs";
import { i as TSS_SERVER_FUNCTION, l as createServerFn } from "./esm-Dova13aH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cms.functions-DADAJU0E.js
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var recordPageView = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("3c04404e500b3a85ba69f18c01549465fe4f0d99be14c8842227de47d7eaeeef"));
//#endregion
export { recordPageView };
