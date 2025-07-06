"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { Plus, Edit, Trash2, FileText, X, CheckCircle, AlertCircle, Search, Calendar, ArrowUpDown } from "lucide-react";

interface Blog {
  _id?: string;
  title: string;
  description: string;
  pdfUrl?: string;
  keywords?: string[];
}

interface Notification {
  id: string;
  type: 'success' | 'error';
  message: string;
}

type SortOrder = 'newest' | 'oldest';

export default function BlogsAdminPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<{
    title: string;
    description: string;
    keywords: string;
  }>({
    title: "",
    description: "",
    keywords: "",
  });
  const [pdf, setPdf] = useState<File | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
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

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/blogs?sort=${sortOrder}`);
      const data = await res.json();
      setBlogs(data);
    } catch {
      addNotification('error', 'Failed to load blogs');
    } finally {
      setLoading(false);
    }
  }, [sortOrder, addNotification]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

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
    if (!form.title || !form.description) {
      setError("All fields are required.");
      return;
    }
    
    try {
      // Convert keywords string to array on submit
      const cleanForm = {
        ...form,
        keywords: form.keywords
          .split(",")
          .map((k: string) => k.trim())
          .filter(Boolean),
      };
      
      if (editId) {
        // Update blog (no PDF update for simplicity)
        await fetch(`/api/blogs/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(cleanForm),
        });
        addNotification('success', 'Blog updated successfully!');
      } else {
        // Create blog (with optional PDF)
        if (pdf) {
          const fd = new FormData();
          fd.append("title", form.title);
          fd.append("description", form.description);
          fd.append("pdf", pdf);
          fd.append("keywords", cleanForm.keywords.join(","));
          await fetch("/api/blogs/upload", {
            method: "POST",
            body: fd,
          });
        } else {
          await fetch("/api/blogs", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(cleanForm),
          });
        }
        addNotification('success', 'Blog created successfully!');
      }
      
      setForm({ title: "", description: "", keywords: "" });
      setPdf(null);
      setEditId(null);
      setShowForm(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
      fetchBlogs();
    } catch {
      addNotification('error', editId ? 'Failed to update blog' : 'Failed to create blog');
    }
  }

  function handleEdit(b: Blog) {
    setForm({
      title: b.title,
      description: b.description,
      keywords: (b.keywords || []).join(", "),
    });
    setEditId(b._id!);
    setShowForm(true);
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this blog?")) return;
    
    try {
      await fetch(`/api/blogs/${id}`, { method: "DELETE" });
      addNotification('success', 'Blog deleted successfully!');
      fetchBlogs();
    } catch {
      addNotification('error', 'Failed to delete blog');
    }
  }

  function resetForm() {
    setForm({ title: "", description: "", keywords: "" });
    setPdf(null);
    setEditId(null);
    setShowForm(false);
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  // Filter blogs by search
  const filteredBlogs = blogs.filter((b) =>
    search.trim()
      ? (b.keywords || []).some((k) =>
          k.toLowerCase().includes(search.toLowerCase())
        ) ||
        b.title.toLowerCase().includes(search.toLowerCase()) ||
        b.description.toLowerCase().includes(search.toLowerCase())
      : true
  );

  const formatDate = (objectId?: string) => {
    if (!objectId) return 'N/A';
    try {
      // Extract timestamp from MongoDB ObjectId (first 4 bytes)
      const timestamp = parseInt(objectId.substring(0, 8), 16) * 1000;
      return new Date(timestamp).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'N/A';
    }
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
            Manage Blogs
          </h1>
          <p className="text-gray-600">
            Create, edit, and manage your blog content and articles
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-[#022d58] to-[#003c96] text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-2"
        >
          <Plus size={20} />
          Add New Blog
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-gradient-to-br from-[#022d58]/5 to-[#003c96]/5 p-6 rounded-3xl border-2 border-[#022d58]/20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[#022d58]">
              {editId ? "Edit" : "Add New"} Blog
            </h2>
            <button
              onClick={resetForm}
              className="text-gray-500 hover:text-[#022d58] transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-[#022d58] mb-2">
                Blog Title
              </label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Enter blog title"
                className="w-full p-4 border-2 border-[#022d58]/20 rounded-xl bg-white/50 backdrop-blur-sm focus:border-[#022d58] focus:outline-none transition-all duration-300 text-[#022d58] placeholder-gray-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-[#022d58] mb-2">
                Blog Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Enter blog description"
                rows={4}
                className="w-full p-4 border-2 border-[#022d58]/20 rounded-xl bg-white/50 backdrop-blur-sm focus:border-[#022d58] focus:outline-none transition-all duration-300 text-[#022d58] placeholder-gray-500 resize-none"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-[#022d58] mb-2">
                Keywords (Optional)
              </label>
              <input
                name="keywords"
                value={form.keywords}
                onChange={handleChange}
                placeholder="Enter keywords separated by commas"
                className="w-full p-4 border-2 border-[#022d58]/20 rounded-xl bg-white/50 backdrop-blur-sm focus:border-[#022d58] focus:outline-none transition-all duration-300 text-[#022d58] placeholder-gray-500"
              />
            </div>
            
            {!editId && (
              <div>
                <label className="block text-sm font-semibold text-[#022d58] mb-2">
                  Blog PDF (Optional)
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
                {editId ? "Update" : "Add"} Blog
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

      {/* Search and Filter */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by keyword, title, or description"
            className="w-full pl-12 pr-4 py-4 border-2 border-[#022d58]/20 rounded-xl bg-white/50 backdrop-blur-sm focus:border-[#022d58] focus:outline-none transition-all duration-300 text-[#022d58] placeholder-gray-500"
          />
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <ArrowUpDown size={20} className="text-[#022d58]" />
            <span className="text-sm font-semibold text-[#022d58]">Sort by:</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setSortOrder('newest')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                sortOrder === 'newest'
                  ? 'bg-[#022d58] text-white shadow-lg'
                  : 'bg-white/50 text-[#022d58] border-2 border-[#022d58]/20 hover:bg-[#022d58]/5'
              }`}
            >
              Newest First
            </button>
            <button
              onClick={() => setSortOrder('oldest')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                sortOrder === 'oldest'
                  ? 'bg-[#022d58] text-white shadow-lg'
                  : 'bg-white/50 text-[#022d58] border-2 border-[#022d58]/20 hover:bg-[#022d58]/5'
              }`}
            >
              Oldest First
            </button>
          </div>
        </div>
      </div>

      {/* Blogs List */}
      <div>
        <h2 className="text-2xl font-bold text-[#022d58] mb-6">All Blogs</h2>
        
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#022d58] mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading blogs...</p>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="text-center py-12 bg-gradient-to-br from-[#022d58]/5 to-[#003c96]/5 rounded-3xl border-2 border-[#022d58]/20">
            <FileText size={48} className="text-[#022d58]/50 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-[#022d58] mb-2">No Blogs Found</h3>
            <p className="text-gray-600">
              {search.trim() ? 'No blogs match your search criteria.' : 'Get started by adding your first blog post.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredBlogs.map((blog: Blog) => (
              <div
                key={blog._id}
                className="bg-gradient-to-br from-[#022d58]/5 to-[#003c96]/5 p-6 rounded-3xl border-2 border-[#022d58]/20 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-bold text-[#022d58] flex-1 mr-4">
                    {blog.title}
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(blog)}
                      className="p-2 text-[#022d58] hover:bg-[#022d58]/10 rounded-lg transition-colors"
                      title="Edit blog"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(blog._id!)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete blog"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-semibold text-[#022d58] mb-1">Description</h4>
                    <p className="text-gray-700 text-sm line-clamp-3">{blog.description}</p>
                  </div>
                  
                  {blog.keywords && blog.keywords.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-[#022d58] mb-1">Keywords</h4>
                      <div className="flex flex-wrap gap-2">
                        {blog.keywords.map((keyword, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-[#022d58]/10 text-[#022d58] text-xs rounded-full"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between pt-2">
                                         <div className="flex items-center gap-2 text-gray-500 text-sm">
                       <Calendar size={14} />
                       <span>{formatDate(blog._id)}</span>
                     </div>
                    
                    {blog.pdfUrl && (
                      <a
                        href={blog.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-[#022d58] hover:text-[#003c96] transition-colors"
                      >
                        <FileText size={16} />
                        View PDF
                      </a>
                    )}
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
