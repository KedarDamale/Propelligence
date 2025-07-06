export default function AdminPanelHome() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center space-y-8">
      {/* Welcome Header */}
      <div className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-[#022d58] leading-tight">
          Welcome to<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#022d58] to-[#003c96]">
            Admin Dashboard
          </span>
        </h1>
        <div className="w-24 h-1 bg-gradient-to-r from-[#022d58] to-[#003c96] mx-auto rounded-full"></div>
      </div>
      
      {/* Welcome Message */}
      <div className="max-w-2xl space-y-6">
        <p className="text-xl text-gray-600 leading-relaxed">
          Manage your Propelligence services, blogs, and testimonials with ease. 
          Use the sidebar navigation to access different sections of your admin panel.
        </p>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-gradient-to-br from-[#022d58]/10 to-[#003c96]/10 p-6 rounded-2xl border-2 border-[#022d58]/20">
            <h3 className="text-2xl font-bold text-[#022d58] mb-2">Services</h3>
            <p className="text-gray-600">Manage your financial services</p>
          </div>
          
          <div className="bg-gradient-to-br from-[#022d58]/10 to-[#003c96]/10 p-6 rounded-2xl border-2 border-[#022d58]/20">
            <h3 className="text-2xl font-bold text-[#022d58] mb-2">Blogs</h3>
            <p className="text-gray-600">Create and edit blog content</p>
          </div>
          
          <div className="bg-gradient-to-br from-[#022d58]/10 to-[#003c96]/10 p-6 rounded-2xl border-2 border-[#022d58]/20">
            <h3 className="text-2xl font-bold text-[#022d58] mb-2">Testimonials</h3>
            <p className="text-gray-600">Manage client testimonials</p>
          </div>
        </div>
      </div>
    </div>
  );
}
