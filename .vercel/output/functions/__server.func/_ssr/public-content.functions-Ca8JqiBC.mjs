import { n as supabaseAdmin } from "./client.server-V7xMqmPH.mjs";
import { h as getLogger, r as WorkspaceRepository, s as resolveWorkspaceFromRequest } from "./resolver-DUogLIAX.mjs";
import { l as createServerFn } from "./esm-Dova13aH.mjs";
import { t as createServerRpc } from "./createServerRpc-WJgk8O8C.mjs";
import { t as getRequest } from "./request-response-BEPp1C2k.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/public-content.functions-Ca8JqiBC.js
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
var EMPTY = {
	workspaceId: null,
	domain: null,
	menu: [],
	gallery: [],
	events: [],
	testimonials: [],
	site: {},
	blocks: [],
	personalities: []
};
async function scoped(table, workspaceId) {
	const { data, error } = await supabaseAdmin.from(table).select("*").eq("workspace_id", workspaceId);
	if (error) {
		getLogger().error("public-content scoped read failed", {
			table,
			workspaceId,
			error
		});
		return [];
	}
	return data ?? [];
}
async function resolveWorkspaceId(request) {
	const url = new URL(request.url);
	const preview = url.searchParams.get("preview_domain");
	const hostParts = (request.headers.get("host") ?? url.host).split(".");
	const isSubdomain = hostParts.length > 2 && hostParts[0] !== "www";
	const subdomain = isSubdomain ? hostParts[0] : void 0;
	const { createSupabaseAdminProviders } = await import("./supabase-CPDyPLwR.mjs").then((n) => n.n).then((n) => n.n);
	const workspaceRepository = new WorkspaceRepository({
		...createSupabaseAdminProviders(),
		logger: getLogger()
	});
	const domain = preview ?? subdomain;
	const ctx = await resolveWorkspaceFromRequest({ workspaceRepository }, {
		domain,
		isSubdomain: !!preview ? false : isSubdomain
	});
	return {
		workspaceId: ctx.workspaceId ?? null,
		domain: ctx.entity?.metadata?.domain ?? domain ?? null
	};
}
async function readScoped(workspaceId) {
	const [menu, gallery, events, testimonials, siteRows, blocks, personalities] = await Promise.all([
		scoped("menu_items", workspaceId),
		scoped("gallery_images", workspaceId),
		scoped("events", workspaceId),
		scoped("testimonials", workspaceId),
		scoped("site_content", workspaceId),
		scoped("page_blocks", workspaceId),
		scoped("personality_profiles", workspaceId)
	]);
	const site = {};
	for (const row of siteRows) site[String(row.key)] = row.value ?? {};
	return {
		workspaceId,
		domain: null,
		menu,
		gallery,
		events,
		testimonials,
		site,
		blocks,
		personalities
	};
}
var getPublicWorkspaceContent_createServerFn_handler = createServerRpc({
	id: "5486816e1b6db74fbdabd16b5a0820fc856ef8a91d157189ba556188f073f8ab",
	name: "getPublicWorkspaceContent",
	filename: "src/lib/public-content.functions.ts"
}, (opts) => getPublicWorkspaceContent.__executeServer(opts));
var getPublicWorkspaceContent = createServerFn({ method: "POST" }).inputValidator((data) => data).handler(getPublicWorkspaceContent_createServerFn_handler, async ({ data }) => {
	let workspaceId = data.workspaceId ?? null;
	let domain = data.domain ?? null;
	if (!workspaceId) {
		const request = getRequest();
		if (request) {
			const resolved = await resolveWorkspaceId(request);
			workspaceId = resolved.workspaceId;
			domain = resolved.domain;
		}
	}
	if (!workspaceId) return {
		...EMPTY,
		domain
	};
	return {
		...await readScoped(workspaceId),
		domain
	};
});
//#endregion
export { getPublicWorkspaceContent_createServerFn_handler };
