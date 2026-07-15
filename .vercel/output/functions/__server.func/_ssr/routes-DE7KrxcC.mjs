import { i as fetchThemeSettings, n as QK } from "./cms-TqyDBlHH.mjs";
import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DE7KrxcC.js
var $$splitComponentImporter = () => import("./routes-Bgz5ROZo.mjs");
var Route = createFileRoute("/")({
	loader: async ({ context: { queryClient } }) => {
		return { theme: await queryClient.ensureQueryData({
			queryKey: QK.theme,
			queryFn: fetchThemeSettings
		}) };
	},
	head: () => ({ meta: [{ title: "کافه خانه — شخصیت کافه‌ای‌ات رو کشف کن" }, {
		name: "description",
		content: "تجربه‌ای فراتر از قهوه. ۱۱ سوال کوتاه و یک نتیجه‌ی منحصربه‌فرد."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
