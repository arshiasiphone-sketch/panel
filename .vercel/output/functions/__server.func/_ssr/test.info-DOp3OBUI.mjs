import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { _ as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as AnimatePresence, r as motion } from "../_libs/framer-motion.mjs";
import { r as useTestStore, t as TestPageShell } from "./test-store-Fo5x2Vvr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/test.info-DOp3OBUI.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var GENDERS = [
	{
		value: "male",
		label: "مرد"
	},
	{
		value: "female",
		label: "زن"
	},
	{
		value: "other",
		label: "ترجیح نمیدم بگم"
	}
];
function UserInfoPage() {
	const navigate = useNavigate();
	const { setUserInfo, startTest } = useTestStore();
	const [fullName, setFullName] = (0, import_react.useState)("");
	const [phone, setPhone] = (0, import_react.useState)("");
	const [age, setAge] = (0, import_react.useState)("");
	const [gender, setGender] = (0, import_react.useState)("");
	const [errors, setErrors] = (0, import_react.useState)({});
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	function validate() {
		const e = {};
		if (!fullName.trim()) e.fullName = "نام الزامی است";
		if (!phone.trim() || !/^[0-9۰-۹]{10,11}$/.test(phone.replace(/\s/g, ""))) e.phone = "شماره تماس معتبر وارد کنید";
		const ageNum = parseInt(age);
		if (!age || isNaN(ageNum) || ageNum < 10 || ageNum > 99) e.age = "سن معتبر وارد کنید";
		if (!gender) e.gender = "جنسیت را انتخاب کنید";
		return e;
	}
	function handleSubmit(e) {
		e.preventDefault();
		const errs = validate();
		if (Object.keys(errs).length) {
			setErrors(errs);
			return;
		}
		setSubmitting(true);
		setUserInfo({
			fullName: fullName.trim(),
			phone: phone.trim(),
			age: parseInt(age),
			gender
		});
		startTest();
		navigate({
			to: "/test/$step",
			params: { step: "1" }
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TestPageShell, {
		className: "flex flex-col items-center justify-center px-4 py-16",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-sm flex flex-col gap-8 relative z-10",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
					initial: {
						opacity: 0,
						x: 20
					},
					animate: {
						opacity: 1,
						x: 0
					},
					transition: { duration: .4 },
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/",
						className: "flex items-center gap-2 text-sm transition-opacity hover:opacity-70 w-fit text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
							width: "16",
							height: "16",
							viewBox: "0 0 24 24",
							fill: "none",
							stroke: "currentColor",
							strokeWidth: "2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M5 12h14M12 5l7 7-7 7" })
						}), "بازگشت"]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
					initial: {
						opacity: 0,
						y: 24
					},
					animate: {
						opacity: 1,
						y: 0
					},
					transition: {
						duration: .6,
						delay: .1
					},
					className: "flex flex-col gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-semibold uppercase tracking-widest text-accent",
							children: "قبل از شروع"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-2xl font-bold text-balance text-foreground",
							children: "اطلاعات خودت رو وارد کن"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm leading-relaxed text-muted-foreground",
							children: "این اطلاعات فقط برای شخصی‌سازی تجربه‌ی تو استفاده میشه."
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.form, {
					onSubmit: handleSubmit,
					initial: {
						opacity: 0,
						y: 24
					},
					animate: {
						opacity: 1,
						y: 0
					},
					transition: {
						duration: .6,
						delay: .2
					},
					className: "flex flex-col gap-5",
					noValidate: true,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "اسم و فامیل",
							error: errors.fullName,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: fullName,
								onChange: (e) => {
									setFullName(e.target.value);
									setErrors((p) => ({
										...p,
										fullName: void 0
									}));
								},
								placeholder: "مثلاً: علی رضایی",
								className: "w-full px-4 py-3.5 rounded-xl text-sm outline-none transition-all text-foreground",
								style: {
									background: "rgba(255,255,255,0.05)",
									border: errors.fullName ? "1.5px solid rgba(239,68,68,0.6)" : "1.5px solid rgba(255,255,255,0.1)"
								}
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "شماره تماس",
							error: errors.phone,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "tel",
								value: phone,
								dir: "ltr",
								onChange: (e) => {
									setPhone(e.target.value);
									setErrors((p) => ({
										...p,
										phone: void 0
									}));
								},
								placeholder: "09xxxxxxxxx",
								className: "w-full px-4 py-3.5 rounded-xl text-sm outline-none transition-all text-left text-foreground",
								style: {
									background: "rgba(255,255,255,0.05)",
									border: errors.phone ? "1.5px solid rgba(239,68,68,0.6)" : "1.5px solid rgba(255,255,255,0.1)"
								}
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "سن",
							error: errors.age,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "number",
								value: age,
								min: 10,
								max: 99,
								dir: "ltr",
								onChange: (e) => {
									setAge(e.target.value);
									setErrors((p) => ({
										...p,
										age: void 0
									}));
								},
								placeholder: "مثلاً: ۲۵",
								className: "w-full px-4 py-3.5 rounded-xl text-sm outline-none transition-all text-left text-foreground",
								style: {
									background: "rgba(255,255,255,0.05)",
									border: errors.age ? "1.5px solid rgba(239,68,68,0.6)" : "1.5px solid rgba(255,255,255,0.1)"
								}
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-xs font-semibold text-muted-foreground",
									children: "جنسیت"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex gap-2",
									children: GENDERS.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.button, {
										type: "button",
										onClick: () => {
											setGender(g.value);
											setErrors((p) => ({
												...p,
												gender: void 0
											}));
										},
										whileTap: { scale: .95 },
										className: `flex-1 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${gender === g.value ? "text-foreground" : "text-muted-foreground"}`,
										style: gender === g.value ? {
											background: "rgba(159,18,57,0.2)",
											border: "1.5px solid rgba(159,18,57,0.6)"
										} : {
											background: "rgba(255,255,255,0.04)",
											border: "1.5px solid rgba(255,255,255,0.08)"
										},
										children: g.label
									}, g.value))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: errors.gender && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.p, {
									initial: {
										opacity: 0,
										y: -4
									},
									animate: {
										opacity: 1,
										y: 0
									},
									exit: { opacity: 0 },
									className: "text-xs text-red-500",
									children: errors.gender
								}) })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.button, {
							type: "submit",
							disabled: submitting,
							whileHover: { scale: 1.02 },
							whileTap: { scale: .97 },
							className: "w-full py-4 rounded-2xl text-base font-bold mt-2 cursor-pointer disabled:opacity-60 text-foreground",
							style: {
								background: "linear-gradient(135deg, #9f1239 0%, #be123c 100%)",
								boxShadow: "0 8px 32px rgba(159,18,57,0.4)"
							},
							children: submitting ? "در حال ورود..." : "شروع تست"
						})
					]
				})
			]
		})
	});
}
function Field({ label, error, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
				className: "text-xs font-semibold text-muted-foreground",
				children: label
			}),
			children,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.p, {
				initial: {
					opacity: 0,
					y: -4
				},
				animate: {
					opacity: 1,
					y: 0
				},
				exit: { opacity: 0 },
				className: "text-xs text-red-500",
				children: error
			}) })
		]
	});
}
//#endregion
export { UserInfoPage as component };
