import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { E as LoaderCircle, K as Check, U as ChevronRight } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/provision-B92CCB-A.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* NAMA Platform — Public Provisioning Page.
* Multi-step form for creating a new workspace/site from a blueprint.
*/
var BLUEPRINTS = [
	{
		value: "cafe-restaurant",
		label: "Café & Restaurant",
		description: "Perfect for cafes, restaurants, and food services"
	},
	{
		value: "portfolio",
		label: "Portfolio",
		description: "Showcase your work with a beautiful portfolio"
	},
	{
		value: "business",
		label: "Business",
		description: "Professional business landing page"
	},
	{
		value: "ecommerce",
		label: "E-Commerce",
		description: "Online store with product listings"
	}
];
var THEMES = [
	{
		value: "modern",
		label: "Modern",
		description: "Clean, minimal design with bold typography"
	},
	{
		value: "classic",
		label: "Classic",
		description: "Traditional elegant layout"
	},
	{
		value: "minimal",
		label: "Minimal",
		description: "Ultra-clean with maximum white space"
	},
	{
		value: "bold",
		label: "Bold",
		description: "Eye-catching vibrant design"
	}
];
function ProvisionPage() {
	const [formData, setFormData] = (0, import_react.useState)({
		slug: "",
		displayName: "",
		blueprintSlug: "cafe-restaurant",
		themeName: "modern",
		email: "",
		phone: "",
		acceptTerms: false
	});
	const [step, setStep] = (0, import_react.useState)(1);
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	const [result, setResult] = (0, import_react.useState)(null);
	const updateField = (0, import_react.useCallback)((key, value) => {
		setFormData((prev) => ({
			...prev,
			[key]: value
		}));
	}, []);
	const handleSubmit = (0, import_react.useCallback)(async (e) => {
		e.preventDefault();
		setSubmitting(true);
		try {
			const data = await (await fetch("/api/provision", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					blueprintSlug: formData.blueprintSlug,
					workspaceName: formData.displayName || "My Site",
					slug: formData.slug,
					theme: formData.themeName,
					email: formData.email,
					phone: formData.phone
				})
			})).json();
			if (data.success) {
				setResult({
					success: true,
					workspaceId: data.workspaceId
				});
				setTimeout(() => {
					window.location.href = `/${formData.slug || data.workspaceId}`;
				}, 3e3);
			} else setResult({
				success: false,
				error: data.error || "Failed to create workspace"
			});
		} catch (err) {
			setResult({
				success: false,
				error: "Network error. Please try again."
			});
		} finally {
			setSubmitting(false);
		}
	}, [formData]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 py-12 px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-2xl mx-auto",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-center mb-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-3xl font-bold text-gray-900 mb-2",
						children: "Create Your Website"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-gray-600",
						children: "Set up your new workspace in minutes"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center justify-center mb-8",
					children: [
						1,
						2,
						3
					].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${step >= s ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-500"}`,
							children: step > s ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-5 h-5" }) : s
						}), s < 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `w-16 md:w-24 h-1 mx-1 ${step > s ? "bg-orange-500" : "bg-gray-200"}` })]
					}, s))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleSubmit,
					className: "bg-white rounded-xl shadow-lg p-8 space-y-6",
					children: [
						step === 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-xl font-semibold text-gray-900 mb-4",
								children: "Site Details"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										htmlFor: "displayName",
										className: "block text-sm font-medium text-gray-700 mb-1",
										children: "Site Name"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										id: "displayName",
										type: "text",
										value: formData.displayName,
										onChange: (e) => updateField("displayName", e.target.value),
										className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none",
										placeholder: "My Awesome Cafe",
										required: true
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-sm font-medium text-gray-700 mb-1",
										children: "URL Slug"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center space-x-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											value: formData.slug,
											onChange: (e) => updateField("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "")),
											className: "flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none",
											placeholder: "mycafe",
											required: true
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-sm text-gray-500 whitespace-nowrap",
											children: ".namaplatform.com"
										})]
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "block text-sm font-medium text-gray-700 mb-1",
											children: "Website Template"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
											value: formData.blueprintSlug,
											onChange: (e) => updateField("blueprintSlug", e.target.value),
											className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none",
											children: BLUEPRINTS.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: b.value,
												children: b.label
											}, b.value))
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm text-gray-500 mt-1",
											children: BLUEPRINTS.find((b) => b.value === formData.blueprintSlug)?.description
										})
									] })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setStep(2),
								className: "w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors flex items-center justify-center gap-2",
								children: ["Continue ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "w-4 h-4" })]
							})
						] }),
						step === 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-xl font-semibold text-gray-900 mb-4",
								children: "Customization"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "block text-sm font-medium text-gray-700 mb-1",
											children: "Theme Style"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
											value: formData.themeName,
											onChange: (e) => updateField("themeName", e.target.value),
											className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none",
											children: THEMES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: t.value,
												children: t.label
											}, t.value))
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm text-gray-500 mt-1",
											children: THEMES.find((t) => t.value === formData.themeName)?.description
										})
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-sm font-medium text-gray-700 mb-1",
										children: "Language"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										defaultValue: "fa",
										className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "fa",
												children: "فارسی"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "en",
												children: "English"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "ar",
												children: "العربية"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "tr",
												children: "Türkçe"
											})
										]
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-sm font-medium text-gray-700 mb-1",
										children: "Currency"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										defaultValue: "IRR",
										className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "IRR",
												children: "IRR (﷼)"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "USD",
												children: "USD ($)"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "EUR",
												children: "EUR (€)"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "TRY",
												children: "TRY (₺)"
											})
										]
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-sm font-medium text-gray-700 mb-1",
										children: "Phone Number"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "tel",
										value: formData.phone,
										onChange: (e) => updateField("phone", e.target.value),
										className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none",
										placeholder: "+98 912 345 6789"
									})] })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex space-x-4 space-x-reverse",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setStep(1),
									className: "flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors",
									children: "Back"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setStep(3),
									className: "flex-1 bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors",
									children: "Continue"
								})]
							})
						] }),
						step === 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-xl font-semibold text-gray-900 mb-4",
								children: "Account Setup"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									htmlFor: "email",
									className: "block text-sm font-medium text-gray-700 mb-1",
									children: "Email Address"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									id: "email",
									type: "email",
									value: formData.email,
									onChange: (e) => updateField("email", e.target.value),
									className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none",
									placeholder: "you@example.com"
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "flex items-center gap-2 cursor-pointer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										checked: formData.acceptTerms,
										onChange: (e) => updateField("acceptTerms", e.target.checked),
										className: "rounded border-gray-300 text-orange-500 focus:ring-orange-500"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-sm text-gray-700",
										children: "I agree to the Terms of Service and Privacy Policy"
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex space-x-4 space-x-reverse",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setStep(2),
									className: "flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors",
									children: "Back"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "submit",
									disabled: submitting || !formData.acceptTerms,
									className: "flex-1 bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2",
									children: submitting ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-4 h-4 animate-spin" }), " Creating..."] }) : "Create Website"
								})]
							})
						] }),
						result && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `mt-6 p-4 rounded-lg border ${result.success ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: `font-semibold ${result.success ? "text-green-800" : "text-red-800"}`,
									children: result.success ? "✓ Website created successfully!" : "× Error"
								}),
								!result.success && result.error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm mt-1 text-red-700",
									children: result.error
								}),
								result.success && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-green-700 mt-1",
									children: "Redirecting to your new site in 3 seconds..."
								})
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 text-center text-sm text-gray-500",
					children: "Powered by NAMA Platform — Blueprints are DATA, not components"
				})
			]
		})
	});
}
//#endregion
export { ProvisionPage as component };
