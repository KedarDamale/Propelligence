"use client";
import { useEffect, useState, useCallback } from "react";
import { Plus, Edit, Trash2, Star, X, CheckCircle, AlertCircle, MessageSquare, Loader2 } from "lucide-react";
import { authenticatedFetch } from "../../../../lib/auth";

interface Testimonial {
  _id?: string;
  name: string;
  role: string;
  star: number;
  testimonial: string;
}

interface Notification {
  id: string;
  type: 'success' | 'error';
  message: string;
}

export default function TestimonialsAdminPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Omit<Testimonial, "_id">>({
    name: "",
    role: "",
    star: 5,
    testimonial: "",
  });
  const [editId, setEditId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  // Loading states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingTestimonial, setDeletingTestimonial] = useState<string | null>(null);

  const addNotification = useCallback((type: 'success' | 'error', message: string) => {
    const id = Date.now().toString();
    const newNotification = { id, type, message };
    setNotifications(prev => [...prev, newNotification]);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4000);
  }, []);

  const fetchTestimonials = useCallback(async () => {
    setLoading(true);
    try {
      const res = await authenticatedFetch("/api/testimonials");
      if (res.status === 401) {
        // Redirect to login if unauthorized
        window.location.href = '/admin/login';
        return;
      }
      const data = await res.json();
      setTestimonials(data);
    } catch (error) {
      console.error('Failed to load testimonials:', error);
      if (error instanceof Error && error.message === 'Authentication token not available') {
        window.location.href = '/admin/login';
        return;
      }
      addNotification('error', 'Failed to load testimonials');
    } finally {
      setLoading(false);
    }
  }, [addNotification]);

  // Fetch testimonials
  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  // Handle form input
  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: name === "star" ? Number(value) : value }));
  }

  // Create or update testimonial
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.name || !form.role || !form.testimonial) {
      setError("All fields are required.");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (editId) {
        // Update
        await authenticatedFetch(`/api/testimonials/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        addNotification('success', 'Testimonial updated successfully!');
      } else {
        // Create
        await authenticatedFetch("/api/testimonials", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        addNotification('success', 'Testimonial created successfully!');
      }
      setForm({ name: "", role: "", star: 5, testimonial: "" });
      setEditId(null);
      setShowForm(false);
      fetchTestimonials();
    } catch {
      addNotification('error', editId ? 'Failed to update testimonial' : 'Failed to create testimonial');
    } finally {
      setIsSubmitting(false);
    }
  }

  // Edit testimonial
  function handleEdit(t: Testimonial) {
    setForm({ name: t.name, role: t.role, star: t.star, testimonial: t.testimonial });
    setEditId(t._id!);
    setShowForm(true);
  }

  // Delete testimonial
  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;
    
    setDeletingTestimonial(id);
    
    try {
      await authenticatedFetch(`/api/testimonials/${id}`, { method: "DELETE" });
      addNotification('success', 'Testimonial deleted successfully!');
      fetchTestimonials();
    } catch {
      addNotification('error', 'Failed to delete testimonial');
    } finally {
      setDeletingTestimonial(null);
    }
  }

  function resetForm() {
    setForm({ name: "", role: "", star: 5, testimonial: "" });
    setEditId(null);
    setShowForm(false);
    setError("");
  }

  const renderStars = (count: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={`${i < count ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

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
            Manage Testimonials
          </h1>
          <p className="text-gray-600">
            Create, edit, and manage client testimonials and reviews
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          disabled={isSubmitting}
          className="bg-gradient-to-r from-[#022d58] to-[#003c96] text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          <Plus size={20} />
          Add New Testimonial
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-gradient-to-br from-[#022d58]/5 to-[#003c96]/5 p-6 rounded-3xl border-2 border-[#022d58]/20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[#022d58]">
              {editId ? "Edit" : "Add New"} Testimonial
            </h2>
            <button
              onClick={resetForm}
              disabled={isSubmitting}
              className="text-gray-500 hover:text-[#022d58] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X size={24} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-[#022d58] mb-2">
                  Client Name
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter client name"
                  disabled={isSubmitting}
                  className="w-full p-4 border-2 border-[#022d58]/20 rounded-xl bg-white/50 backdrop-blur-sm focus:border-[#022d58] focus:outline-none transition-all duration-300 text-[#022d58] placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-[#022d58] mb-2">
                  Client Role/Position
                </label>
                <input
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  placeholder="e.g., CEO, Manager, Client"
                  disabled={isSubmitting}
                  className="w-full p-4 border-2 border-[#022d58]/20 rounded-xl bg-white/50 backdrop-blur-sm focus:border-[#022d58] focus:outline-none transition-all duration-300 text-[#022d58] placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-[#022d58] mb-2">
                Rating (Stars)
              </label>
              <div className="flex items-center gap-4">
                <input
                  name="star"
                  type="number"
                  min={1}
                  max={5}
                  value={form.star}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-20 p-4 border-2 border-[#022d58]/20 rounded-xl bg-white/50 backdrop-blur-sm focus:border-[#022d58] focus:outline-none transition-all duration-300 text-[#022d58] text-center disabled:opacity-50 disabled:cursor-not-allowed"
                  required
                />
                <div className="flex gap-1">
                  {renderStars(form.star)}
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-[#022d58] mb-2">
                Testimonial
              </label>
              <textarea
                name="testimonial"
                value={form.testimonial}
                onChange={handleChange}
                placeholder="Enter the client's testimonial or review"
                rows={4}
                disabled={isSubmitting}
                className="w-full p-4 border-2 border-[#022d58]/20 rounded-xl bg-white/50 backdrop-blur-sm focus:border-[#022d58] focus:outline-none transition-all duration-300 text-[#022d58] placeholder-gray-500 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                required
              />
            </div>
            
            {error && (
              <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-600 text-center font-medium">
                {error}
              </div>
            )}
            
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-[#022d58] to-[#003c96] text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    {editId ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>
                    {editId ? "Update" : "Add"} Testimonial
                  </>
                )}
              </button>
              {editId && (
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={isSubmitting}
                  className="px-8 py-3 border-2 border-[#022d58]/20 text-[#022d58] rounded-xl font-semibold hover:bg-[#022d58]/5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Testimonials List */}
      <div>
        <h2 className="text-2xl font-bold text-[#022d58] mb-6">All Testimonials</h2>
        
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#022d58] mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading testimonials...</p>
          </div>
        ) : testimonials.length === 0 ? (
          <div className="text-center py-12 bg-gradient-to-br from-[#022d58]/5 to-[#003c96]/5 rounded-3xl border-2 border-[#022d58]/20">
            <MessageSquare size={48} className="text-[#022d58]/50 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-[#022d58] mb-2">No Testimonials Found</h3>
            <p className="text-gray-600">Get started by adding your first client testimonial.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {(testimonials || []).map((testimonial) => (
              <div
                key={testimonial._id}
                className="bg-gradient-to-br from-[#022d58]/5 to-[#003c96]/5 p-6 rounded-3xl border-2 border-[#022d58]/20 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 mr-4">
                    <h3 className="text-xl font-bold text-[#022d58] mb-1">
                      {testimonial.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">{testimonial.role}</p>
                    <div className="flex gap-1">
                      {renderStars(testimonial.star)}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(testimonial)}
                      disabled={isSubmitting || deletingTestimonial === testimonial._id}
                      className="p-2 text-[#022d58] hover:bg-[#022d58]/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Edit testimonial"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(testimonial._id!)}
                      disabled={isSubmitting || deletingTestimonial === testimonial._id}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Delete testimonial"
                    >
                      {deletingTestimonial === testimonial._id ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <Trash2 size={18} />
                      )}
                    </button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-semibold text-[#022d58] mb-1">Testimonial</h4>
                    <p className="text-gray-700 text-sm leading-relaxed italic">
                      &ldquo;{testimonial.testimonial}&rdquo;
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
