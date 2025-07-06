"use client";
import React, { useState } from "react";

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    company: "",
    message: "",
  });
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { name, email, mobile, company, message } = formData;
    const subject = encodeURIComponent("Contact Form Submission");
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nMobile: ${mobile}\nCompany: ${company}\n\nMessage:\n${message}`
    );
    const mailtoUrl = `mailto:info@propelligence.com?subject=${subject}&body=${body}`;
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=info@propelligence.com&su=${subject}&body=${body}`;
    if (
      /Mobi|Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(
        navigator.userAgent
      )
    ) {
      // On mobile, use mailto (will prompt user to pick email app)
      window.location.href = mailtoUrl;
    } else {
      // On desktop, open Gmail compose in new tab
      window.open(gmailUrl, "_blank");
    }
  };
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  return (
    <section id="contact" className="pt-0 pb-0 bg-white">
      <div className="container mx-auto px-4 md:px-8 lg:px-16 xl:px-32">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-[#022d58] mb-2">
            Let&apos;s Get In Touch
          </h2>
          <p className="text-xl text-black max-w-2xl mx-auto">
            Ready to transform your financial risk management? Let&apos;s
            discuss your needs.
          </p>
        </div>
        <div className="max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl mx-auto w-full">
          <div className="rounded-3xl bg-white border-2 border-black shadow-xl p-4 md:p-6 lg:p-8 w-full flex flex-col items-center">
            <form onSubmit={handleSubmit} className="space-y-6 w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-6 py-4 border border-black text-black rounded-xl focus:ring-2 focus:ring-[#022d58] focus:border-transparent outline-none transition-all bg-white"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    suppressHydrationWarning
                    className="w-full px-6 py-4 border border-black text-black rounded-xl focus:ring-2 focus:ring-[#022d58] focus:border-transparent outline-none transition-all bg-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <input
                    type="tel"
                    name="mobile"
                    placeholder="Mobile Number"
                    value={formData.mobile}
                    onChange={handleChange}
                    required
                    pattern="[0-9]{10}"
                    maxLength={10}
                    className="w-full px-6 py-4 border border-black text-black rounded-xl focus:ring-2 focus:ring-[#022d58] focus:border-transparent outline-none transition-all bg-white"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    name="company"
                    placeholder="Company Name"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-6 py-4 border border-black text-black rounded-xl focus:ring-2 focus:ring-[#022d58] focus:border-transparent outline-none transition-all bg-white"
                  />
                </div>
              </div>
              <div>
                <textarea
                  name="message"
                  placeholder="Your Message"
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full px-6 py-4 border border-black text-black rounded-xl focus:ring-2 focus:ring-[#022d58] focus:border-transparent outline-none transition-all resize-none bg-white h-full min-h-[96px] md:min-h-[120px] lg:min-h-[140px]"
                ></textarea>
              </div>
              <div className="flex justify-end w-full">
                <button
                  type="submit"
                  className="bg-[#022d58] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#003c96] transition-colors duration-300 w-full md:w-auto"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
