import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { A as Instagram, O as Link, P as Globe, c as Twitter, h as Send, t as Youtube, w as MessageCircle, x as Music } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/blocks-SD5k4s2V.js
var import_jsx_runtime = require_jsx_runtime();
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "1.8",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		children: d.split("|").map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: p }, i))
	});
}
function fieldClass() {
	return "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground/30 focus:ring-2 focus:ring-foreground/5 transition";
}
function labelClass() {
	return "text-xs font-medium text-muted-foreground mb-1.5 block";
}
function TextInput({ label, value, onChange, placeholder, dir }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
		className: labelClass(),
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		dir,
		value,
		placeholder,
		onChange: (e) => onChange(e.target.value),
		className: fieldClass()
	})] });
}
function TextArea({ label, value, onChange, rows = 3 }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
		className: labelClass(),
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		rows,
		value,
		onChange: (e) => onChange(e.target.value),
		className: fieldClass()
	})] });
}
function BlockEditor({ block, onUpdate }) {
	const update = onUpdate;
	const d = block.data;
	switch (normalizeBlockType(block.type)) {
		case "header": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
				label: "عنوان",
				value: d.title ?? "",
				onChange: (v) => update({ title: v })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
				label: "زیرعنوان",
				value: d.subtitle ?? "",
				onChange: (v) => update({ subtitle: v })
			})]
		});
		case "paragraph": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextArea, {
			label: "متن",
			value: d.text ?? "",
			onChange: (v) => update({ text: v })
		});
		case "quote": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextArea, {
				label: "متن نقل قول",
				value: d.text ?? "",
				onChange: (v) => update({ text: v })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
				label: "نویسنده",
				value: d.author ?? "",
				onChange: (v) => update({ author: v })
			})]
		});
		case "divider": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
			className: labelClass(),
			children: "سبک"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
			value: d.style,
			onChange: (e) => update({ style: e.target.value }),
			className: fieldClass(),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: "line",
					children: "خط"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: "dots",
					children: "نقطه‌چین"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: "space",
					children: "فضای خالی"
				})
			]
		})] });
		case "button": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
					label: "عنوان دکمه",
					value: d.label ?? "",
					onChange: (v) => update({ label: v })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
					label: "آدرس",
					value: d.url ?? "",
					onChange: (v) => update({ url: v }),
					dir: "ltr"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: labelClass(),
					children: "سبک"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					value: d.style,
					onChange: (e) => update({ style: e.target.value }),
					className: fieldClass(),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "primary",
							children: "اصلی"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "secondary",
							children: "ثانویه"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "outline",
							children: "خطی"
						})
					]
				})] })
			]
		});
		case "image": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
				label: "آدرس تصویر",
				value: d.url ?? "",
				onChange: (v) => update({ url: v }),
				dir: "ltr",
				placeholder: "https://..."
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
				label: "کپشن",
				value: d.caption ?? "",
				onChange: (v) => update({ caption: v })
			})]
		});
		case "video": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
				label: "آدرس Embed",
				value: d.url ?? "",
				onChange: (v) => update({ url: v }),
				dir: "ltr"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
				label: "عنوان",
				value: d.title ?? "",
				onChange: (v) => update({ title: v })
			})]
		});
		case "music": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
				className: labelClass(),
				children: "سرویس"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
				value: d.provider,
				onChange: (e) => update({ provider: e.target.value }),
				className: fieldClass(),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "spotify",
						children: "Spotify"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "soundcloud",
						children: "SoundCloud"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "youtube",
						children: "YouTube"
					})
				]
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
				label: "آدرس Embed",
				value: d.url ?? "",
				onChange: (v) => update({ url: v }),
				dir: "ltr"
			})]
		});
		case "gallery": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListEditor, {
			label: "تصاویر (آدرس)",
			items: d.images ?? [],
			onChange: (images) => update({ images }),
			render: (v, set) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				value: v,
				onChange: (e) => set(e.target.value),
				dir: "ltr",
				placeholder: "https://...",
				className: fieldClass()
			}),
			newItem: () => ""
		});
		case "menu": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
				label: "عنوان منو",
				value: d.title ?? "",
				onChange: (v) => update({ title: v })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListEditor, {
				label: "آیتم‌ها",
				items: d.items ?? [],
				onChange: (items) => update({ items }),
				render: (it, set) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: it.name ?? "",
						placeholder: "نام",
						onChange: (e) => set({
							...it,
							name: e.target.value
						}),
						className: fieldClass()
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: it.price ?? "",
						placeholder: "قیمت",
						onChange: (e) => set({
							...it,
							price: e.target.value
						}),
						className: fieldClass()
					})]
				}),
				newItem: () => ({
					name: "",
					price: ""
				})
			})]
		});
		case "instagram": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
			label: "آیدی اینستاگرام",
			value: d.handle ?? "",
			onChange: (v) => update({ handle: v }),
			dir: "ltr",
			placeholder: "@username"
		});
		case "booking": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
				label: "عنوان",
				value: d.title ?? "",
				onChange: (v) => update({ title: v })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
				label: "متن دکمه",
				value: d.ctaLabel ?? "",
				onChange: (v) => update({ ctaLabel: v })
			})]
		});
		case "contact": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
					label: "تلفن",
					value: d.phone ?? "",
					onChange: (v) => update({ phone: v }),
					dir: "ltr"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
					label: "ایمیل",
					value: d.email ?? "",
					onChange: (v) => update({ email: v }),
					dir: "ltr"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
					label: "واتس‌اپ",
					value: d.whatsapp ?? "",
					onChange: (v) => update({ whatsapp: v }),
					dir: "ltr"
				})
			]
		});
		case "faq": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListEditor, {
			label: "پرسش‌ها",
			items: d.items ?? [],
			onChange: (items) => update({ items }),
			render: (it, set) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: it.q ?? "",
					placeholder: "سوال",
					onChange: (e) => set({
						...it,
						q: e.target.value
					}),
					className: fieldClass()
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					value: it.a ?? "",
					placeholder: "پاسخ",
					onChange: (e) => set({
						...it,
						a: e.target.value
					}),
					rows: 2,
					className: fieldClass()
				})]
			}),
			newItem: () => ({
				q: "",
				a: ""
			})
		});
		case "map": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
				label: "عنوان مکان",
				value: d.label ?? "",
				onChange: (v) => update({ label: v })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: labelClass(),
					children: "عرض"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					dir: "ltr",
					type: "number",
					value: d.lat ?? 0,
					onChange: (e) => update({ lat: parseFloat(e.target.value) }),
					className: fieldClass()
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: labelClass(),
					children: "طول"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					dir: "ltr",
					type: "number",
					value: d.lng ?? 0,
					onChange: (e) => update({ lng: parseFloat(e.target.value) }),
					className: fieldClass()
				})] })]
			})]
		});
		case "test": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
				label: "عنوان",
				value: d.title ?? "",
				onChange: (v) => update({ title: v })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
				label: "متن دکمه",
				value: d.ctaLabel ?? "",
				onChange: (v) => update({ ctaLabel: v })
			})]
		});
		case "event": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
					label: "عنوان رویداد",
					value: d.title ?? "",
					onChange: (v) => update({ title: v })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: labelClass(),
					children: "تاریخ"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "datetime-local",
					value: d.date ?? "",
					onChange: (e) => update({ date: e.target.value }),
					className: fieldClass()
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextArea, {
					label: "توضیحات",
					value: d.description ?? "",
					onChange: (v) => update({ description: v })
				})
			]
		});
		case "countdown": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
				label: "عنوان",
				value: d.title ?? "",
				onChange: (v) => update({ title: v })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
				className: labelClass(),
				children: "تاریخ هدف"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				type: "datetime-local",
				value: (d.target ?? "").slice(0, 16),
				onChange: (e) => update({ target: new Date(e.target.value).toISOString() }),
				className: fieldClass()
			})] })]
		});
		case "social": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListEditor, {
			label: "شبکه‌ها",
			items: d.links ?? [],
			onChange: (links) => update({ links }),
			render: (it, set) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-[110px_1fr] gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
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
					].map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: p,
						children: p
					}, p))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: it.url ?? "",
					dir: "ltr",
					placeholder: "https://...",
					onChange: (e) => set({
						...it,
						url: e.target.value
					}),
					className: fieldClass()
				})]
			}),
			newItem: () => ({
				platform: "instagram",
				url: ""
			})
		});
		case "file": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
					label: "عنوان",
					value: d.label ?? "",
					onChange: (v) => update({ label: v })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
					label: "آدرس فایل",
					value: d.url ?? "",
					onChange: (v) => update({ url: v }),
					dir: "ltr"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
					label: "حجم",
					value: d.size ?? "",
					onChange: (v) => update({ size: v }),
					placeholder: "2.5MB"
				})
			]
		});
		case "hero": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
					label: "نشان (Badge)",
					value: d.badge ?? "",
					onChange: (v) => update({ badge: v })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextArea, {
					label: "عنوان (هر خط = یک سطر)",
					value: d.title ?? "",
					onChange: (v) => update({ title: v }),
					rows: 3
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextArea, {
					label: "زیرعنوان",
					value: d.subtitle ?? "",
					onChange: (v) => update({ subtitle: v })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
						label: "متن دکمه",
						value: d.cta_text ?? "",
						onChange: (v) => update({ cta_text: v })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
						label: "لینک دکمه",
						value: d.cta_url ?? "",
						onChange: (v) => update({ cta_url: v }),
						dir: "ltr"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
					label: "یادداشت زیر دکمه",
					value: d.note ?? "",
					onChange: (v) => update({ note: v })
				})
			]
		});
		case "personality_types": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeadingFields, {
				d,
				update
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListEditor, {
				label: "تیپ‌ها",
				items: d.items ?? [],
				onChange: (items) => update({ items }),
				render: (it, set) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-[1fr_1fr_70px] gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: it.label ?? "",
							placeholder: "نام",
							onChange: (e) => set({
								...it,
								label: e.target.value
							}),
							className: fieldClass()
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: it.tagline ?? "",
							placeholder: "توضیح کوتاه",
							onChange: (e) => set({
								...it,
								tagline: e.target.value
							}),
							className: fieldClass()
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "color",
							value: it.color ?? "#d4af37",
							onChange: (e) => set({
								...it,
								color: e.target.value
							}),
							className: fieldClass()
						})
					]
				}),
				newItem: () => ({
					label: "",
					tagline: "",
					color: "#d4af37"
				})
			})]
		});
		case "how_it_works": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeadingFields, {
			d,
			update
		});
		case "menu_highlights": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeadingFields, {
				d,
				update
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: labelClass(),
					children: "تعداد آیتم‌ها"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "number",
					min: 1,
					max: 12,
					value: d.count ?? 4,
					onChange: (e) => update({ count: parseInt(e.target.value) || 4 }),
					className: fieldClass()
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-end gap-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-xs flex items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: d.show_prices !== false,
								onChange: (e) => update({ show_prices: e.target.checked })
							}),
							" ",
							"نمایش قیمت"
						]
					})
				})]
			})]
		});
		case "parallax_gallery": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeadingFields, {
			d,
			update
		});
		case "gallery_preview": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeadingFields, {
				d,
				update
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: labelClass(),
					children: "تعداد تصاویر"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "number",
					min: 1,
					max: 24,
					value: d.count ?? 6,
					onChange: (e) => update({ count: parseInt(e.target.value) || 6 }),
					className: fieldClass()
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: labelClass(),
					children: "تعداد ستون‌ها"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
					value: d.columns ?? 6,
					onChange: (e) => update({ columns: parseInt(e.target.value) }),
					className: fieldClass(),
					children: [
						3,
						4,
						5,
						6
					].map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: n,
						children: n
					}, n))
				})] })]
			})]
		});
		case "events_preview": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeadingFields, {
				d,
				update
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
				className: labelClass(),
				children: "تعداد رویدادها"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				type: "number",
				min: 1,
				max: 6,
				value: d.count ?? 2,
				onChange: (e) => update({ count: parseInt(e.target.value) || 2 }),
				className: fieldClass()
			})] })]
		});
		case "testimonials_section": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeadingFields, {
			d,
			update
		});
		case "location": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeadingFields, {
					d,
					update
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
					label: "آدرس (خالی = از تنظیمات سایت)",
					value: d.address ?? "",
					onChange: (v) => update({ address: v })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
					label: "ساعات کاری",
					value: d.hours ?? "",
					onChange: (v) => update({ hours: v })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
					label: "تلفن",
					value: d.phone ?? "",
					onChange: (v) => update({ phone: v }),
					dir: "ltr"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
					label: "اینستاگرام (URL)",
					value: d.instagram ?? "",
					onChange: (v) => update({ instagram: v }),
					dir: "ltr"
				})
			]
		});
		case "stats": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListEditor, {
			label: "آمار",
			items: d.items ?? [],
			onChange: (items) => update({ items }),
			render: (it, set) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: it.value ?? "",
					placeholder: "عدد",
					onChange: (e) => set({
						...it,
						value: e.target.value
					}),
					className: fieldClass()
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: it.label ?? "",
					placeholder: "برچسب",
					onChange: (e) => set({
						...it,
						label: e.target.value
					}),
					className: fieldClass()
				})]
			}),
			newItem: () => ({
				value: "",
				label: ""
			})
		});
		case "rich_text": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
				label: "عنوان (اختیاری)",
				value: d.title ?? "",
				onChange: (v) => update({ title: v })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextArea, {
				label: "متن",
				value: d.text ?? "",
				onChange: (v) => update({ text: v }),
				rows: 5
			})]
		});
		case "custom_html": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextArea, {
			label: "HTML سفارشی",
			value: d.html ?? "",
			onChange: (v) => update({ html: v }),
			rows: 6
		});
		case "spacer": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
			className: labelClass(),
			children: "ارتفاع (پیکسل)"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			type: "number",
			min: 10,
			max: 400,
			value: d.height ?? 60,
			onChange: (e) => update({ height: parseInt(e.target.value) || 60 }),
			className: fieldClass()
		})] });
		default: return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs text-muted-foreground",
			children: "این بلوک تنظیمات ویرایشی ندارد."
		});
	}
}
function SectionHeadingFields({ d, update }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-[120px_1fr] gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				value: d.kicker ?? "",
				placeholder: "کیکر",
				onChange: (e) => update({ kicker: e.target.value }),
				className: fieldClass()
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				value: d.title ?? "",
				placeholder: "عنوان",
				onChange: (e) => update({ title: e.target.value }),
				className: fieldClass()
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			value: d.subtitle ?? "",
			placeholder: "زیرعنوان (اختیاری)",
			onChange: (e) => update({ subtitle: e.target.value }),
			className: fieldClass()
		})]
	});
}
function ListEditor({ label, items, onChange, render, newItem }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
		className: labelClass(),
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-2",
		children: [items.map((it, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-start gap-2 rounded-lg border border-border p-2 bg-muted/30",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex-1",
				children: render(it, (v) => onChange(items.map((x, j) => j === i ? v : x)))
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => onChange(items.filter((_, j) => j !== i)),
				className: "shrink-0 h-7 w-7 rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive grid place-items-center",
				"aria-label": "حذف",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
					width: "14",
					height: "14",
					viewBox: "0 0 24 24",
					fill: "none",
					stroke: "currentColor",
					strokeWidth: "2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M18 6L6 18M6 6l12 12" })
				})
			})]
		}, i)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			onClick: () => onChange([...items, newItem()]),
			className: "text-xs font-medium text-foreground/80 hover:text-foreground rounded-md border border-dashed border-border py-2",
			children: "+ افزودن"
		})]
	})] });
}
function socialIcon(p) {
	const cls = "h-5 w-5";
	switch (p) {
		case "instagram": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Instagram, { className: cls });
		case "telegram": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: cls });
		case "whatsapp": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: cls });
		case "twitter": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Twitter, { className: cls });
		case "youtube": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Youtube, { className: cls });
		case "spotify": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Music, { className: cls });
		default: return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: cls });
	}
}
function BlockRender({ block }) {
	const d = block.data;
	switch (normalizeBlockType(block.type)) {
		case "header": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "text-center px-4 py-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-lg font-bold text-foreground",
				children: d.title
			}), d.subtitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground mt-1",
				children: d.subtitle
			})]
		});
		case "paragraph": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-foreground/85 leading-7 px-4 py-2 whitespace-pre-wrap",
			children: d.text
		});
		case "quote": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-4 my-2 rounded-2xl bg-muted/50 px-4 py-3 border-r-2 border-foreground/30",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm italic text-foreground/85",
				children: [
					"«",
					d.text,
					"»"
				]
			}), d.author && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-[11px] text-muted-foreground mt-1",
				children: ["— ", d.author]
			})]
		});
		case "divider": return d.style === "space" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4" }) : d.style === "dots" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "my-3 mx-auto w-12 text-center text-muted-foreground",
			children: "···"
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("hr", { className: "my-3 mx-4 border-border" });
		case "button": {
			const base = "block w-[calc(100%-2rem)] mx-4 my-2 text-center rounded-2xl px-4 py-3 text-sm font-semibold transition";
			const style = d.style === "outline" ? "border border-foreground/20 bg-transparent text-foreground" : d.style === "secondary" ? "bg-muted text-foreground hover:bg-muted/80" : "bg-foreground text-background hover:bg-foreground/90";
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: d.url || "#",
				className: `${base} ${style}`,
				children: d.label
			});
		}
		case "image": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
			className: "mx-4 my-2",
			children: [d.url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: d.url,
				alt: d.caption || "",
				className: "w-full rounded-2xl object-cover max-h-56"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-32 rounded-2xl bg-muted grid place-items-center text-xs text-muted-foreground",
				children: "تصویر"
			}), d.caption && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("figcaption", {
				className: "text-[11px] text-muted-foreground mt-1 text-center",
				children: d.caption
			})]
		});
		case "gallery": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mx-4 my-2 grid grid-cols-3 gap-1.5",
			children: (d.images?.length ? d.images : [
				"",
				"",
				""
			]).map((u, i) => u ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: u,
				className: "aspect-square rounded-lg object-cover"
			}, i) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "aspect-square rounded-lg bg-muted" }, i))
		});
		case "video": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mx-4 my-2 rounded-2xl overflow-hidden bg-black aspect-video",
			children: d.url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
				src: d.url,
				className: "w-full h-full",
				allowFullScreen: true
			}) : null
		});
		case "music": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-4 my-2 rounded-2xl bg-muted/50 p-3 flex items-center gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Music, { className: "h-5 w-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-xs text-foreground/80 truncate flex-1",
				children: d.url || `پلیر ${d.provider}`
			})]
		});
		case "menu": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-4 my-2 rounded-2xl border border-border p-3",
			children: [d.title && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-sm font-bold mb-2",
				children: d.title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "text-sm divide-y divide-border",
				children: (d.items ?? []).map((it, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex justify-between py-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: it.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-muted-foreground",
						children: it.price
					})]
				}, i))
			})]
		});
		case "instagram": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
			href: `https://instagram.com/${(d.handle ?? "").replace(/^@/, "")}`,
			className: "mx-4 my-2 flex items-center gap-3 rounded-2xl border border-border px-3 py-2.5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Instagram, { className: "h-5 w-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-semibold",
					children: "اینستاگرام"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-muted-foreground",
					dir: "ltr",
					children: d.handle
				})]
			})]
		});
		case "booking": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-4 my-2 rounded-2xl bg-foreground text-background p-4 text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-sm font-bold",
				children: d.title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				className: "mt-2 rounded-full bg-background text-foreground px-4 py-1.5 text-xs font-semibold",
				children: d.ctaLabel
			})]
		});
		case "contact": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-4 my-2 rounded-2xl border border-border divide-y divide-border text-sm",
			children: [
				d.phone && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "px-3 py-2 flex justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-muted-foreground",
						children: "تلفن"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						dir: "ltr",
						children: d.phone
					})]
				}),
				d.email && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "px-3 py-2 flex justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-muted-foreground",
						children: "ایمیل"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						dir: "ltr",
						children: d.email
					})]
				}),
				d.whatsapp && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "px-3 py-2 flex justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-muted-foreground",
						children: "واتس‌اپ"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						dir: "ltr",
						children: d.whatsapp
					})]
				})
			]
		});
		case "faq": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mx-4 my-2 rounded-2xl border border-border divide-y divide-border",
			children: (d.items ?? []).map((it, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
				className: "px-3 py-2 group",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("summary", {
					className: "text-sm font-medium cursor-pointer list-none flex justify-between",
					children: [it.q, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-muted-foreground group-open:rotate-180 transition",
						children: "▾"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground mt-1.5",
					children: it.a
				})]
			}, i))
		});
		case "map": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-4 my-2 rounded-2xl overflow-hidden border border-border bg-muted",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
				className: "w-full h-40",
				src: `https://www.openstreetmap.org/export/embed.html?bbox=${d.lng - .005}%2C${d.lat - .003}%2C${d.lng + .005}%2C${d.lat + .003}&marker=${d.lat}%2C${d.lng}`
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "px-3 py-2 text-xs text-muted-foreground",
				children: d.label
			})]
		});
		case "social": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mx-4 my-2 flex flex-wrap justify-center gap-2",
			children: (d.links ?? []).map((l, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: l.url || "#",
				className: "h-10 w-10 rounded-full bg-muted hover:bg-muted/70 grid place-items-center",
				children: socialIcon(l.platform)
			}, i))
		});
		case "test": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-4 my-2 rounded-2xl bg-gradient-to-br from-foreground/5 to-foreground/0 border border-border p-4 text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-sm font-bold",
				children: d.title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				className: "mt-2 rounded-full bg-foreground text-background px-4 py-1.5 text-xs font-semibold",
				children: d.ctaLabel
			})]
		});
		case "event": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-4 my-2 rounded-2xl border border-border p-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-sm font-bold",
					children: d.title
				}),
				d.date && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[11px] text-muted-foreground mt-1",
					dir: "ltr",
					children: new Date(d.date).toLocaleString()
				}),
				d.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-foreground/80 mt-2",
					children: d.description
				})
			]
		});
		case "countdown": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Countdown, {
			title: d.title,
			target: d.target
		});
		case "file": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
			href: d.url || "#",
			className: "mx-4 my-2 flex items-center gap-3 rounded-2xl border border-border px-3 py-2.5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-9 w-9 rounded-lg bg-muted grid place-items-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, { className: "h-4 w-4" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 text-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-semibold",
					children: d.label
				}), d.size && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-muted-foreground",
					children: d.size
				})]
			})]
		});
		default: {
			const def = getBlockDef(block.type);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-4 my-2 rounded-2xl border border-dashed border-border bg-muted/30 px-4 py-6 text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "inline-flex items-center gap-2 text-xs font-bold text-foreground/70",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BlockIcon, { d: def?.icon ?? "M4 4h16v16H4z" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["بخش ", def?.label ?? block.type] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[11px] text-muted-foreground mt-1",
					children: "پیش‌نمایش زنده در صفحه اصلی"
				})]
			});
		}
	}
}
function Countdown({ title, target }) {
	const t = new Date(target).getTime();
	const diff = Math.max(0, t - Date.now());
	const days = Math.floor(diff / 864e5);
	const hours = Math.floor(diff % 864e5 / 36e5);
	const mins = Math.floor(diff % 36e5 / 6e4);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-4 my-2 rounded-2xl bg-muted/50 p-3 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-xs text-muted-foreground",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-2 grid grid-cols-3 gap-2 text-center",
			children: [
				[days, "روز"],
				[hours, "ساعت"],
				[mins, "دقیقه"]
			].map(([n, l]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-lg bg-background py-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-base font-bold",
					children: n
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[10px] text-muted-foreground",
					children: l
				})]
			}, l))
		})]
	});
}
//#endregion
export { defaultBlockData as a, BlockRender as i, BlockEditor as n, getBlockDef as o, BlockIcon as r, normalizeBlockType as s, BLOCK_DEFS as t };
