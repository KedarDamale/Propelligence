"use client";
import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';

interface Blog {
  _id?: string;
  title: string;
  description: string;
  pdfUrl?: string;
  keywords?: string[];
}

const OurWorkSection = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(5);
  const [sort, setSort] = useState<'newest' | 'oldest'>('newest');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
    // eslint-disable-next-line
  }, [sort, search]);

  async function fetchBlogs() {
    setLoading(true);
    const params = new URLSearchParams();
    params.append('sort', sort);
    if (search.trim()) params.append('search', search.trim());
    const res = await fetch(`/api/public/blogs?${params.toString()}`);
    const data = await res.json();
    setBlogs(Array.isArray(data) ? data : []);
    setVisibleCount(5);
    setExpandedIndex(null);
    setLoading(false);
  }

  return (
    <section id="our-work" className="bg-white">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="text-center mb-6">
          <h2 className="text-4xl font-bold text-[#022d58] mb-2 drop-shadow-sm">Our Work</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-0">
            Case studies and blogs from our financial risk management expertise.
          </p>
        </div>
        
        {/* Search bar row */}
        <div className="w-full max-w-5xl mx-auto flex justify-center mb-4">
          <div className="w-full md:w-80">
            <input
              type="text"
              placeholder="Search blogs by keyword..."
              className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-[#022d58]"
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') fetchBlogs(); }}
            />
          </div>
        </div>
        
        {/* Sort buttons row */}
        <div className="w-full max-w-5xl mx-auto flex justify-center mb-6">
          <div className="flex gap-2">
            <button
              className={`px-4 py-2 rounded-full font-semibold border-2 transition-colors duration-200 ${sort === 'newest' ? 'bg-[#022d58] text-white border-[#022d58]' : 'bg-white text-[#022d58] border-[#022d58]'}`}
              onClick={() => setSort('newest')}
            >
              Newest
            </button>
            <button
              className={`px-4 py-2 rounded-full font-semibold border-2 transition-colors duration-200 ${sort === 'oldest' ? 'bg-[#022d58] text-white border-[#022d58]' : 'bg-white text-[#022d58] border-[#022d58]'}`}
              onClick={() => setSort('oldest')}
            >
              Oldest
            </button>
          </div>
        </div>
        
        {loading ? (
          <div className="text-center py-8 text-lg">Loading blogs...</div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-8 text-lg">No blogs found.</div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {blogs.slice(0, visibleCount).map((blog, index) => {
              const isExpanded = expandedIndex === index;
              // Show about 5-6 words for collapsed state
              const words = (blog.description || '').split(' ');
              const shortDesc = words.length > 6 ? words.slice(0, 6).join(' ') + '...' : blog.description;
              
              return (
                <div
                  key={blog._id || index}
                  tabIndex={0}
                  role="button"
                  onClick={() => setExpandedIndex(isExpanded ? null : index)}
                  onKeyPress={e => { if (e.key === 'Enter' || e.key === ' ') setExpandedIndex(isExpanded ? null : index); }}
                  className={`group relative p-4 rounded-3xl bg-white border-2 border-black shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 flex flex-col items-center justify-center overflow-hidden no-underline cursor-pointer glow-blue ${isExpanded ? 'scale-105 border-4' : ''} w-full md:w-80`}
                  style={{ textDecoration: 'none' }}
                >
                  <div className="flex flex-col items-center pt-1 pb-1 px-1 w-full">
                    <h3 className="text-2xl font-bold md:font-semibold text-[#022d58] mb-0 text-center tracking-tight drop-shadow-sm">
                      {blog.title}
                    </h3>
                    <div className="flex justify-center w-full">
                      <div
                        className={`expandable-content w-full overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] flex flex-col items-center ${isExpanded ? 'max-h-96 opacity-100 mt-2' : 'max-h-12 opacity-100 mt-2'}`}
                      >
                        {!isExpanded ? (
                          <span className="block text-center w-full break-words text-gray-700" style={{ whiteSpace: 'pre-wrap' }}>
                            {shortDesc || 'No description available.'}
                          </span>
                        ) : (
                          <>
                            <div className="w-full flex justify-center">
                              <hr className="w-3/4 border-t-2 border-black my-2 transition-all duration-500" />
                            </div>
                            <div className="flex justify-center w-full">
                              {blog.description && blog.description.length > 0
                                ? blog.description.split(/\r?\n/).map((line, idx) => (
                                    <span key={idx} className="block text-center w-full break-words" style={{ whiteSpace: 'pre-wrap' }}>
                                      {line || '\u00A0'}
                                    </span>
                                  ))
                                : <span className="block text-center w-full break-words" style={{ whiteSpace: 'pre-wrap' }}>No description available.</span>
                              }
                            </div>
                            <div className="w-full flex justify-center">
                              <hr className="w-3/4 border-t-2 border-black my-2 transition-all duration-500" />
                            </div>
                            {blog.pdfUrl ? (
                              <a
                                href={blog.pdfUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-4 bg-[#022d58] text-white px-4 py-2 rounded-full font-semibold hover:bg-[#003c96] transition-colors duration-300 flex items-center space-x-2"
                                onClick={e => e.stopPropagation()}
                                style={{ textDecoration: 'none' }}
                              >
                                <ArrowRight size={18} className="mr-2" />
                                View Blog PDF
                              </a>
                            ) : (
                              <button
                                className="mt-4 bg-gray-400 text-white px-4 py-2 rounded-full font-semibold cursor-not-allowed flex items-center space-x-2"
                                onClick={e => e.stopPropagation()}
                                disabled
                              >
                                <ArrowRight size={18} className="mr-2" />
                                No Blog PDF
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* Expand Arrow Icon */}
                  <span className="absolute bottom-3 right-3">
                    <ChevronDown
                      size={28}
                      className={`transition-transform duration-300 ${isExpanded ? 'rotate-180 text-black' : 'text-black'}`}
                    />
                  </span>
                </div>
              );
            })}
          </div>
        )}
        
        {visibleCount < blogs.length && !loading && (
          <div className="text-center mb-8">
            <button
              className="bg-[#022d58] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#003c96] transition-colors duration-300"
              onClick={() => setVisibleCount(count => Math.min(count + 5, blogs.length))}
            >
              Load More Blogs
            </button>
          </div>
        )}
        
        {visibleCount >= blogs.length && blogs.length > 5 && !loading && (
          <div className="text-center mb-8">
            <button
              className="bg-[#022d58] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#003c96] transition-colors duration-300"
              onClick={() => {
                setVisibleCount(5);
                setExpandedIndex(null);
                setTimeout(() => {
                  const firstBlog = document.querySelector('#our-work [role="button"]');
                  if (firstBlog) {
                    firstBlog.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }
                }, 100);
              }}
            >
              Collapse Blogs Section
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default OurWorkSection;