import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as fetchThemeSettings, r as QK } from "./cms-BzqQuhMP.mjs";
import { i as TSS_SERVER_FUNCTION, l as createServerFn } from "./esm-Dova13aH.mjs";
import { t as getServerFnById } from "../__23tanstack-start-server-fn-resolver-Cu1LlpqG.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/createSsrRpc-CqeLHMhV.js
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
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/routes-96SvZFwr.js
/**
* NAMA Platform — Public tenant content via SSR (service_role).
*
* The public landing page renders tenant data. To enable DB-enforced read
* isolation (revoking anon SELECT later), public reads must NOT go through the
* anon publishable client. This server function resolves the workspace from the
* request and reads its scoped rows using the service_role key (bypasses RLS),
* returning a single bundled object the landing page hydrates from the loader.
*
* Only the public landing page uses this. The admin panel keeps its own hooks.
*/
var getPublicWorkspaceContent = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(createSsrRpc("5486816e1b6db74fbdabd16b5a0820fc856ef8a91d157189ba556188f073f8ab"));
var $$splitComponentImporter = () => import("./routes-VG4j_Qmo.mjs");
var Route = createFileRoute("/")({
	loader: async ({ context: { queryClient } }) => {
		return {
			theme: await queryClient.ensureQueryData({
				queryKey: QK.theme,
				queryFn: fetchThemeSettings
			}),
			content: await getPublicWorkspaceContent({ data: {
				workspaceId: void 0,
				domain: void 0
			} })
		};
	},
	head: () => ({ meta: [{ title: "کافه خانه — شخصیت کافه‌ای‌ات رو کشف کن" }, {
		name: "description",
		content: "تجربه‌ای فراتر از قهوه. ۱۱ سوال کوتاه و یک نتیجه‌ی منحصربه‌فرد."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
