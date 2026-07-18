import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { E as useSiteContent, F as useUpsertSiteContent } from "./cms-CmbRBAo7.mjs";
import { _ as Save } from "../_libs/lucide-react.mjs";
import { a as Label, i as Input, l as Textarea, n as Card, o as PageHeader, s as PrimaryButton, u as triggerSave } from "./admin-shell-BJblCAon.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.site-content-UuP-m-Gl.js
var import_jsx_runtime = require_jsx_runtime();
function SiteContentAdmin() {
	const { data: site, isLoading } = useSiteContent();
	const upsert = useUpsertSiteContent();
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "text-center text-sm text-muted-foreground py-10",
		children: "در حال بارگذاری..."
	});
	const hero = {
		title: "",
		subtitle: "",
		badge: "",
		cta_text: "",
		...site?.hero
	};
	const contact = {
		address: "",
		phone: "",
		hours: "",
		...site?.contact
	};
	const social = {
		instagram: "",
		instagram_handle: "",
		...site?.social
	};
	function update(key, value) {
		triggerSave();
		upsert.mutate({
			key,
			value
		}, { onError: (e) => toast.error(e.message) });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "محتوای سایت",
			subtitle: "متن‌های ثابت صفحه اصلی، اطلاعات تماس و شبکه‌های اجتماعی"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "p-4 mb-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-sm font-bold mb-3",
				children: "بخش هیرو (Hero)"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "برچسب بالا" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: hero.badge,
						onChange: (e) => update("hero", {
							...hero,
							badge: e.target.value
						})
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "عنوان (هر خط در سطر جدید)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						rows: 3,
						value: hero.title,
						onChange: (e) => update("hero", {
							...hero,
							title: e.target.value
						})
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "زیرعنوان" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						rows: 3,
						value: hero.subtitle,
						onChange: (e) => update("hero", {
							...hero,
							subtitle: e.target.value
						})
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "متن دکمه" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: hero.cta_text,
						onChange: (e) => update("hero", {
							...hero,
							cta_text: e.target.value
						})
					})] })
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "p-4 mb-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-sm font-bold mb-3",
				children: "اطلاعات تماس"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid sm:grid-cols-2 gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "sm:col-span-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "آدرس" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							rows: 2,
							value: contact.address,
							onChange: (e) => update("contact", {
								...contact,
								address: e.target.value
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "تلفن" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						dir: "ltr",
						value: contact.phone,
						onChange: (e) => update("contact", {
							...contact,
							phone: e.target.value
						})
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "ساعات کاری" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: contact.hours,
						onChange: (e) => update("contact", {
							...contact,
							hours: e.target.value
						})
					})] })
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "p-4 mb-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-sm font-bold mb-3",
				children: "شبکه‌های اجتماعی"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid sm:grid-cols-2 gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "اینستاگرام (لینک)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					dir: "ltr",
					value: social.instagram,
					onChange: (e) => update("social", {
						...social,
						instagram: e.target.value
					}),
					placeholder: "https://instagram.com/..."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "آیدی اینستاگرام" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					dir: "ltr",
					value: social.instagram_handle,
					onChange: (e) => update("social", {
						...social,
						instagram_handle: e.target.value
					})
				})] })]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PrimaryButton, {
			onClick: () => toast.info("تغییرات با ویرایش هر فیلد خودکار ذخیره می‌شوند"),
			disabled: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "h-4 w-4" }), " ذخیره خودکار"]
		})
	] });
}
//#endregion
export { SiteContentAdmin as component };
