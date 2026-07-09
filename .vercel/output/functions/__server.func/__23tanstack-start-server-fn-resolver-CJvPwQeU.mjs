//#region node_modules/.nitro/vite/services/ssr/assets/__23tanstack-start-server-fn-resolver-CJvPwQeU.js
var manifest = { "3c04404e500b3a85ba69f18c01549465fe4f0d99be14c8842227de47d7eaeeef": {
	functionName: "recordPageView_createServerFn_handler",
	importer: () => import("./_ssr/cms.functions-z1XqTkiF.mjs")
} };
async function getServerFnById(id, access) {
	const serverFnInfo = manifest[id];
	if (!serverFnInfo) throw new Error("Server function info not found for " + id);
	const fnModule = serverFnInfo.module ?? await serverFnInfo.importer();
	if (!fnModule) throw new Error("Server function module not resolved for " + id);
	const action = fnModule[serverFnInfo.functionName];
	if (!action) throw new Error("Server function module export not resolved for serverFn ID: " + id);
	return action;
}
//#endregion
export { getServerFnById as t };
