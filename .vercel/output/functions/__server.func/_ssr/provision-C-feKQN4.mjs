import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { E as LoaderCircle, K as Check, U as ChevronRight } from "../_libs/lucide-react.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/provision-C-feKQN4.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
/**
* NAMA Platform — Public Provisioning Page.
* Multi-step form for creating a new workspace/site from a blueprint.
*/
var _jsxFileName = "C:/Users/Admin/Desktop/final/myproject/src/routes/provision.tsx?tsr-split=component";
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
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 py-12 px-4",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "max-w-2xl mx-auto",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "text-center mb-8",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
						className: "text-3xl font-bold text-gray-900 mb-2",
						children: "Create Your Website"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 120,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "text-gray-600",
						children: "Set up your new workspace in minutes"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 121,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 119,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex items-center justify-center mb-8",
					children: [
						1,
						2,
						3
					].map((s) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex items-center",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: `w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${step >= s ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-500"}`,
							children: step > s ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Check, { className: "w-5 h-5" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 128,
								columnNumber: 29
							}, this) : s
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 127,
							columnNumber: 15
						}, this), s < 3 && /* @__PURE__ */ (void 0)("div", { className: `w-16 md:w-24 h-1 mx-1 ${step > s ? "bg-orange-500" : "bg-gray-200"}` }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 130,
							columnNumber: 25
						}, this)]
					}, s, true, {
						fileName: _jsxFileName,
						lineNumber: 126,
						columnNumber: 31
					}, this))
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 125,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("form", {
					onSubmit: handleSubmit,
					className: "bg-white rounded-xl shadow-lg p-8 space-y-6",
					children: [
						step === 1 && /* @__PURE__ */ (void 0)(import_jsx_dev_runtime.Fragment, { children: [
							/* @__PURE__ */ (void 0)("h2", {
								className: "text-xl font-semibold text-gray-900 mb-4",
								children: "Site Details"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 138,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (void 0)("div", {
								className: "space-y-4",
								children: [
									/* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("label", {
										htmlFor: "displayName",
										className: "block text-sm font-medium text-gray-700 mb-1",
										children: "Site Name"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 141,
										columnNumber: 19
									}, this), /* @__PURE__ */ (void 0)("input", {
										id: "displayName",
										type: "text",
										value: formData.displayName,
										onChange: (e) => updateField("displayName", e.target.value),
										className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none",
										placeholder: "My Awesome Cafe",
										required: true
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 144,
										columnNumber: 19
									}, this)] }, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 140,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("label", {
										className: "block text-sm font-medium text-gray-700 mb-1",
										children: "URL Slug"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 148,
										columnNumber: 19
									}, this), /* @__PURE__ */ (void 0)("div", {
										className: "flex items-center space-x-2",
										children: [/* @__PURE__ */ (void 0)("input", {
											type: "text",
											value: formData.slug,
											onChange: (e) => updateField("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "")),
											className: "flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none",
											placeholder: "mycafe",
											required: true
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 150,
											columnNumber: 21
										}, this), /* @__PURE__ */ (void 0)("span", {
											className: "text-sm text-gray-500 whitespace-nowrap",
											children: ".namaplatform.com"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 151,
											columnNumber: 21
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 149,
										columnNumber: 19
									}, this)] }, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 147,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (void 0)("div", { children: [
										/* @__PURE__ */ (void 0)("label", {
											className: "block text-sm font-medium text-gray-700 mb-1",
											children: "Website Template"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 156,
											columnNumber: 19
										}, this),
										/* @__PURE__ */ (void 0)("select", {
											value: formData.blueprintSlug,
											onChange: (e) => updateField("blueprintSlug", e.target.value),
											className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none",
											children: BLUEPRINTS.map((b) => /* @__PURE__ */ (void 0)("option", {
												value: b.value,
												children: b.label
											}, b.value, false, {
												fileName: _jsxFileName,
												lineNumber: 158,
												columnNumber: 42
											}, this))
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 157,
											columnNumber: 19
										}, this),
										/* @__PURE__ */ (void 0)("p", {
											className: "text-sm text-gray-500 mt-1",
											children: BLUEPRINTS.find((b) => b.value === formData.blueprintSlug)?.description
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 160,
											columnNumber: 19
										}, this)
									] }, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 155,
										columnNumber: 17
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 139,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (void 0)("button", {
								type: "button",
								onClick: () => setStep(2),
								className: "w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors flex items-center justify-center gap-2",
								children: ["Continue ", /* @__PURE__ */ (void 0)(ChevronRight, { className: "w-4 h-4" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 167,
									columnNumber: 26
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 166,
								columnNumber: 15
							}, this)
						] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 137,
							columnNumber: 26
						}, this),
						step === 2 && /* @__PURE__ */ (void 0)(import_jsx_dev_runtime.Fragment, { children: [
							/* @__PURE__ */ (void 0)("h2", {
								className: "text-xl font-semibold text-gray-900 mb-4",
								children: "Customization"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 173,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (void 0)("div", {
								className: "space-y-4",
								children: [
									/* @__PURE__ */ (void 0)("div", { children: [
										/* @__PURE__ */ (void 0)("label", {
											className: "block text-sm font-medium text-gray-700 mb-1",
											children: "Theme Style"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 176,
											columnNumber: 19
										}, this),
										/* @__PURE__ */ (void 0)("select", {
											value: formData.themeName,
											onChange: (e) => updateField("themeName", e.target.value),
											className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none",
											children: THEMES.map((t) => /* @__PURE__ */ (void 0)("option", {
												value: t.value,
												children: t.label
											}, t.value, false, {
												fileName: _jsxFileName,
												lineNumber: 178,
												columnNumber: 38
											}, this))
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 177,
											columnNumber: 19
										}, this),
										/* @__PURE__ */ (void 0)("p", {
											className: "text-sm text-gray-500 mt-1",
											children: THEMES.find((t) => t.value === formData.themeName)?.description
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 180,
											columnNumber: 19
										}, this)
									] }, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 175,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("label", {
										className: "block text-sm font-medium text-gray-700 mb-1",
										children: "Language"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 186,
										columnNumber: 19
									}, this), /* @__PURE__ */ (void 0)("select", {
										defaultValue: "fa",
										className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none",
										children: [
											/* @__PURE__ */ (void 0)("option", {
												value: "fa",
												children: "فارسی"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 188,
												columnNumber: 21
											}, this),
											/* @__PURE__ */ (void 0)("option", {
												value: "en",
												children: "English"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 189,
												columnNumber: 21
											}, this),
											/* @__PURE__ */ (void 0)("option", {
												value: "ar",
												children: "العربية"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 190,
												columnNumber: 21
											}, this),
											/* @__PURE__ */ (void 0)("option", {
												value: "tr",
												children: "Türkçe"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 191,
												columnNumber: 21
											}, this)
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 187,
										columnNumber: 19
									}, this)] }, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 185,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("label", {
										className: "block text-sm font-medium text-gray-700 mb-1",
										children: "Currency"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 196,
										columnNumber: 19
									}, this), /* @__PURE__ */ (void 0)("select", {
										defaultValue: "IRR",
										className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none",
										children: [
											/* @__PURE__ */ (void 0)("option", {
												value: "IRR",
												children: "IRR (﷼)"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 198,
												columnNumber: 21
											}, this),
											/* @__PURE__ */ (void 0)("option", {
												value: "USD",
												children: "USD ($)"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 199,
												columnNumber: 21
											}, this),
											/* @__PURE__ */ (void 0)("option", {
												value: "EUR",
												children: "EUR (€)"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 200,
												columnNumber: 21
											}, this),
											/* @__PURE__ */ (void 0)("option", {
												value: "TRY",
												children: "TRY (₺)"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 201,
												columnNumber: 21
											}, this)
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 197,
										columnNumber: 19
									}, this)] }, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 195,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("label", {
										className: "block text-sm font-medium text-gray-700 mb-1",
										children: "Phone Number"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 206,
										columnNumber: 19
									}, this), /* @__PURE__ */ (void 0)("input", {
										type: "tel",
										value: formData.phone,
										onChange: (e) => updateField("phone", e.target.value),
										className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none",
										placeholder: "+98 912 345 6789"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 207,
										columnNumber: 19
									}, this)] }, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 205,
										columnNumber: 17
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 174,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (void 0)("div", {
								className: "flex space-x-4 space-x-reverse",
								children: [/* @__PURE__ */ (void 0)("button", {
									type: "button",
									onClick: () => setStep(1),
									className: "flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors",
									children: "Back"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 212,
									columnNumber: 17
								}, this), /* @__PURE__ */ (void 0)("button", {
									type: "button",
									onClick: () => setStep(3),
									className: "flex-1 bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors",
									children: "Continue"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 215,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 211,
								columnNumber: 15
							}, this)
						] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 172,
							columnNumber: 26
						}, this),
						step === 3 && /* @__PURE__ */ (void 0)(import_jsx_dev_runtime.Fragment, { children: [
							/* @__PURE__ */ (void 0)("h2", {
								className: "text-xl font-semibold text-gray-900 mb-4",
								children: "Account Setup"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 223,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (void 0)("div", {
								className: "space-y-4",
								children: [/* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("label", {
									htmlFor: "email",
									className: "block text-sm font-medium text-gray-700 mb-1",
									children: "Email Address"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 226,
									columnNumber: 19
								}, this), /* @__PURE__ */ (void 0)("input", {
									id: "email",
									type: "email",
									value: formData.email,
									onChange: (e) => updateField("email", e.target.value),
									className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none",
									placeholder: "you@example.com"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 229,
									columnNumber: 19
								}, this)] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 225,
									columnNumber: 17
								}, this), /* @__PURE__ */ (void 0)("label", {
									className: "flex items-center gap-2 cursor-pointer",
									children: [/* @__PURE__ */ (void 0)("input", {
										type: "checkbox",
										checked: formData.acceptTerms,
										onChange: (e) => updateField("acceptTerms", e.target.checked),
										className: "rounded border-gray-300 text-orange-500 focus:ring-orange-500"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 233,
										columnNumber: 19
									}, this), /* @__PURE__ */ (void 0)("span", {
										className: "text-sm text-gray-700",
										children: "I agree to the Terms of Service and Privacy Policy"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 234,
										columnNumber: 19
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 232,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 224,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (void 0)("div", {
								className: "flex space-x-4 space-x-reverse",
								children: [/* @__PURE__ */ (void 0)("button", {
									type: "button",
									onClick: () => setStep(2),
									className: "flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors",
									children: "Back"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 241,
									columnNumber: 17
								}, this), /* @__PURE__ */ (void 0)("button", {
									type: "submit",
									disabled: submitting || !formData.acceptTerms,
									className: "flex-1 bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2",
									children: submitting ? /* @__PURE__ */ (void 0)(import_jsx_dev_runtime.Fragment, { children: [/* @__PURE__ */ (void 0)(LoaderCircle, { className: "w-4 h-4 animate-spin" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 246,
										columnNumber: 23
									}, this), " Creating..."] }, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 245,
										columnNumber: 33
									}, this) : "Create Website"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 244,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 240,
								columnNumber: 15
							}, this)
						] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 222,
							columnNumber: 26
						}, this),
						result && /* @__PURE__ */ (void 0)("div", {
							className: `mt-6 p-4 rounded-lg border ${result.success ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`,
							children: [
								/* @__PURE__ */ (void 0)("p", {
									className: `font-semibold ${result.success ? "text-green-800" : "text-red-800"}`,
									children: result.success ? "✓ Website created successfully!" : "× Error"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 254,
									columnNumber: 15
								}, this),
								!result.success && result.error && /* @__PURE__ */ (void 0)("p", {
									className: "text-sm mt-1 text-red-700",
									children: result.error
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 257,
									columnNumber: 51
								}, this),
								result.success && /* @__PURE__ */ (void 0)("p", {
									className: "text-sm text-green-700 mt-1",
									children: "Redirecting to your new site in 3 seconds..."
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 258,
									columnNumber: 34
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 253,
							columnNumber: 22
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 135,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "mt-6 text-center text-sm text-gray-500",
					children: "Powered by NAMA Platform — Blueprints are DATA, not components"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 265,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 117,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 116,
		columnNumber: 10
	}, this);
}
//#endregion
export { ProvisionPage as component };
