import { A as Instagram, O as Link, P as Globe, c as Twitter, h as Send, t as Youtube, w as MessageCircle, x as Music } from "../_libs/lucide-react.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/blocks-QGV7I2Iw.js
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "C:/Users/Admin/Desktop/final/myproject/src/components/admin/blocks.tsx";
function getBlockDef(type) {
	const normalized = normalizeBlockType(type);
	return BLOCK_DEFS.find((b) => b.type === normalized) ?? BLOCK_DEFS.find((b) => b.type === type) ?? BLOCK_DEFS[0];
}
/** Maps legacy/alternate block type names to canonical BlockType values. */
function normalizeBlockType(type) {
	return {
		"personality-cards": "personality_types",
		"custom-text": "rich_text",
		events: "events_preview",
		testimonials: "testimonials_section"
	}[type] ?? type;
}
function defaultBlockData(type) {
	switch (normalizeBlockType(type)) {
		case "header": return {
			title: "عنوان جدید",
			subtitle: ""
		};
		case "paragraph": return { text: "متن خود را اینجا بنویسید..." };
		case "button": return {
			label: "کلیک کنید",
			url: "https://",
			style: "primary"
		};
		case "image": return {
			url: "",
			caption: ""
		};
		case "video": return {
			url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
			title: ""
		};
		case "gallery": return { images: [] };
		case "menu": return {
			title: "منوی ما",
			items: [{
				name: "اسپرسو",
				price: "۸۵٬۰۰۰"
			}]
		};
		case "instagram": return { handle: "@cafekhane" };
		case "booking": return {
			title: "رزرو میز",
			ctaLabel: "رزرو کنید"
		};
		case "contact": return {
			phone: "",
			email: "",
			whatsapp: ""
		};
		case "faq": return { items: [{
			q: "ساعات کاری؟",
			a: "۱۰ صبح تا ۱۲ شب"
		}] };
		case "map": return {
			lat: 35.7,
			lng: 51.4,
			label: "کافه خانه"
		};
		case "divider": return { style: "line" };
		case "quote": return {
			text: "بهترین کافه شهر",
			author: "مهمان"
		};
		case "test": return {
			title: "تست شخصیت کافی",
			ctaLabel: "شروع تست"
		};
		case "event": return {
			title: "رویداد",
			date: "",
			description: ""
		};
		case "countdown": return {
			title: "شمارش معکوس",
			target: new Date(Date.now() + 7 * 864e5).toISOString()
		};
		case "social": return { links: [{
			platform: "instagram",
			url: ""
		}] };
		case "file": return {
			label: "دانلود فایل",
			url: "",
			size: ""
		};
		case "music": return {
			provider: "spotify",
			url: ""
		};
		case "hero": return {
			badge: "کافه خانه",
			title: "عنوان قهرمان\nخط دوم",
			subtitle: "زیرعنوان توضیحی",
			cta_text: "شروع تست",
			cta_url: "/test/info",
			note: ""
		};
		case "personality_types": return {
			kicker: "تیپ‌ها",
			title: "چهار شخصیت کافه‌ای",
			subtitle: "",
			items: [
				{
					label: "آرام",
					tagline: "گوشه‌نشین",
					color: "#d4af37"
				},
				{
					label: "اجتماعی",
					tagline: "پر انرژی",
					color: "#9f1239"
				},
				{
					label: "خلاق",
					tagline: "ذهن باز",
					color: "#be123c"
				},
				{
					label: "متفکر",
					tagline: "عمیق",
					color: "#c9b89e"
				}
			]
		};
		case "how_it_works": return {
			kicker: "چطور کار می‌کنه",
			title: "سه قدم ساده تا نتیجه"
		};
		case "menu_highlights": return {
			kicker: "منوی ما",
			title: "یه نگاه به منو",
			subtitle: "",
			count: 4,
			show_prices: true
		};
		case "parallax_gallery": return {
			kicker: "گالری",
			title: "لحظه‌های کافه خانه",
			subtitle: ""
		};
		case "gallery_preview": return {
			kicker: "گالری",
			title: "فضای کافه خانه",
			subtitle: "",
			count: 6,
			columns: 6
		};
		case "events_preview": return {
			kicker: "رویدادها",
			title: "برنامه‌های ویژه",
			subtitle: "",
			count: 2
		};
		case "testimonials_section": return {
			kicker: "تجربه‌ی دیگران",
			title: "چی می‌گن درباره‌اش"
		};
		case "location": return {
			kicker: "بیا پیش ما",
			title: "کافه خانه منتظرته",
			address: "",
			phone: "",
			hours: "",
			instagram: ""
		};
		case "stats": return { items: [
			{
				value: "۱۱",
				label: "سوال هوشمند"
			},
			{
				value: "۴",
				label: "تیپ شخصیتی"
			},
			{
				value: "۳",
				label: "دقیقه زمان"
			}
		] };
		case "rich_text": return {
			title: "",
			text: "متن خود را اینجا بنویسید..."
		};
		case "custom_html": return { html: "<p>HTML سفارشی</p>" };
		case "spacer": return { height: 60 };
		default: return {};
	}
}
var BLOCK_DEFS = [
	{
		type: "header",
		label: "عنوان",
		icon: "M6 4v16M18 4v16M6 12h12",
		group: "متن"
	},
	{
		type: "paragraph",
		label: "پاراگراف",
		icon: "M4 6h16M4 12h16M4 18h10",
		group: "متن"
	},
	{
		type: "quote",
		label: "نقل قول",
		icon: "M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z",
		group: "متن"
	},
	{
		type: "divider",
		label: "جداکننده",
		icon: "M3 12h18",
		group: "متن"
	},
	{
		type: "button",
		label: "دکمه",
		icon: "M4 7h16v10H4z",
		group: "تعامل"
	},
	{
		type: "image",
		label: "تصویر",
		icon: "M3 5h18v14H3z|M8 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4z|M21 15l-5-5L5 21",
		group: "رسانه"
	},
	{
		type: "gallery",
		label: "گالری",
		icon: "M4 4h7v7H4z|M13 4h7v7h-7z|M4 13h7v7H4z|M13 13h7v7h-7z",
		group: "رسانه"
	},
	{
		type: "video",
		label: "ویدیو",
		icon: "M23 7l-7 5 7 5V7z|M1 5h15v14H1z",
		group: "رسانه"
	},
	{
		type: "music",
		label: "موزیک",
		icon: "M9 18V5l12-2v13|M6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6z|M18 19a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
		group: "رسانه"
	},
	{
		type: "menu",
		label: "منو",
		icon: "M3 3h18v18H3z|M3 9h18|M9 21V9",
		group: "اطلاعات"
	},
	{
		type: "contact",
		label: "تماس",
		icon: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.7 2.81",
		group: "اطلاعات"
	},
	{
		type: "faq",
		label: "سوالات متداول",
		icon: "M9 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3|M12 17h.01",
		group: "اطلاعات"
	},
	{
		type: "map",
		label: "نقشه",
		icon: "M1 6v16l7-3 8 3 7-3V3l-7 3-8-3-7 3z",
		group: "اطلاعات"
	},
	{
		type: "instagram",
		label: "اینستاگرام",
		icon: "M17 2H7a5 5 0 0 0-5 5v10a5 5 0 0 0 5 5h10a5 5 0 0 0 5-5V7a5 5 0 0 0-5-5z|M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z",
		group: "تعامل"
	},
	{
		type: "social",
		label: "شبکه‌های اجتماعی",
		icon: "M18 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6z|M6 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z|M18 22a3 3 0 1 0 0-6 3 3 0 0 0 0 6z|M8.59 13.51l6.83 3.98|M15.41 6.51l-6.82 3.98",
		group: "تعامل"
	},
	{
		type: "booking",
		label: "رزرو",
		icon: "M8 2v4M16 2v4M3 10h18",
		group: "تعامل"
	},
	{
		type: "test",
		label: "تست شخصیت",
		icon: "M9 11l3 3L22 4|M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11",
		group: "تعامل"
	},
	{
		type: "event",
		label: "رویداد",
		icon: "M8 2v4M16 2v4M3 10h18|M21 6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2z",
		group: "پیشرفته"
	},
	{
		type: "countdown",
		label: "شمارش معکوس",
		icon: "M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20z|M12 6v6l4 2",
		group: "پیشرفته"
	},
	{
		type: "file",
		label: "فایل دانلودی",
		icon: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4|M7 10l5 5 5-5|M12 15V3",
		group: "پیشرفته"
	},
	{
		type: "hero",
		label: "قهرمان",
		icon: "M12 2l3 7h7l-6 4 2 7-6-4-6 4 2-7-6-4h7z",
		group: "صفحه"
	},
	{
		type: "personality_types",
		label: "تیپ‌های شخصیتی",
		icon: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2|M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
		group: "صفحه"
	},
	{
		type: "how_it_works",
		label: "چطور کار می‌کنه",
		icon: "M9 11l3 3L22 4|M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11",
		group: "صفحه"
	},
	{
		type: "menu_highlights",
		label: "منتخب منو",
		icon: "M3 3h18v18H3z|M3 9h18|M9 21V9",
		group: "صفحه"
	},
	{
		type: "parallax_gallery",
		label: "گالری پارالاکس",
		icon: "M4 4h16v16H4z|M4 14l4-4 4 4 8-8",
		group: "صفحه"
	},
	{
		type: "gallery_preview",
		label: "پیش‌نمایش گالری",
		icon: "M4 4h7v7H4z|M13 4h7v7h-7z|M4 13h7v7H4z|M13 13h7v7h-7z",
		group: "صفحه"
	},
	{
		type: "events_preview",
		label: "رویدادهای ویژه",
		icon: "M8 2v4M16 2v4M3 10h18|M21 6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2z",
		group: "صفحه"
	},
	{
		type: "testimonials_section",
		label: "نظرات کاربران",
		icon: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
		group: "صفحه"
	},
	{
		type: "location",
		label: "موقعیت/تماس",
		icon: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z|M12 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
		group: "صفحه"
	},
	{
		type: "stats",
		label: "آمار",
		icon: "M12 20V10|M18 20V4|M6 20v-4",
		group: "صفحه"
	},
	{
		type: "rich_text",
		label: "متن غنی",
		icon: "M4 6h16M4 12h16M4 18h10",
		group: "صفحه"
	},
	{
		type: "custom_html",
		label: "HTML سفارشی",
		icon: "M16 18l6-6-6-6|M8 6l-6 6 6 6",
		group: "صفحه"
	},
	{
		type: "spacer",
		label: "فاصله",
		icon: "M3 6h18|M3 18h18",
		group: "صفحه"
	}
];
function BlockIcon({ d, size = 16 }) {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", {
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "1.8",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		children: d.split("|").map((p, i) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { d: p }, i, false, {
			fileName: _jsxFileName,
			lineNumber: 347,
			columnNumber: 9
		}, this))
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 336,
		columnNumber: 5
	}, this);
}
function fieldClass() {
	return "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground/30 focus:ring-2 focus:ring-foreground/5 transition";
}
function labelClass() {
	return "text-xs font-medium text-muted-foreground mb-1.5 block";
}
function TextInput({ label, value, onChange, placeholder, dir }) {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
		className: labelClass(),
		children: label
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 377,
		columnNumber: 7
	}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
		dir,
		value,
		placeholder,
		onChange: (e) => onChange(e.target.value),
		className: fieldClass()
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 378,
		columnNumber: 7
	}, this)] }, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 376,
		columnNumber: 5
	}, this);
}
function TextArea({ label, value, onChange, rows = 3 }) {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
		className: labelClass(),
		children: label
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 401,
		columnNumber: 7
	}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("textarea", {
		rows,
		value,
		onChange: (e) => onChange(e.target.value),
		className: fieldClass()
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 402,
		columnNumber: 7
	}, this)] }, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 400,
		columnNumber: 5
	}, this);
}
function BlockEditor({ block, onUpdate }) {
	const update = onUpdate;
	const d = block.data;
	switch (normalizeBlockType(block.type)) {
		case "header": return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "grid gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TextInput, {
				label: "عنوان",
				value: d.title ?? "",
				onChange: (v) => update({ title: v })
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 425,
				columnNumber: 11
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TextInput, {
				label: "زیرعنوان",
				value: d.subtitle ?? "",
				onChange: (v) => update({ subtitle: v })
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 426,
				columnNumber: 11
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 424,
			columnNumber: 9
		}, this);
		case "paragraph": return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TextArea, {
			label: "متن",
			value: d.text ?? "",
			onChange: (v) => update({ text: v })
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 434,
			columnNumber: 14
		}, this);
		case "quote": return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "grid gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TextArea, {
				label: "متن نقل قول",
				value: d.text ?? "",
				onChange: (v) => update({ text: v })
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 438,
				columnNumber: 11
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TextInput, {
				label: "نویسنده",
				value: d.author ?? "",
				onChange: (v) => update({ author: v })
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 443,
				columnNumber: 11
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 437,
			columnNumber: 9
		}, this);
		case "divider": return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
			className: labelClass(),
			children: "سبک"
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 453,
			columnNumber: 11
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("select", {
			value: d.style,
			onChange: (e) => update({ style: e.target.value }),
			className: fieldClass(),
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
					value: "line",
					children: "خط"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 459,
					columnNumber: 13
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
					value: "dots",
					children: "نقطه‌چین"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 460,
					columnNumber: 13
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
					value: "space",
					children: "فضای خالی"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 461,
					columnNumber: 13
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 454,
			columnNumber: 11
		}, this)] }, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 452,
			columnNumber: 9
		}, this);
		case "button": return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "grid gap-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TextInput, {
					label: "عنوان دکمه",
					value: d.label ?? "",
					onChange: (v) => update({ label: v })
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 468,
					columnNumber: 11
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TextInput, {
					label: "آدرس",
					value: d.url ?? "",
					onChange: (v) => update({ url: v }),
					dir: "ltr"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 473,
					columnNumber: 11
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
					className: labelClass(),
					children: "سبک"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 480,
					columnNumber: 13
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("select", {
					value: d.style,
					onChange: (e) => update({ style: e.target.value }),
					className: fieldClass(),
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
							value: "primary",
							children: "اصلی"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 486,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
							value: "secondary",
							children: "ثانویه"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 487,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
							value: "outline",
							children: "خطی"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 488,
							columnNumber: 15
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 481,
					columnNumber: 13
				}, this)] }, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 479,
					columnNumber: 11
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 467,
			columnNumber: 9
		}, this);
		case "image": return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "grid gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TextInput, {
				label: "آدرس تصویر",
				value: d.url ?? "",
				onChange: (v) => update({ url: v }),
				dir: "ltr",
				placeholder: "https://..."
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 496,
				columnNumber: 11
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TextInput, {
				label: "کپشن",
				value: d.caption ?? "",
				onChange: (v) => update({ caption: v })
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 503,
				columnNumber: 11
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 495,
			columnNumber: 9
		}, this);
		case "video": return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "grid gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TextInput, {
				label: "آدرس Embed",
				value: d.url ?? "",
				onChange: (v) => update({ url: v }),
				dir: "ltr"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 513,
				columnNumber: 11
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TextInput, {
				label: "عنوان",
				value: d.title ?? "",
				onChange: (v) => update({ title: v })
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 519,
				columnNumber: 11
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 512,
			columnNumber: 9
		}, this);
		case "music": return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "grid gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
				className: labelClass(),
				children: "سرویس"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 526,
				columnNumber: 13
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("select", {
				value: d.provider,
				onChange: (e) => update({ provider: e.target.value }),
				className: fieldClass(),
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
						value: "spotify",
						children: "Spotify"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 532,
						columnNumber: 15
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
						value: "soundcloud",
						children: "SoundCloud"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 533,
						columnNumber: 15
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
						value: "youtube",
						children: "YouTube"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 534,
						columnNumber: 15
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 527,
				columnNumber: 13
			}, this)] }, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 525,
				columnNumber: 11
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TextInput, {
				label: "آدرس Embed",
				value: d.url ?? "",
				onChange: (v) => update({ url: v }),
				dir: "ltr"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 537,
				columnNumber: 11
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 524,
			columnNumber: 9
		}, this);
		case "gallery": return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ListEditor, {
			label: "تصاویر (آدرس)",
			items: d.images ?? [],
			onChange: (images) => update({ images }),
			render: (v, set) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
				value: v,
				onChange: (e) => set(e.target.value),
				dir: "ltr",
				placeholder: "https://...",
				className: fieldClass()
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 552,
				columnNumber: 13
			}, this),
			newItem: () => ""
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 547,
			columnNumber: 9
		}, this);
		case "menu": return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "grid gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TextInput, {
				label: "عنوان منو",
				value: d.title ?? "",
				onChange: (v) => update({ title: v })
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 566,
				columnNumber: 11
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ListEditor, {
				label: "آیتم‌ها",
				items: d.items ?? [],
				onChange: (items) => update({ items }),
				render: (it, set) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "grid grid-cols-2 gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
						value: it.name ?? "",
						placeholder: "نام",
						onChange: (e) => set({
							...it,
							name: e.target.value
						}),
						className: fieldClass()
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 577,
						columnNumber: 17
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
						value: it.price ?? "",
						placeholder: "قیمت",
						onChange: (e) => set({
							...it,
							price: e.target.value
						}),
						className: fieldClass()
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 583,
						columnNumber: 17
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 576,
					columnNumber: 15
				}, this),
				newItem: () => ({
					name: "",
					price: ""
				})
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 571,
				columnNumber: 11
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 565,
			columnNumber: 9
		}, this);
		case "instagram": return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TextInput, {
			label: "آیدی اینستاگرام",
			value: d.handle ?? "",
			onChange: (v) => update({ handle: v }),
			dir: "ltr",
			placeholder: "@username"
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 597,
			columnNumber: 9
		}, this);
		case "booking": return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "grid gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TextInput, {
				label: "عنوان",
				value: d.title ?? "",
				onChange: (v) => update({ title: v })
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 608,
				columnNumber: 11
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TextInput, {
				label: "متن دکمه",
				value: d.ctaLabel ?? "",
				onChange: (v) => update({ ctaLabel: v })
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 609,
				columnNumber: 11
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 607,
			columnNumber: 9
		}, this);
		case "contact": return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "grid gap-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TextInput, {
					label: "تلفن",
					value: d.phone ?? "",
					onChange: (v) => update({ phone: v }),
					dir: "ltr"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 619,
					columnNumber: 11
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TextInput, {
					label: "ایمیل",
					value: d.email ?? "",
					onChange: (v) => update({ email: v }),
					dir: "ltr"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 625,
					columnNumber: 11
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TextInput, {
					label: "واتس‌اپ",
					value: d.whatsapp ?? "",
					onChange: (v) => update({ whatsapp: v }),
					dir: "ltr"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 631,
					columnNumber: 11
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 618,
			columnNumber: 9
		}, this);
		case "faq": return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ListEditor, {
			label: "پرسش‌ها",
			items: d.items ?? [],
			onChange: (items) => update({ items }),
			render: (it, set) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "grid gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
					value: it.q ?? "",
					placeholder: "سوال",
					onChange: (e) => set({
						...it,
						q: e.target.value
					}),
					className: fieldClass()
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 647,
					columnNumber: 15
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("textarea", {
					value: it.a ?? "",
					placeholder: "پاسخ",
					onChange: (e) => set({
						...it,
						a: e.target.value
					}),
					rows: 2,
					className: fieldClass()
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 653,
					columnNumber: 15
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 646,
				columnNumber: 13
			}, this),
			newItem: () => ({
				q: "",
				a: ""
			})
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 641,
			columnNumber: 9
		}, this);
		case "map": return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "grid gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TextInput, {
				label: "عنوان مکان",
				value: d.label ?? "",
				onChange: (v) => update({ label: v })
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 668,
				columnNumber: 11
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "grid grid-cols-2 gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
					className: labelClass(),
					children: "عرض"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 675,
					columnNumber: 15
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
					dir: "ltr",
					type: "number",
					value: d.lat ?? 0,
					onChange: (e) => update({ lat: parseFloat(e.target.value) }),
					className: fieldClass()
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 676,
					columnNumber: 15
				}, this)] }, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 674,
					columnNumber: 13
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
					className: labelClass(),
					children: "طول"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 685,
					columnNumber: 15
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
					dir: "ltr",
					type: "number",
					value: d.lng ?? 0,
					onChange: (e) => update({ lng: parseFloat(e.target.value) }),
					className: fieldClass()
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 686,
					columnNumber: 15
				}, this)] }, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 684,
					columnNumber: 13
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 673,
				columnNumber: 11
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 667,
			columnNumber: 9
		}, this);
		case "test": return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "grid gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TextInput, {
				label: "عنوان",
				value: d.title ?? "",
				onChange: (v) => update({ title: v })
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 700,
				columnNumber: 11
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TextInput, {
				label: "متن دکمه",
				value: d.ctaLabel ?? "",
				onChange: (v) => update({ ctaLabel: v })
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 701,
				columnNumber: 11
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 699,
			columnNumber: 9
		}, this);
		case "event": return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "grid gap-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TextInput, {
					label: "عنوان رویداد",
					value: d.title ?? "",
					onChange: (v) => update({ title: v })
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 711,
					columnNumber: 11
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
					className: labelClass(),
					children: "تاریخ"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 717,
					columnNumber: 13
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
					type: "datetime-local",
					value: d.date ?? "",
					onChange: (e) => update({ date: e.target.value }),
					className: fieldClass()
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 718,
					columnNumber: 13
				}, this)] }, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 716,
					columnNumber: 11
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TextArea, {
					label: "توضیحات",
					value: d.description ?? "",
					onChange: (v) => update({ description: v })
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 725,
					columnNumber: 11
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 710,
			columnNumber: 9
		}, this);
		case "countdown": return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "grid gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TextInput, {
				label: "عنوان",
				value: d.title ?? "",
				onChange: (v) => update({ title: v })
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 735,
				columnNumber: 11
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
				className: labelClass(),
				children: "تاریخ هدف"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 737,
				columnNumber: 13
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
				type: "datetime-local",
				value: (d.target ?? "").slice(0, 16),
				onChange: (e) => update({ target: new Date(e.target.value).toISOString() }),
				className: fieldClass()
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 738,
				columnNumber: 13
			}, this)] }, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 736,
				columnNumber: 11
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 734,
			columnNumber: 9
		}, this);
		case "social": return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ListEditor, {
			label: "شبکه‌ها",
			items: d.links ?? [],
			onChange: (links) => update({ links }),
			render: (it, set) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "grid grid-cols-[110px_1fr] gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("select", {
					value: it.platform ?? "instagram",
					onChange: (e) => set({
						...it,
						platform: e.target.value
					}),
					className: fieldClass(),
					children: [
						"instagram",
						"telegram",
						"whatsapp",
						"twitter",
						"youtube",
						"spotify",
						"website"
					].map((p) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
						value: p,
						children: p
					}, p, false, {
						fileName: _jsxFileName,
						lineNumber: 769,
						columnNumber: 19
					}, this))
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 755,
					columnNumber: 15
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
					value: it.url ?? "",
					dir: "ltr",
					placeholder: "https://...",
					onChange: (e) => set({
						...it,
						url: e.target.value
					}),
					className: fieldClass()
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 774,
					columnNumber: 15
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 754,
				columnNumber: 13
			}, this),
			newItem: () => ({
				platform: "instagram",
				url: ""
			})
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 749,
			columnNumber: 9
		}, this);
		case "file": return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "grid gap-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TextInput, {
					label: "عنوان",
					value: d.label ?? "",
					onChange: (v) => update({ label: v })
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 789,
					columnNumber: 11
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TextInput, {
					label: "آدرس فایل",
					value: d.url ?? "",
					onChange: (v) => update({ url: v }),
					dir: "ltr"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 790,
					columnNumber: 11
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TextInput, {
					label: "حجم",
					value: d.size ?? "",
					onChange: (v) => update({ size: v }),
					placeholder: "2.5MB"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 796,
					columnNumber: 11
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 788,
			columnNumber: 9
		}, this);
		case "hero": return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "grid gap-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TextInput, {
					label: "نشان (Badge)",
					value: d.badge ?? "",
					onChange: (v) => update({ badge: v })
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 809,
					columnNumber: 11
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TextArea, {
					label: "عنوان (هر خط = یک سطر)",
					value: d.title ?? "",
					onChange: (v) => update({ title: v }),
					rows: 3
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 814,
					columnNumber: 11
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TextArea, {
					label: "زیرعنوان",
					value: d.subtitle ?? "",
					onChange: (v) => update({ subtitle: v })
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 820,
					columnNumber: 11
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "grid grid-cols-2 gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TextInput, {
						label: "متن دکمه",
						value: d.cta_text ?? "",
						onChange: (v) => update({ cta_text: v })
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 826,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TextInput, {
						label: "لینک دکمه",
						value: d.cta_url ?? "",
						onChange: (v) => update({ cta_url: v }),
						dir: "ltr"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 831,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 825,
					columnNumber: 11
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TextInput, {
					label: "یادداشت زیر دکمه",
					value: d.note ?? "",
					onChange: (v) => update({ note: v })
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 838,
					columnNumber: 11
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 808,
			columnNumber: 9
		}, this);
		case "personality_types": return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "grid gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SectionHeadingFields, {
				d,
				update
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 848,
				columnNumber: 11
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ListEditor, {
				label: "تیپ‌ها",
				items: d.items ?? [],
				onChange: (items) => update({ items }),
				render: (it, set) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "grid grid-cols-[1fr_1fr_70px] gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
							value: it.label ?? "",
							placeholder: "نام",
							onChange: (e) => set({
								...it,
								label: e.target.value
							}),
							className: fieldClass()
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 855,
							columnNumber: 17
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
							value: it.tagline ?? "",
							placeholder: "توضیح کوتاه",
							onChange: (e) => set({
								...it,
								tagline: e.target.value
							}),
							className: fieldClass()
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 861,
							columnNumber: 17
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
							type: "color",
							value: it.color ?? "#d4af37",
							onChange: (e) => set({
								...it,
								color: e.target.value
							}),
							className: fieldClass()
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 867,
							columnNumber: 17
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 854,
					columnNumber: 15
				}, this),
				newItem: () => ({
					label: "",
					tagline: "",
					color: "#d4af37"
				})
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 849,
				columnNumber: 11
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 847,
			columnNumber: 9
		}, this);
		case "how_it_works": return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SectionHeadingFields, {
			d,
			update
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 880,
			columnNumber: 14
		}, this);
		case "menu_highlights": return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "grid gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SectionHeadingFields, {
				d,
				update
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 884,
				columnNumber: 11
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "grid grid-cols-2 gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
					className: labelClass(),
					children: "تعداد آیتم‌ها"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 887,
					columnNumber: 15
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
					type: "number",
					min: 1,
					max: 12,
					value: d.count ?? 4,
					onChange: (e) => update({ count: parseInt(e.target.value) || 4 }),
					className: fieldClass()
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 888,
					columnNumber: 15
				}, this)] }, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 886,
					columnNumber: 13
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex items-end gap-2",
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
						className: "text-xs flex items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
								type: "checkbox",
								checked: d.show_prices !== false,
								onChange: (e) => update({ show_prices: e.target.checked })
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 899,
								columnNumber: 17
							}, this),
							" ",
							"نمایش قیمت"
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 898,
						columnNumber: 15
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 897,
					columnNumber: 13
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 885,
				columnNumber: 11
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 883,
			columnNumber: 9
		}, this);
		case "parallax_gallery": return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SectionHeadingFields, {
			d,
			update
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 911,
			columnNumber: 14
		}, this);
		case "gallery_preview": return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "grid gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SectionHeadingFields, {
				d,
				update
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 915,
				columnNumber: 11
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "grid grid-cols-2 gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
					className: labelClass(),
					children: "تعداد تصاویر"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 918,
					columnNumber: 15
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
					type: "number",
					min: 1,
					max: 24,
					value: d.count ?? 6,
					onChange: (e) => update({ count: parseInt(e.target.value) || 6 }),
					className: fieldClass()
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 919,
					columnNumber: 15
				}, this)] }, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 917,
					columnNumber: 13
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
					className: labelClass(),
					children: "تعداد ستون‌ها"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 929,
					columnNumber: 15
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("select", {
					value: d.columns ?? 6,
					onChange: (e) => update({ columns: parseInt(e.target.value) }),
					className: fieldClass(),
					children: [
						3,
						4,
						5,
						6
					].map((n) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
						value: n,
						children: n
					}, n, false, {
						fileName: _jsxFileName,
						lineNumber: 936,
						columnNumber: 19
					}, this))
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 930,
					columnNumber: 15
				}, this)] }, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 928,
					columnNumber: 13
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 916,
				columnNumber: 11
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 914,
			columnNumber: 9
		}, this);
		case "events_preview": return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "grid gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SectionHeadingFields, {
				d,
				update
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 948,
				columnNumber: 11
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
				className: labelClass(),
				children: "تعداد رویدادها"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 950,
				columnNumber: 13
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
				type: "number",
				min: 1,
				max: 6,
				value: d.count ?? 2,
				onChange: (e) => update({ count: parseInt(e.target.value) || 2 }),
				className: fieldClass()
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 951,
				columnNumber: 13
			}, this)] }, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 949,
				columnNumber: 11
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 947,
			columnNumber: 9
		}, this);
		case "testimonials_section": return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SectionHeadingFields, {
			d,
			update
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 963,
			columnNumber: 14
		}, this);
		case "location": return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "grid gap-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SectionHeadingFields, {
					d,
					update
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 967,
					columnNumber: 11
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TextInput, {
					label: "آدرس (خالی = از تنظیمات سایت)",
					value: d.address ?? "",
					onChange: (v) => update({ address: v })
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 968,
					columnNumber: 11
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TextInput, {
					label: "ساعات کاری",
					value: d.hours ?? "",
					onChange: (v) => update({ hours: v })
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 973,
					columnNumber: 11
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TextInput, {
					label: "تلفن",
					value: d.phone ?? "",
					onChange: (v) => update({ phone: v }),
					dir: "ltr"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 978,
					columnNumber: 11
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TextInput, {
					label: "اینستاگرام (URL)",
					value: d.instagram ?? "",
					onChange: (v) => update({ instagram: v }),
					dir: "ltr"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 984,
					columnNumber: 11
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 966,
			columnNumber: 9
		}, this);
		case "stats": return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ListEditor, {
			label: "آمار",
			items: d.items ?? [],
			onChange: (items) => update({ items }),
			render: (it, set) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "grid grid-cols-2 gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
					value: it.value ?? "",
					placeholder: "عدد",
					onChange: (e) => set({
						...it,
						value: e.target.value
					}),
					className: fieldClass()
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 1e3,
					columnNumber: 15
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
					value: it.label ?? "",
					placeholder: "برچسب",
					onChange: (e) => set({
						...it,
						label: e.target.value
					}),
					className: fieldClass()
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 1006,
					columnNumber: 15
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 999,
				columnNumber: 13
			}, this),
			newItem: () => ({
				value: "",
				label: ""
			})
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 994,
			columnNumber: 9
		}, this);
		case "rich_text": return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "grid gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TextInput, {
				label: "عنوان (اختیاری)",
				value: d.title ?? "",
				onChange: (v) => update({ title: v })
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 1020,
				columnNumber: 11
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TextArea, {
				label: "متن",
				value: d.text ?? "",
				onChange: (v) => update({ text: v }),
				rows: 5
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 1025,
				columnNumber: 11
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 1019,
			columnNumber: 9
		}, this);
		case "custom_html": return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TextArea, {
			label: "HTML سفارشی",
			value: d.html ?? "",
			onChange: (v) => update({ html: v }),
			rows: 6
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 1035,
			columnNumber: 9
		}, this);
		case "spacer": return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
			className: labelClass(),
			children: "ارتفاع (پیکسل)"
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 1045,
			columnNumber: 11
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
			type: "number",
			min: 10,
			max: 400,
			value: d.height ?? 60,
			onChange: (e) => update({ height: parseInt(e.target.value) || 60 }),
			className: fieldClass()
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 1046,
			columnNumber: 11
		}, this)] }, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 1044,
			columnNumber: 9
		}, this);
		default: return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
			className: "text-xs text-muted-foreground",
			children: "این بلوک تنظیمات ویرایشی ندارد."
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 1057,
			columnNumber: 14
		}, this);
	}
}
function SectionHeadingFields({ d, update }) {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "grid gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "grid grid-cols-[120px_1fr] gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
				value: d.kicker ?? "",
				placeholder: "کیکر",
				onChange: (e) => update({ kicker: e.target.value }),
				className: fieldClass()
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 1065,
				columnNumber: 9
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
				value: d.title ?? "",
				placeholder: "عنوان",
				onChange: (e) => update({ title: e.target.value }),
				className: fieldClass()
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 1071,
				columnNumber: 9
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 1064,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
			value: d.subtitle ?? "",
			placeholder: "زیرعنوان (اختیاری)",
			onChange: (e) => update({ subtitle: e.target.value }),
			className: fieldClass()
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 1078,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 1063,
		columnNumber: 5
	}, this);
}
function ListEditor({ label, items, onChange, render, newItem }) {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
		className: labelClass(),
		children: label
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 1103,
		columnNumber: 7
	}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "grid gap-2",
		children: [items.map((it, i) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "flex items-start gap-2 rounded-lg border border-border p-2 bg-muted/30",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "flex-1",
				children: render(it, (v) => onChange(items.map((x, j) => j === i ? v : x)))
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 1110,
				columnNumber: 13
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
				onClick: () => onChange(items.filter((_, j) => j !== i)),
				className: "shrink-0 h-7 w-7 rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive grid place-items-center",
				"aria-label": "حذف",
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", {
					width: "14",
					height: "14",
					viewBox: "0 0 24 24",
					fill: "none",
					stroke: "currentColor",
					strokeWidth: "2",
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", { d: "M18 6L6 18M6 6l12 12" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 1126,
						columnNumber: 17
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 1118,
					columnNumber: 15
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 1113,
				columnNumber: 13
			}, this)]
		}, i, true, {
			fileName: _jsxFileName,
			lineNumber: 1106,
			columnNumber: 11
		}, this)), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
			onClick: () => onChange([...items, newItem()]),
			className: "text-xs font-medium text-foreground/80 hover:text-foreground rounded-md border border-dashed border-border py-2",
			children: "+ افزودن"
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 1131,
			columnNumber: 9
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 1104,
		columnNumber: 7
	}, this)] }, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 1102,
		columnNumber: 5
	}, this);
}
function socialIcon(p) {
	const cls = "h-5 w-5";
	switch (p) {
		case "instagram": return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Instagram, { className: cls }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 1148,
			columnNumber: 14
		}, this);
		case "telegram": return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Send, { className: cls }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 1150,
			columnNumber: 14
		}, this);
		case "whatsapp": return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(MessageCircle, { className: cls }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 1152,
			columnNumber: 14
		}, this);
		case "twitter": return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Twitter, { className: cls }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 1154,
			columnNumber: 14
		}, this);
		case "youtube": return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Youtube, { className: cls }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 1156,
			columnNumber: 14
		}, this);
		case "spotify": return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Music, { className: cls }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 1158,
			columnNumber: 14
		}, this);
		default: return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Globe, { className: cls }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 1160,
			columnNumber: 14
		}, this);
	}
}
function BlockRender({ block }) {
	const d = block.data;
	switch (normalizeBlockType(block.type)) {
		case "header": return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "text-center px-4 py-3",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
				className: "text-lg font-bold text-foreground",
				children: d.title
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 1170,
				columnNumber: 11
			}, this), d.subtitle && /* @__PURE__ */ (void 0)("p", {
				className: "text-xs text-muted-foreground mt-1",
				children: d.subtitle
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 1171,
				columnNumber: 26
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 1169,
			columnNumber: 9
		}, this);
		case "paragraph": return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
			className: "text-sm text-foreground/85 leading-7 px-4 py-2 whitespace-pre-wrap",
			children: d.text
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 1176,
			columnNumber: 9
		}, this);
		case "quote": return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "mx-4 my-2 rounded-2xl bg-muted/50 px-4 py-3 border-r-2 border-foreground/30",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
				className: "text-sm italic text-foreground/85",
				children: [
					"«",
					d.text,
					"»"
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 1183,
				columnNumber: 11
			}, this), d.author && /* @__PURE__ */ (void 0)("p", {
				className: "text-[11px] text-muted-foreground mt-1",
				children: ["— ", d.author]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 1184,
				columnNumber: 24
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 1182,
			columnNumber: 9
		}, this);
		case "divider": return d.style === "space" ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "h-4" }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 1189,
			columnNumber: 9
		}, this) : d.style === "dots" ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "my-3 mx-auto w-12 text-center text-muted-foreground",
			children: "···"
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 1191,
			columnNumber: 9
		}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("hr", { className: "my-3 mx-4 border-border" }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 1193,
			columnNumber: 9
		}, this);
		case "button": {
			const base = "block w-[calc(100%-2rem)] mx-4 my-2 text-center rounded-2xl px-4 py-3 text-sm font-semibold transition";
			const style = d.style === "outline" ? "border border-foreground/20 bg-transparent text-foreground" : d.style === "secondary" ? "bg-muted text-foreground hover:bg-muted/80" : "bg-foreground text-background hover:bg-foreground/90";
			return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", {
				href: d.url || "#",
				className: `${base} ${style}`,
				children: d.label
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 1205,
				columnNumber: 9
			}, this);
		}
		case "image": return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("figure", {
			className: "mx-4 my-2",
			children: [d.url ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("img", {
				src: d.url,
				alt: d.caption || "",
				className: "w-full rounded-2xl object-cover max-h-56"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 1214,
				columnNumber: 13
			}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "h-32 rounded-2xl bg-muted grid place-items-center text-xs text-muted-foreground",
				children: "تصویر"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 1220,
				columnNumber: 13
			}, this), d.caption && /* @__PURE__ */ (void 0)("figcaption", {
				className: "text-[11px] text-muted-foreground mt-1 text-center",
				children: d.caption
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 1225,
				columnNumber: 13
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 1212,
			columnNumber: 9
		}, this);
		case "gallery": return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "mx-4 my-2 grid grid-cols-3 gap-1.5",
			children: (d.images?.length ? d.images : [
				"",
				"",
				""
			]).map((u, i) => u ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("img", {
				src: u,
				className: "aspect-square rounded-lg object-cover"
			}, i, false, {
				fileName: _jsxFileName,
				lineNumber: 1236,
				columnNumber: 15
			}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "aspect-square rounded-lg bg-muted" }, i, false, {
				fileName: _jsxFileName,
				lineNumber: 1238,
				columnNumber: 15
			}, this))
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 1233,
			columnNumber: 9
		}, this);
		case "video": return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "mx-4 my-2 rounded-2xl overflow-hidden bg-black aspect-video",
			children: d.url ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("iframe", {
				src: d.url,
				className: "w-full h-full",
				allowFullScreen: true
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 1246,
				columnNumber: 20
			}, this) : null
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 1245,
			columnNumber: 9
		}, this);
		case "music": return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "mx-4 my-2 rounded-2xl bg-muted/50 p-3 flex items-center gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Music, { className: "h-5 w-5" }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 1252,
				columnNumber: 11
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "text-xs text-foreground/80 truncate flex-1",
				children: d.url || `پلیر ${d.provider}`
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 1253,
				columnNumber: 11
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 1251,
			columnNumber: 9
		}, this);
		case "menu": return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "mx-4 my-2 rounded-2xl border border-border p-3",
			children: [d.title && /* @__PURE__ */ (void 0)("h3", {
				className: "text-sm font-bold mb-2",
				children: d.title
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 1261,
				columnNumber: 23
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("ul", {
				className: "text-sm divide-y divide-border",
				children: (d.items ?? []).map((it, i) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", {
					className: "flex justify-between py-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: it.name }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 1265,
						columnNumber: 17
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
						className: "text-muted-foreground",
						children: it.price
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 1266,
						columnNumber: 17
					}, this)]
				}, i, true, {
					fileName: _jsxFileName,
					lineNumber: 1264,
					columnNumber: 15
				}, this))
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 1262,
				columnNumber: 11
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 1260,
			columnNumber: 9
		}, this);
		case "instagram": return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", {
			href: `https://instagram.com/${(d.handle ?? "").replace(/^@/, "")}`,
			className: "mx-4 my-2 flex items-center gap-3 rounded-2xl border border-border px-3 py-2.5",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Instagram, { className: "h-5 w-5" }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 1278,
				columnNumber: 11
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "text-xs",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "font-semibold",
					children: "اینستاگرام"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 1280,
					columnNumber: 13
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "text-muted-foreground",
					dir: "ltr",
					children: d.handle
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 1281,
					columnNumber: 13
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 1279,
				columnNumber: 11
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 1274,
			columnNumber: 9
		}, this);
		case "booking": return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "mx-4 my-2 rounded-2xl bg-foreground text-background p-4 text-center",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "text-sm font-bold",
				children: d.title
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 1290,
				columnNumber: 11
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
				className: "mt-2 rounded-full bg-background text-foreground px-4 py-1.5 text-xs font-semibold",
				children: d.ctaLabel
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 1291,
				columnNumber: 11
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 1289,
			columnNumber: 9
		}, this);
		case "contact": return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "mx-4 my-2 rounded-2xl border border-border divide-y divide-border text-sm",
			children: [
				d.phone && /* @__PURE__ */ (void 0)("div", {
					className: "px-3 py-2 flex justify-between",
					children: [/* @__PURE__ */ (void 0)("span", {
						className: "text-muted-foreground",
						children: "تلفن"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 1301,
						columnNumber: 15
					}, this), /* @__PURE__ */ (void 0)("span", {
						dir: "ltr",
						children: d.phone
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 1302,
						columnNumber: 15
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 1300,
					columnNumber: 13
				}, this),
				d.email && /* @__PURE__ */ (void 0)("div", {
					className: "px-3 py-2 flex justify-between",
					children: [/* @__PURE__ */ (void 0)("span", {
						className: "text-muted-foreground",
						children: "ایمیل"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 1307,
						columnNumber: 15
					}, this), /* @__PURE__ */ (void 0)("span", {
						dir: "ltr",
						children: d.email
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 1308,
						columnNumber: 15
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 1306,
					columnNumber: 13
				}, this),
				d.whatsapp && /* @__PURE__ */ (void 0)("div", {
					className: "px-3 py-2 flex justify-between",
					children: [/* @__PURE__ */ (void 0)("span", {
						className: "text-muted-foreground",
						children: "واتس‌اپ"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 1313,
						columnNumber: 15
					}, this), /* @__PURE__ */ (void 0)("span", {
						dir: "ltr",
						children: d.whatsapp
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 1314,
						columnNumber: 15
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 1312,
					columnNumber: 13
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 1298,
			columnNumber: 9
		}, this);
		case "faq": return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "mx-4 my-2 rounded-2xl border border-border divide-y divide-border",
			children: (d.items ?? []).map((it, i) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("details", {
				className: "px-3 py-2 group",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("summary", {
					className: "text-sm font-medium cursor-pointer list-none flex justify-between",
					children: [it.q, /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
						className: "text-muted-foreground group-open:rotate-180 transition",
						children: "▾"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 1326,
						columnNumber: 17
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 1324,
					columnNumber: 15
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "text-xs text-muted-foreground mt-1.5",
					children: it.a
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 1328,
					columnNumber: 15
				}, this)]
			}, i, true, {
				fileName: _jsxFileName,
				lineNumber: 1323,
				columnNumber: 13
			}, this))
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 1321,
			columnNumber: 9
		}, this);
		case "map": return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "mx-4 my-2 rounded-2xl overflow-hidden border border-border bg-muted",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("iframe", {
				className: "w-full h-40",
				src: `https://www.openstreetmap.org/export/embed.html?bbox=${d.lng - .005}%2C${d.lat - .003}%2C${d.lng + .005}%2C${d.lat + .003}&marker=${d.lat}%2C${d.lng}`
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 1336,
				columnNumber: 11
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "px-3 py-2 text-xs text-muted-foreground",
				children: d.label
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 1340,
				columnNumber: 11
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 1335,
			columnNumber: 9
		}, this);
		case "social": return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "mx-4 my-2 flex flex-wrap justify-center gap-2",
			children: (d.links ?? []).map((l, i) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", {
				href: l.url || "#",
				className: "h-10 w-10 rounded-full bg-muted hover:bg-muted/70 grid place-items-center",
				children: socialIcon(l.platform)
			}, i, false, {
				fileName: _jsxFileName,
				lineNumber: 1347,
				columnNumber: 13
			}, this))
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 1345,
			columnNumber: 9
		}, this);
		case "test": return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "mx-4 my-2 rounded-2xl bg-gradient-to-br from-foreground/5 to-foreground/0 border border-border p-4 text-center",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "text-sm font-bold",
				children: d.title
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 1360,
				columnNumber: 11
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
				className: "mt-2 rounded-full bg-foreground text-background px-4 py-1.5 text-xs font-semibold",
				children: d.ctaLabel
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 1361,
				columnNumber: 11
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 1359,
			columnNumber: 9
		}, this);
		case "event": return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "mx-4 my-2 rounded-2xl border border-border p-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "text-sm font-bold",
					children: d.title
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 1369,
					columnNumber: 11
				}, this),
				d.date && /* @__PURE__ */ (void 0)("div", {
					className: "text-[11px] text-muted-foreground mt-1",
					dir: "ltr",
					children: new Date(d.date).toLocaleString()
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 1371,
					columnNumber: 13
				}, this),
				d.description && /* @__PURE__ */ (void 0)("p", {
					className: "text-xs text-foreground/80 mt-2",
					children: d.description
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 1375,
					columnNumber: 29
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 1368,
			columnNumber: 9
		}, this);
		case "countdown": return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Countdown, {
			title: d.title,
			target: d.target
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 1379,
			columnNumber: 14
		}, this);
		case "file": return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", {
			href: d.url || "#",
			className: "mx-4 my-2 flex items-center gap-3 rounded-2xl border border-border px-3 py-2.5",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "h-9 w-9 rounded-lg bg-muted grid place-items-center",
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { className: "h-4 w-4" }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 1387,
					columnNumber: 13
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 1386,
				columnNumber: 11
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "flex-1 text-xs",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "font-semibold",
					children: d.label
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 1390,
					columnNumber: 13
				}, this), d.size && /* @__PURE__ */ (void 0)("div", {
					className: "text-muted-foreground",
					children: d.size
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 1391,
					columnNumber: 24
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 1389,
				columnNumber: 11
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 1382,
			columnNumber: 9
		}, this);
		default: {
			const def = getBlockDef(block.type);
			return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "mx-4 my-2 rounded-2xl border border-dashed border-border bg-muted/30 px-4 py-6 text-center",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "inline-flex items-center gap-2 text-xs font-bold text-foreground/70",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(BlockIcon, { d: def?.icon ?? "M4 4h16v16H4z" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 1400,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: ["بخش ", def?.label ?? block.type] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 1401,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 1399,
					columnNumber: 11
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "text-[11px] text-muted-foreground mt-1",
					children: "پیش‌نمایش زنده در صفحه اصلی"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 1403,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 1398,
				columnNumber: 9
			}, this);
		}
	}
}
function Countdown({ title, target }) {
	const t = new Date(target).getTime();
	const diff = Math.max(0, t - Date.now());
	const days = Math.floor(diff / 864e5);
	const hours = Math.floor(diff % 864e5 / 36e5);
	const mins = Math.floor(diff % 36e5 / 6e4);
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "mx-4 my-2 rounded-2xl bg-muted/50 p-3 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "text-xs text-muted-foreground",
			children: title
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 1418,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "mt-2 grid grid-cols-3 gap-2 text-center",
			children: [
				[days, "روز"],
				[hours, "ساعت"],
				[mins, "دقیقه"]
			].map(([n, l]) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "rounded-lg bg-background py-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "text-base font-bold",
					children: n
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 1426,
					columnNumber: 13
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "text-[10px] text-muted-foreground",
					children: l
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 1427,
					columnNumber: 13
				}, this)]
			}, l, true, {
				fileName: _jsxFileName,
				lineNumber: 1425,
				columnNumber: 11
			}, this))
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 1419,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 1417,
		columnNumber: 5
	}, this);
}
//#endregion
export { defaultBlockData as a, BlockRender as i, BlockEditor as n, getBlockDef as o, BlockIcon as r, normalizeBlockType as s, BLOCK_DEFS as t };
