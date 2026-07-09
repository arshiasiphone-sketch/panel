/**
 * NAMA Platform — Public Provisioning Page.
 * Multi-step form for creating a new workspace/site from a blueprint.
 */

import { createFileRoute } from "@tanstack/react-router";
import { useState, useCallback } from "react";
import { CheckIcon, ChevronRightIcon, Loader2 } from "lucide-react";

interface FormState {
  slug: string;
  displayName: string;
  blueprintSlug: string;
  themeName: string;
  email: string;
  phone: string;
  acceptTerms: boolean;
}

export const Route = createFileRoute("/provision")({
  component: ProvisionPage,
});

const BLUEPRINTS = [
  { value: "cafe-restaurant", label: "Café & Restaurant", description: "Perfect for cafes, restaurants, and food services" },
  { value: "portfolio", label: "Portfolio", description: "Showcase your work with a beautiful portfolio" },
  { value: "business", label: "Business", description: "Professional business landing page" },
  { value: "ecommerce", label: "E-Commerce", description: "Online store with product listings" },
];

const THEMES = [
  { value: "modern", label: "Modern", description: "Clean, minimal design with bold typography" },
  { value: "classic", label: "Classic", description: "Traditional elegant layout" },
  { value: "minimal", label: "Minimal", description: "Ultra-clean with maximum white space" },
  { value: "bold", label: "Bold", description: "Eye-catching vibrant design" },
];

function ProvisionPage() {
  const [formData, setFormData] = useState<FormState>({
    slug: "",
    displayName: "",
    blueprintSlug: "cafe-restaurant",
    themeName: "modern",
    email: "",
    phone: "",
    acceptTerms: false,
  });

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; workspaceId?: string; error?: string } | null>(null);

  const updateField = useCallback(<K extends keyof FormState>(key: K, value: FormState[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch("/api/provision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          blueprintSlug: formData.blueprintSlug,
          workspaceName: formData.displayName || "My Site",
          slug: formData.slug,
          theme: formData.themeName,
          email: formData.email,
          phone: formData.phone,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setResult({ success: true, workspaceId: data.workspaceId });
        setTimeout(() => {
          window.location.href = `/${formData.slug || data.workspaceId}`;
        }, 3000);
      } else {
        setResult({ success: false, error: data.error || "Failed to create workspace" });
      }
    } catch (err) {
      setResult({ success: false, error: "Network error. Please try again." });
    } finally {
      setSubmitting(false);
    }
  }, [formData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your Website</h1>
          <p className="text-gray-600">Set up your new workspace in minutes</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                  step >= s ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-500"
                }`}
              >
                {step > s ? <CheckIcon className="w-5 h-5" /> : s}
              </div>
              {s < 3 && (
                <div className={`w-16 md:w-24 h-1 mx-1 ${step > s ? "bg-orange-500" : "bg-gray-200"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Form Card */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 space-y-6">
          {/* Step 1: Site Details */}
          {step === 1 && (
            <>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Site Details</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-1">
                    Site Name
                  </label>
                  <input
                    id="displayName"
                    type="text"
                    value={formData.displayName}
                    onChange={(e) => updateField("displayName", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                    placeholder="My Awesome Cafe"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">URL Slug</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => updateField("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                      placeholder="mycafe"
                      required
                    />
                    <span className="text-sm text-gray-500 whitespace-nowrap">.namaplatform.com</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Website Template</label>
                  <select
                    value={formData.blueprintSlug}
                    onChange={(e) => updateField("blueprintSlug", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  >
                    {BLUEPRINTS.map((b) => (
                      <option key={b.value} value={b.value}>{b.label}</option>
                    ))}
                  </select>
                  <p className="text-sm text-gray-500 mt-1">
                    {BLUEPRINTS.find((b) => b.value === formData.blueprintSlug)?.description}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
              >
                Continue <ChevronRightIcon className="w-4 h-4" />
              </button>
            </>
          )}

          {/* Step 2: Customization */}
          {step === 2 && (
            <>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Customization</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Theme Style</label>
                  <select
                    value={formData.themeName}
                    onChange={(e) => updateField("themeName", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  >
                    {THEMES.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                  <p className="text-sm text-gray-500 mt-1">
                    {THEMES.find((t) => t.value === formData.themeName)?.description}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                  <select defaultValue="fa" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none">
                    <option value="fa">فارسی</option>
                    <option value="en">English</option>
                    <option value="ar">العربية</option>
                    <option value="tr">Türkçe</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                  <select defaultValue="IRR" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none">
                    <option value="IRR">IRR (﷼)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="TRY">TRY (₺)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                    placeholder="+98 912 345 6789"
                  />
                </div>
              </div>

              <div className="flex space-x-4 space-x-reverse">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="flex-1 bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
                >
                  Continue
                </button>
              </div>
            </>
          )}

          {/* Step 3: Account */}
          {step === 3 && (
            <>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Setup</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                    placeholder="you@example.com"
                  />
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.acceptTerms}
                    onChange={(e) => updateField("acceptTerms", e.target.checked)}
                    className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                  />
                  <span className="text-sm text-gray-700">
                    I agree to the Terms of Service and Privacy Policy
                  </span>
                </label>
              </div>

              <div className="flex space-x-4 space-x-reverse">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={submitting || !formData.acceptTerms}
                  className="flex-1 bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Creating...
                    </>
                  ) : (
                    "Create Website"
                  )}
                </button>
              </div>
            </>
          )}

          {/* Results */}
          {result && (
            <div
              className={`mt-6 p-4 rounded-lg border ${
                result.success
                  ? "bg-green-50 border-green-200"
                  : "bg-red-50 border-red-200"
              }`}
            >
              <p
                className={`font-semibold ${
                  result.success ? "text-green-800" : "text-red-800"
                }`}
              >
                {result.success ? "✓ Website created successfully!" : "× Error"}
              </p>
              {!result.success && result.error && (
                <p className="text-sm mt-1 text-red-700">{result.error}</p>
              )}
              {result.success && (
                <p className="text-sm text-green-700 mt-1">
                  Redirecting to your new site in 3 seconds...
                </p>
              )}
            </div>
          )}
        </form>

        {/* Footer info */}
        <div className="mt-6 text-center text-sm text-gray-500">
          Powered by NAMA Platform — Blueprints are DATA, not components
        </div>
      </div>
    </div>
  );
}