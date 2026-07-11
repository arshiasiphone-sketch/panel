import { i as TSS_SERVER_FUNCTION, l as createServerFn } from "./esm-Dova13aH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cms.functions-DAkRQM5R.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var recordPageView_createServerFn_handler = createServerRpc({
	id: "3c04404e500b3a85ba69f18c01549465fe4f0d99be14c8842227de47d7eaeeef",
	name: "recordPageView",
	filename: "src/lib/cms.functions.ts"
}, (opts) => recordPageView.__executeServer(opts));
var recordPageView = createServerFn({ method: "POST" }).validator((data) => data).handler(recordPageView_createServerFn_handler, async ({ data }) => {
	const { createSupabaseAdminProviders } = await import("./supabase-B2jjn2gh.mjs").then((n) => n.n).then((n) => n.n);
	const { error } = await createSupabaseAdminProviders().database.from("page_views").insert({
		path: data.path ?? "/",
		referrer: data.referrer ?? null,
		user_agent: data.userAgent ?? null
	});
	if (error) throw error;
	return { ok: true };
});
//#endregion
export { recordPageView_createServerFn_handler };
