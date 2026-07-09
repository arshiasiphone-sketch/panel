import { L as useUpsertSiteContent, O as useSiteContent } from "./cms-kjwVWmsc.mjs";
import { _ as Save } from "../_libs/lucide-react.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { a as Label, i as Input, l as Textarea, n as Card, o as PageHeader, s as PrimaryButton, u as triggerSave } from "./admin-shell-DVodOT7B.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.site-content-BtIhL97x.js
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "C:/Users/Admin/Desktop/final/myproject/src/routes/admin.site-content.tsx?tsr-split=component";
function SiteContentAdmin() {
	const { data: site, isLoading } = useSiteContent();
	const upsert = useUpsertSiteContent();
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "text-center text-sm text-muted-foreground py-10",
		children: "در حال بارگذاری..."
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 27,
		columnNumber: 25
	}, this);
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
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PageHeader, {
			title: "محتوای سایت",
			subtitle: "متن‌های ثابت صفحه اصلی، اطلاعات تماس و شبکه‌های اجتماعی"
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 56,
			columnNumber: 7
		}, this),
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
			className: "p-4 mb-3",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
				className: "text-sm font-bold mb-3",
				children: "بخش هیرو (Hero)"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 59,
				columnNumber: 9
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "grid gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, { children: "برچسب بالا" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 62,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
						value: hero.badge,
						onChange: (e) => update("hero", {
							...hero,
							badge: e.target.value
						})
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 63,
						columnNumber: 13
					}, this)] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 61,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, { children: "عنوان (هر خط در سطر جدید)" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 69,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Textarea, {
						rows: 3,
						value: hero.title,
						onChange: (e) => update("hero", {
							...hero,
							title: e.target.value
						})
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 70,
						columnNumber: 13
					}, this)] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 68,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, { children: "زیرعنوان" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 76,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Textarea, {
						rows: 3,
						value: hero.subtitle,
						onChange: (e) => update("hero", {
							...hero,
							subtitle: e.target.value
						})
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 77,
						columnNumber: 13
					}, this)] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 75,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, { children: "متن دکمه" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 83,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
						value: hero.cta_text,
						onChange: (e) => update("hero", {
							...hero,
							cta_text: e.target.value
						})
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 84,
						columnNumber: 13
					}, this)] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 82,
						columnNumber: 11
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 60,
				columnNumber: 9
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 58,
			columnNumber: 7
		}, this),
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
			className: "p-4 mb-3",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
				className: "text-sm font-bold mb-3",
				children: "اطلاعات تماس"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 93,
				columnNumber: 9
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "grid sm:grid-cols-2 gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "sm:col-span-2",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, { children: "آدرس" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 96,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Textarea, {
							rows: 2,
							value: contact.address,
							onChange: (e) => update("contact", {
								...contact,
								address: e.target.value
							})
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 97,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 95,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, { children: "تلفن" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 103,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
						dir: "ltr",
						value: contact.phone,
						onChange: (e) => update("contact", {
							...contact,
							phone: e.target.value
						})
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 104,
						columnNumber: 13
					}, this)] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 102,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, { children: "ساعات کاری" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 110,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
						value: contact.hours,
						onChange: (e) => update("contact", {
							...contact,
							hours: e.target.value
						})
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 111,
						columnNumber: 13
					}, this)] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 109,
						columnNumber: 11
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 94,
				columnNumber: 9
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 92,
			columnNumber: 7
		}, this),
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
			className: "p-4 mb-3",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
				className: "text-sm font-bold mb-3",
				children: "شبکه‌های اجتماعی"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 120,
				columnNumber: 9
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "grid sm:grid-cols-2 gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, { children: "اینستاگرام (لینک)" }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 123,
					columnNumber: 13
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
					dir: "ltr",
					value: social.instagram,
					onChange: (e) => update("social", {
						...social,
						instagram: e.target.value
					}),
					placeholder: "https://instagram.com/..."
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 124,
					columnNumber: 13
				}, this)] }, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 122,
					columnNumber: 11
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, { children: "آیدی اینستاگرام" }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 130,
					columnNumber: 13
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
					dir: "ltr",
					value: social.instagram_handle,
					onChange: (e) => update("social", {
						...social,
						instagram_handle: e.target.value
					})
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 131,
					columnNumber: 13
				}, this)] }, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 129,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 121,
				columnNumber: 9
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 119,
			columnNumber: 7
		}, this),
		/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PrimaryButton, {
			onClick: () => toast.info("تغییرات با ویرایش هر فیلد خودکار ذخیره می‌شوند"),
			disabled: true,
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Save, { className: "h-4 w-4" }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 140,
				columnNumber: 9
			}, this), " ذخیره خودکار"]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 139,
			columnNumber: 7
		}, this)
	] }, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 55,
		columnNumber: 10
	}, this);
}
//#endregion
export { SiteContentAdmin as component };
