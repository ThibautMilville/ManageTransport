"use client";

import Image from "next/image";
import { useState } from "react";
import { useAlerts } from "../../hooks/useAlert";
import { Hero } from "../../components/ui/hero";
import { useTranslation } from "../../hooks/useTranslation";
import { useLanguage } from "../../contexts/LanguageContext";

interface FormData {
  firstName: string;
  lastName: string;
  company: string;
  email: string;
  message: string;
}

export default function ContactPage() {
  const { lang } = useLanguage();
  const { t } = useTranslation(lang);

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    company: "",
    email: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { success, error } = useAlerts();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        success(t('contact.successMessage') as string);
        setFormData({
          firstName: "",
          lastName: "",
          company: "",
          email: "",
          message: "",
        });
      } else {
        throw new Error(result.message);
      }
    } catch {
      error(t('contact.errorMessage') as string);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div data-aos="fade-down">
        <Hero
          badge={t('contact.badge') as string}
          title={t('contact.title') as string}
          description={t('contact.description') as string}
          backgroundImage="/images/hero/nous-rencontrer.webp"
        />
      </div>

      {/* Section formulaire */}
      <div data-aos="fade-up" data-aos-once="true" data-aos-delay="100" data-aos-duration="600">
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center mb-12">
              <div className="inline-block px-4 py-2 bg-primary/10 text-primary font-semibold rounded-full text-sm mb-6">
                {t('contact.formTitle') as string}
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                {t('contact.formHeading') as string}
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {t('contact.formSubheading') as string}
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-10 border border-gray-100">
              <form
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
                onSubmit={handleSubmit}
              >
                <div className="md:col-span-1">
                  <label className="block font-semibold text-gray-700 mb-2 text-sm">
                    {t('contact.firstName') as string} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300"
                  />
                </div>

                <div className="md:col-span-1">
                  <label className="block font-semibold text-gray-700 mb-2 text-sm">
                    {t('contact.lastName') as string} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300"
                  />
                </div>

                <div className="md:col-span-1">
                  <label className="block font-semibold text-gray-700 mb-2 text-sm">
                    {t('contact.company') as string}
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300"
                  />
                </div>

                <div className="md:col-span-3">
                  <label className="block font-semibold text-gray-700 mb-2 text-sm">
                    {t('contact.email') as string} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300"
                  />
                </div>

                <div className="md:col-span-3">
                  <label className="block font-semibold text-gray-700 mb-2 text-sm">
                    {t('contact.message') as string} <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 resize-none"
                  />
                </div>

                <div className="md:col-span-3 text-center mt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group inline-flex items-center px-8 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        {t('contact.submitting') as string}
                      </>
                    ) : (
                      <>
                        <span>{t('contact.submit') as string}</span>
                        <svg
                          className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                          />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </div>

      {/* Section contact direct */}
      <div data-aos="fade-up" data-aos-once="true" data-aos-delay="200" data-aos-duration="600">
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center mb-12">
              <div className="inline-block px-4 py-2 bg-primary/10 text-primary font-semibold rounded-full text-sm mb-6">
                {t('contact.directContact') as string}
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                {t('contact.expertTitle') as string}
              </h2>
            </div>

            <div className="bg-gray-50 rounded-2xl shadow-xl border border-gray-100 flex flex-col lg:flex-row overflow-hidden">
              {/* Photo */}
              <div className="lg:w-2/5 bg-white flex items-center justify-center p-10">
                <Image
                  src="/photo_JC.jpg"
                  alt={t('contact.expertName') as string}
                  width={240}
                  height={240}
                  className="rounded-xl object-cover shadow-lg"
                />
              </div>

              {/* Informations */}
              <div className="lg:w-3/5 p-10 relative">
                <div className="absolute top-6 right-6">
                  <Image
                    src="/cropped-arbre-de-vie-192x192.png"
                    alt="Logo Manage Transport"
                    width={50}
                    height={50}
                  />
                </div>

                <div className="max-w-lg">
                  <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
                    {t('contact.expertName') as string}
                  </h3>
                  <div className="h-1 w-20 bg-primary rounded-full mb-4" />
                  <div className="text-primary font-semibold text-lg mb-8">
                    {t('contact.expertRole') as string}
                  </div>

                  <div className="space-y-3 text-gray-700 mb-8">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                        <svg
                          className="w-5 h-5 text-primary"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <span className="font-medium">
                        jeanclauderavineau@gmail.com
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                        <svg
                          className="w-5 h-5 text-primary"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                      </div>
                      <span className="font-medium">06 72 42 79 80</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                        <svg
                          className="w-5 h-5 text-primary"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"
                          />
                        </svg>
                      </div>
                      <span className="font-medium">managetransport.fr</span>
                    </div>
                  </div>

                  <a
                    href="tel:0672427980"
                    className="group inline-flex items-center px-8 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-all duration-300 hover:scale-105"
                  >
                    <div className="w-6 h-6 bg-white/20 rounded-md flex items-center justify-center mr-3">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                    </div>
                    <span>{t('contact.callToAction') as string}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
} 