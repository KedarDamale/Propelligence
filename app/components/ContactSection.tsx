"use client";
import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { User, Phone, Mail, Building2, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const businessTypes = [
  "Proprietorship",
  "Partnership",
  "LLP",
  "Private Limited",
  "Other",
];
const servicesList = [
  "Accounting & Book keeping",
  "Business Valuation",
  "CFO Consulting",
  "Corporate tax planning and advisory",
  "GST appeal",
  "GST assessment",
  "GST audit",
  "Income Tax Appeal",
  "Income Tax Assessment",
  "Internal Audit / Process Audit",
  "International Taxation",
  "IPO Consulting",
  "Start Up Advisory",
  "Statutory Audit",
  "Transfer Pricing Audit/ Study",
  "Other",
];
const turnoverOptions = [
  "Below ₹50 lakh",
  "₹50 lakh – ₹2 crore",
  "₹2 crore – ₹10 crore",
  "₹10 crore – ₹25 crore",
  "₹25 crore – ₹50 crore",
  "₹50 crore – ₹100 crore",
  "Above ₹100 crore",
];
const contactModes = ["Call", "WhatsApp", "Email"];

type ContactFormData = {
  fullName: string;
  mobile: string;
  email: string;
  businessName: string;
  businessType: string;
  businessTypeOther: string;
  services: string[];
  servicesOther: string;
  turnover: string;
  contactModes: string[];
  requirement: string;
  bookConsultation: string;
};

const stepTitles = [
  'Contact Details',
  'Business Information',
  'Additional Details',
];

const stepDescriptions = [
  'Please provide your full name, mobile number, and email address.',
  'Tell us about your business and what services you are interested in.',
  'How should we contact you? Share your requirements and book a consultation if you wish.',
];

const ContactSection = () => {
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<ContactFormData>({
    fullName: "",
    mobile: "",
    email: "",
    businessName: "",
    businessType: "",
    businessTypeOther: "",
    services: [],
    servicesOther: "",
    turnover: "",
    contactModes: [],
    requirement: "",
    bookConsultation: "",
  });

  useEffect(() => {
    setMounted(true);
  }, []);
  const [status, setStatus] = useState<null | 'success' | 'error'>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox" && e.target instanceof HTMLInputElement) {
      const { checked } = e.target;
      setFormData((prev) => {
        const arr = prev[name as keyof ContactFormData] as string[];
        if (checked) return { ...prev, [name]: [...arr, value] };
        return { ...prev, [name]: arr.filter((v) => v !== value) };
      });
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateStep = () => {
    const newErrors: { [key: string]: string } = {};
    if (step === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required.';
      if (!formData.mobile.match(/^\d{10}$/)) newErrors.mobile = 'Enter a valid 10-digit mobile number.';
      if (!formData.email.match(/^\S+@\S+\.\S+$/)) newErrors.email = 'Enter a valid email address.';
    }
    if (step === 2) {
      if (!formData.businessName.trim()) newErrors.businessName = 'Business name is required.';
      if (!formData.businessType) newErrors.businessType = 'Select a business type.';
      if (formData.businessType === 'Other' && !formData.businessTypeOther.trim()) newErrors.businessTypeOther = 'Please specify your business type.';
      if (!formData.services.length) newErrors.services = 'Select at least one service.';
    }
    if (step === 3) {
      if (!formData.contactModes.length) newErrors.contactModes = 'Select at least one mode.';
      if (!formData.requirement.trim()) newErrors.requirement = 'Please describe your requirement.';
      if (!formData.bookConsultation) newErrors.bookConsultation = 'Please select an option.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateStep()) setStep((s) => s + 1);
  };
  const handleBack = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setStep((s) => s - 1);
  };
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateStep()) return;
    setStatus(null);
    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setStatus('success');
        setFormData({
          fullName: '',
          mobile: '',
          email: '',
          businessName: '',
          businessType: '',
          businessTypeOther: '',
          services: [],
          servicesOther: '',
          turnover: '',
          contactModes: [],
          requirement: '',
          bookConsultation: '',
        });
        setStep(1);
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <section id="contact" className="pt-0 pb-0 bg-white">
      <div className="container mx-auto px-2 sm:px-4 md:px-8 lg:px-16 xl:px-32">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#022d58] mb-2">
            Let&apos;s Get In Touch
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-black max-w-2xl mx-auto">
            Ready to transform your financial risk management? Let&apos;s discuss your needs.
          </p>
        </div>
        <div className="max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl mx-auto w-full">
          <div className="rounded-2xl sm:rounded-3xl bg-white/80 border-2 border-[#022d58]/10 shadow-2xl p-2 sm:p-4 md:p-8 w-full flex flex-col items-center backdrop-blur-md glow-blue">
            {/* Step Progress Bar */}
            <div className="w-full flex flex-col sm:flex-row items-center justify-between mb-6 sm:mb-8 gap-2 sm:gap-0 relative">
              {/* Dynamic progress bar */}
              <div className="hidden sm:block absolute top-1/2 left-0 w-full h-1 -translate-y-1/2 z-0">
                <div className="w-full h-full bg-gradient-to-r from-[#e0e7ef] to-[#e0e7ef] rounded-full" />
                <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#022d58] to-[#003c96] rounded-full transition-all duration-500" style={{ width: `${((step-1)/(stepTitles.length-1))*100}%` }} />
              </div>
              {stepTitles.map((title, idx) => (
                <div key={title} className="flex-1 flex flex-col items-center min-w-0 z-10">
                  <div className={`rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center font-bold text-base sm:text-lg border-2 transition-all duration-300 ${step === idx + 1 ? 'bg-[#022d58] text-white border-[#022d58]' : 'bg-white text-[#022d58] border-[#022d58]/40'}`}>{step > idx + 1 ? <CheckCircle className="w-5 h-5 text-green-500" /> : idx + 1}</div>
                  <span className={`mt-1 sm:mt-2 text-xs font-semibold ${step === idx + 1 ? 'text-[#022d58]' : 'text-gray-400'}`}>{title}</span>
                </div>
              ))}
            </div>
            {/* Step Description */}
            <div className="mb-4 sm:mb-6 text-center">
              <h3 className="text-lg sm:text-xl font-semibold text-[#022d58] mb-1">{stepTitles[step - 1]}</h3>
              <p className="text-gray-500 text-xs sm:text-sm">{stepDescriptions[step - 1]}</p>
            </div>
            {status === 'success' && (
              <div className="text-green-600 text-center font-semibold mb-4">Thank you! Your response has been submitted.</div>
            )}
            {status === 'error' && (
              <div className="text-red-600 text-center font-semibold mb-4">Something went wrong. Please try again.</div>
            )}
            <AnimatePresence mode="wait">
              <motion.form
                key={step}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.3 }}
                className="space-y-6 w-full"
                onSubmit={step === 3 ? handleSubmit : handleNext}
                aria-labelledby={`step-title-${step}`}
              >
                {/* Step 1 */}
                {step === 1 && (
                  <>
                    <div className="flex flex-col gap-4 sm:grid sm:grid-cols-2 sm:gap-6">
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#022d58]/60 w-5 h-5" />
                        <input
                          type="text"
                          name="fullName"
                          placeholder="Full Name"
                          value={formData.fullName}
                          onChange={handleChange}
                          required
                          aria-label="Full Name"
                          className={`w-full pl-12 px-6 py-4 border ${errors.fullName ? 'border-red-500' : 'border-black'} text-black rounded-xl focus:ring-2 focus:ring-[#022d58] focus:border-transparent outline-none transition-all bg-white`}
                        />
                        {errors.fullName && <span className="text-red-500 text-xs absolute left-0 -bottom-5">{errors.fullName}</span>}
                      </div>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-[#022d58]/60 w-5 h-5" />
                        <input
                          type="tel"
                          name="mobile"
                          placeholder="Mobile Number"
                          value={formData.mobile}
                          onChange={handleChange}
                          required
                          pattern="[0-9]{10}"
                          maxLength={10}
                          aria-label="Mobile Number"
                          className={`w-full pl-12 px-6 py-4 border ${errors.mobile ? 'border-red-500' : 'border-black'} text-black rounded-xl focus:ring-2 focus:ring-[#022d58] focus:border-transparent outline-none transition-all bg-white`}
                        />
                        {errors.mobile && <span className="text-red-500 text-xs absolute left-0 -bottom-5">{errors.mobile}</span>}
                      </div>
                    </div>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#022d58]/60 w-5 h-5" />
                      <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        aria-label="Email Address"
                        className={`w-full pl-12 px-6 py-4 border ${errors.email ? 'border-red-500' : 'border-black'} text-black rounded-xl focus:ring-2 focus:ring-[#022d58] focus:border-transparent outline-none transition-all bg-white`}
                      />
                      {errors.email && <span className="text-red-500 text-xs absolute left-0 -bottom-5">{errors.email}</span>}
                    </div>
                    <div className="flex justify-end w-full">
                      <button type="submit" className="bg-gradient-to-r from-[#022d58] to-[#003c96] text-white px-8 py-3 rounded-full font-semibold shadow-md hover:shadow-xl hover:bg-[#003c96] transition-all duration-300 w-full md:w-auto flex items-center gap-2 hero-title transform hover:scale-105" style={{fontFamily: 'var(--font-oswald), Oswald, sans-serif'}}>
                        <span style={{fontFamily: 'var(--font-oswald), Oswald, sans-serif'}}>Next</span> <ArrowRight className="w-5 h-5 ml-2" />
                      </button>
                    </div>
                  </>
                )}
                {/* Step 2 */}
                {step === 2 && (
                  <>
                    <div className="flex flex-col gap-4">
                      <div className="relative mb-2">
                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-[#022d58]/60 w-5 h-5" />
                        <input
                          type="text"
                          name="businessName"
                          placeholder="Business Name"
                          value={formData.businessName}
                          onChange={handleChange}
                          required
                          aria-label="Business Name"
                          className={`w-full pl-12 px-6 py-4 border ${errors.businessName ? 'border-red-500' : 'border-black'} text-black rounded-xl focus:ring-2 focus:ring-[#022d58] focus:border-transparent outline-none transition-all bg-white`}
                        />
                        {errors.businessName && <span className="text-red-500 text-xs absolute left-0 -bottom-5">{errors.businessName}</span>}
                      </div>
                      <div className="mb-4">
                        <label className="block font-semibold mb-1 hero-title">Business Type</label>
                        <div className="flex flex-wrap gap-3">
                          {businessTypes.map((type) => (
                            <label key={type} className={`cursor-pointer flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all duration-200 select-none hero-title
                              ${formData.businessType === type ? 'bg-gradient-to-r from-[#022d58] to-[#003c96] text-white border-[#022d58]' : 'bg-white border-[#022d58]/30 text-[#022d58] hover:bg-[#022d58]/10'}`}
                            >
                              <input
                                type="radio"
                                name="businessType"
                                value={type}
                                checked={formData.businessType === type}
                                onChange={handleChange}
                                required
                                className="accent-[#022d58] w-4 h-4"
                              />
                              <span className="hero-title">{type}</span>
                              {type === 'Other' && formData.businessType === 'Other' && (
                                <input
                                  type="text"
                                  name="businessTypeOther"
                                  placeholder="Please specify"
                                  value={formData.businessTypeOther}
                                  onChange={handleChange}
                                  className="ml-2 px-2 py-1 rounded border border-[#022d58]/40 focus:border-[#022d58] bg-white text-[#022d58] text-sm"
                                />
                              )}
                            </label>
                          ))}
                        </div>
                        {errors.businessType && <span className="text-red-500 text-xs">{errors.businessType}</span>}
                        {errors.businessTypeOther && <span className="text-red-500 text-xs">{errors.businessTypeOther}</span>}
                      </div>
                      <div className="mb-4">
                        <label className="block font-semibold mb-1 hero-title">What services are you interested in?</label>
                        <div className="flex flex-wrap gap-3">
                          {servicesList.map((service) => (
                            <label key={service} className={`cursor-pointer flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all duration-200 select-none hero-title
                              ${formData.services.includes(service) ? 'bg-gradient-to-r from-[#022d58] to-[#003c96] text-white border-[#022d58]' : 'bg-white border-[#022d58]/30 text-[#022d58] hover:bg-[#022d58]/10'}`}
                            >
                              <input
                                type="checkbox"
                                name="services"
                                value={service}
                                checked={formData.services.includes(service)}
                                onChange={handleChange}
                                className="accent-[#022d58] w-4 h-4"
                              />
                              <span className="hero-title">{service}</span>
                              {service === 'Other' && formData.services.includes('Other') && (
                                <input
                                  type="text"
                                  name="servicesOther"
                                  placeholder="Please specify"
                                  value={formData.servicesOther}
                                  onChange={handleChange}
                                  className="ml-2 px-2 py-1 rounded border border-[#022d58]/40 focus:border-[#022d58] bg-white text-[#022d58] text-sm"
                                />
                              )}
                            </label>
                          ))}
                        </div>
                        {errors.services && <span className="text-red-500 text-xs">{errors.services}</span>}
                      </div>
                      <div className="mb-4">
                        <label className="block font-semibold mb-1 hero-title">Annual Turnover (optional)</label>
                        <div className="flex flex-wrap gap-3">
                          {turnoverOptions.map((option) => (
                            <label key={option} className={`cursor-pointer flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all duration-200 select-none hero-title
                              ${formData.turnover === option ? 'bg-gradient-to-r from-[#022d58] to-[#003c96] text-white border-[#022d58]' : 'bg-white border-[#022d58]/30 text-[#022d58] hover:bg-[#022d58]/10'}`}
                            >
                              <input
                                type="radio"
                                name="turnover"
                                value={option}
                                checked={formData.turnover === option}
                                onChange={handleChange}
                                className="accent-[#022d58] w-4 h-4"
                              />
                              <span className="hero-title">{option}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between w-full">
                      <button onClick={handleBack} className="bg-gradient-to-r from-gray-200 to-gray-300 text-black px-8 py-3 rounded-full font-semibold shadow hover:bg-gray-400 transition-all duration-300 w-full md:w-auto flex items-center gap-2 hero-title transform hover:scale-105 hover:shadow-xl" style={{fontFamily: 'var(--font-oswald), Oswald, sans-serif'}}>
                        <ArrowLeft className="w-5 h-5 mr-2" /> <span style={{fontFamily: 'var(--font-oswald), Oswald, sans-serif'}}>Back</span>
                      </button>
                      <button type="submit" className="bg-gradient-to-r from-[#022d58] to-[#003c96] text-white px-8 py-3 rounded-full font-semibold shadow-md hover:shadow-xl hover:bg-[#003c96] transition-all duration-300 w-full md:w-auto flex items-center gap-2 hero-title transform hover:scale-105" style={{fontFamily: 'var(--font-oswald), Oswald, sans-serif'}}>
                        <span style={{fontFamily: 'var(--font-oswald), Oswald, sans-serif'}}>Next</span> <ArrowRight className="w-5 h-5 ml-2" />
                      </button>
                    </div>
                  </>
                )}
                {/* Step 3 */}
                {step === 3 && (
                  <>
                    <div className="flex flex-col gap-4">
                      <div className="mb-2">
                        <label className="block font-semibold mb-1 text-[#022d58] hero-title">Preferred Mode of Contact</label>
                        <div className="flex flex-wrap gap-4">
                          {contactModes.map((mode) => (
                            <label key={mode} className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-[#022d58]/30 text-[#022d58] hover:bg-[#022d58]/10 cursor-pointer transition-all hero-title">
                              <input
                                type="checkbox"
                                name="contactModes"
                                value={mode}
                                checked={formData.contactModes.includes(mode)}
                                onChange={handleChange}
                                className="accent-[#022d58] w-4 h-4"
                              />
                              <span className="hero-title">{mode}</span>
                            </label>
                          ))}
                        </div>
                        {errors.contactModes && <span className="text-red-500 text-xs">{errors.contactModes}</span>}
                      </div>
                      <div className="relative mb-2">
                        <textarea
                          name="requirement"
                          placeholder="Brief about your requirement"
                          rows={4}
                          value={formData.requirement}
                          onChange={handleChange}
                          required
                          aria-label="Brief about your requirement"
                          className={`w-full px-6 py-4 border ${errors.requirement ? 'border-red-500' : 'border-black'} text-black rounded-xl focus:ring-2 focus:ring-[#022d58] focus:border-transparent outline-none transition-all resize-none bg-white h-full min-h-[96px] md:min-h-[120px] lg:min-h-[140px]`}
                        ></textarea>
                        {errors.requirement && <span className="text-red-500 text-xs absolute left-0 -bottom-5">{errors.requirement}</span>}
                      </div>
                      <div className="mb-2">
                        <label className="block font-semibold mb-1 text-[#022d58] hero-title">Would you like to book a 1-on-1 consultation call?</label>
                        <div className="flex gap-4">
                          <label className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-[#022d58]/30 text-[#022d58] hover:bg-[#022d58]/10 cursor-pointer transition-all hero-title">
                            <input
                              type="radio"
                              name="bookConsultation"
                              value="Yes"
                              checked={formData.bookConsultation === "Yes"}
                              onChange={handleChange}
                              required
                              className="accent-[#022d58] w-4 h-4"
                            />
                            <span className="hero-title">Yes</span>
                          </label>
                          <label className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-[#022d58]/30 text-[#022d58] hover:bg-[#022d58]/10 cursor-pointer transition-all hero-title">
                            <input
                              type="radio"
                              name="bookConsultation"
                              value="No"
                              checked={formData.bookConsultation === "No"}
                              onChange={handleChange}
                              required
                              className="accent-[#022d58] w-4 h-4"
                            />
                            <span className="hero-title">No</span>
                          </label>
                        </div>
                        {errors.bookConsultation && <span className="text-red-500 text-xs">{errors.bookConsultation}</span>}
                      </div>
                    </div>
                    <div className="flex justify-between w-full">
                      <button onClick={handleBack} className="bg-gradient-to-r from-gray-200 to-gray-300 text-black px-8 py-3 rounded-full font-semibold shadow hover:bg-gray-400 transition-all duration-300 w-full md:w-auto flex items-center gap-2 hero-title transform hover:scale-105 hover:shadow-xl" style={{fontFamily: 'var(--font-oswald), Oswald, sans-serif'}}>
                        <ArrowLeft className="w-5 h-5 mr-2" /> <span style={{fontFamily: 'var(--font-oswald), Oswald, sans-serif'}}>Back</span>
                      </button>
                      <button type="submit" disabled={loading} className="bg-gradient-to-r from-[#022d58] to-[#003c96] text-white px-8 py-3 rounded-full font-semibold shadow-md hover:shadow-xl hover:bg-[#003c96] transition-all duration-300 w-full md:w-auto flex items-center gap-2 disabled:opacity-60 hero-title transform hover:scale-105" style={{fontFamily: 'var(--font-oswald), Oswald, sans-serif'}}>
                        {loading ? (
                          <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
                        ) : (
                          <><span style={{fontFamily: 'var(--font-oswald), Oswald, sans-serif'}}>Submit</span> <ArrowRight className="w-5 h-5 ml-2" /></>
                        )}
                      </button>
                    </div>
                  </>
                )}
              </motion.form>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
