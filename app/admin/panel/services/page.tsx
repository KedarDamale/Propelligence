"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { Plus, Edit, Trash2, FileText, X, CheckCircle, AlertCircle } from "lucide-react";

interface Service {
  _id?: string;
  title: string;
  short_desc: string;
  long_desc: string;
  pdfUrl?: string;
}

interface Notification {
  id: string;
  type: 'success' | 'error';
  message: string;
}

export default function ServicesAdminPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Omit<Service, "_id" | "pdfUrl">>({
    title: "",
    short_desc: "",
    long_desc: "",
  });
  const [pdf, setPdf] = useState<File | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addNotification = useCallback((type: 'success' | 'error', message: string) => {
    const id = Date.now().toString();
    const newNotification = { id, type, message };
    setNotifications(prev => [...prev, newNotification]);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4000);
  }, []);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/services");
      const data = await res.json();
      setServices(data);
    } catch {
      addNotification('error', 'Failed to load services');
    } finally {
      setLoading(false);
    }
  }, [addNotification]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPdf(e.target.files?.[0] || null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.title || !form.short_desc || !form.long_desc) {
      setError("All fields are required.");
      return;
    }
    
    try {
      if (editId) {
        // Update (no PDF update for simplicity)
        const updateResponse = await fetch(`/api/services/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        
        if (!updateResponse.ok) {
          throw new Error('Update failed');
        }
        
        addNotification('success', 'Service updated successfully!');
      } else {
        // Create (with optional PDF)
        let response;
        if (pdf) {
          const fd = new FormData();
          fd.append("title", form.title);
          fd.append("short_desc", form.short_desc);
          fd.append("long_desc", form.long_desc);
          fd.append("pdf", pdf);
          
          response = await fetch("/api/services/upload", {
            method: "POST",
            body: fd,
          });
        } else {
          response = await fetch("/api/services", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
          });
        }
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || 'Creation failed');
        }
        
        addNotification('success', 'Service created successfully!');
      }
      
      setForm({ title: "", short_desc: "", long_desc: "" });
      setPdf(null);
      setEditId(null);
      setShowForm(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
      fetchServices();
    } catch (error) {
      console.error('Service operation error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      addNotification('error', editId ? 'Failed to update service' : `Failed to create service: ${errorMessage}`);
    }
  }

  function handleEdit(s: Service) {
    setForm({
      title: s.title,
      short_desc: s.short_desc,
      long_desc: s.long_desc,
    });
    setEditId(s._id!);
    setShowForm(true);
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this service?")) return;
    
    try {
      await fetch(`/api/services/${id}`, { method: "DELETE" });
      addNotification('success', 'Service deleted successfully!');
      fetchServices();
    } catch {
      addNotification('error', 'Failed to delete service');
    }
  }

  function resetForm() {
    setForm({ title: "", short_desc: "", long_desc: "" });
    setPdf(null);
    setEditId(null);
    setShowForm(false);
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <div className="space-y-8">
      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`flex items-center gap-3 p-4 rounded-xl shadow-lg border-2 transform transition-all duration-300 ${
              notification.type === 'success'
                ? 'bg-green-50 border-green-200 text-green-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle size={20} className="text-green-600" />
            ) : (
              <AlertCircle size={20} className="text-red-600" />
            )}
            <span className="font-medium">{notification.message}</span>
            <button
              onClick={() => setNotifications(prev => prev.filter(n => n.id !== notification.id))}
              className="ml-2 text-gray-500 hover:text-gray-700"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#022d58] mb-2">
            Manage Services
          </h1>
          <p className="text-gray-600">
            Create, edit, and manage your financial services
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-[#022d58] to-[#003c96] text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-2"
        >
          <Plus size={20} />
          Add New Service
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-gradient-to-br from-[#022d58]/5 to-[#003c96]/5 p-6 rounded-3xl border-2 border-[#022d58]/20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[#022d58]">
              {editId ? "Edit" : "Add New"} Service
            </h2>
            <button
              onClick={resetForm}
              className="text-gray-500 hover:text-[#022d58] transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-[#022d58] mb-2">
                  Service Title
                </label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Enter service title"
                  className="w-full p-4 border-2 border-[#022d58]/20 rounded-xl bg-white/50 backdrop-blur-sm focus:border-[#022d58] focus:outline-none transition-all duration-300 text-[#022d58] placeholder-gray-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-[#022d58] mb-2">
                  Short Description
                </label>
                <input
                  name="short_desc"
                  value={form.short_desc}
                  onChange={handleChange}
                  placeholder="Brief description"
                  className="w-full p-4 border-2 border-[#022d58]/20 rounded-xl bg-white/50 backdrop-blur-sm focus:border-[#022d58] focus:outline-none transition-all duration-300 text-[#022d58] placeholder-gray-500"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-[#022d58] mb-2">
                Long Description
              </label>
              <textarea
                name="long_desc"
                value={form.long_desc}
                onChange={handleChange}
                placeholder="Detailed service description"
                rows={4}
                className="w-full p-4 border-2 border-[#022d58]/20 rounded-xl bg-white/50 backdrop-blur-sm focus:border-[#022d58] focus:outline-none transition-all duration-300 text-[#022d58] placeholder-gray-500 resize-none"
                required
              />
            </div>
            
            {!editId && (
              <div>
                <label className="block text-sm font-semibold text-[#022d58] mb-2">
                  Service PDF (Optional)
                </label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  className="w-full p-4 border-2 border-[#022d58]/20 rounded-xl bg-white/50 backdrop-blur-sm focus:border-[#022d58] focus:outline-none transition-all duration-300 text-[#022d58] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#022d58] file:text-white hover:file:bg-[#003c96]"
                />
              </div>
            )}
            
            {error && (
              <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-600 text-center font-medium">
                {error}
              </div>
            )}
            
            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-gradient-to-r from-[#022d58] to-[#003c96] text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-2"
              >
                {editId ? "Update" : "Add"} Service
              </button>
              {editId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-8 py-3 border-2 border-[#022d58]/20 text-[#022d58] rounded-xl font-semibold hover:bg-[#022d58]/5 transition-all duration-300"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Services List */}
      <div>
        <h2 className="text-2xl font-bold text-[#022d58] mb-6">All Services</h2>
        
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#022d58] mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading services...</p>
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-12 bg-gradient-to-br from-[#022d58]/5 to-[#003c96]/5 rounded-3xl border-2 border-[#022d58]/20">
            <FileText size={48} className="text-[#022d58]/50 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-[#022d58] mb-2">No Services Found</h3>
            <p className="text-gray-600">Get started by adding your first service.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {services.map((service) => (
              <div
                key={service._id}
                className="bg-gradient-to-br from-[#022d58]/5 to-[#003c96]/5 p-6 rounded-3xl border-2 border-[#022d58]/20 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-bold text-[#022d58] flex-1 mr-4">
                    {service.title}
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(service)}
                      className="p-2 text-[#022d58] hover:bg-[#022d58]/10 rounded-lg transition-colors"
                      title="Edit service"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(service._id!)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete service"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-semibold text-[#022d58] mb-1">Short Description</h4>
                    <p className="text-gray-700 text-sm">{service.short_desc}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold text-[#022d58] mb-1">Long Description</h4>
                    <p className="text-gray-700 text-sm line-clamp-3">{service.long_desc}</p>
                  </div>
                  
                  {service.pdfUrl && (
                    <div>
                      <h4 className="text-sm font-semibold text-[#022d58] mb-1">PDF Document</h4>
                      <a
                        href={service.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-[#022d58] hover:text-[#003c96] transition-colors"
                      >
                        <FileText size={16} />
                        View PDF
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
