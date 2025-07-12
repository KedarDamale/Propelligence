"use client";
import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement,
} from "chart.js";
import { Bar, Pie, Line } from "react-chartjs-2";
import { Trash2 } from 'lucide-react';
import * as XLSX from 'xlsx';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement
);

const columns = [
  "Full Name",
  "Mobile",
  "Email",
  "Business Name",
  "Business Type",
  "Services Interested In",
  "Monthly Turnover",
  "Preferred Contact Modes",
  "Requirement",
  "Book Consultation",
  "Submitted At",
];

const FILTERS = [
  { label: 'Today', value: 'today' },
  { label: 'Weekly', value: 'week' },
  { label: 'Monthly', value: 'month' },
  { label: 'Yearly', value: 'year' },
  { label: 'All', value: 'all' },
];

const CONTACT_STATUS_FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'Contacted', value: 'contacted' },
  { label: 'Not Contacted', value: 'not_contacted' },
];

type ContactSubmission = {
  _id?: string;
  fullName: string;
  mobile: string;
  email: string;
  businessName: string;
  businessType: string;
  businessTypeOther?: string;
  services: string[];
  servicesOther?: string;
  turnover: string;
  contactModes: string[];
  requirement: string;
  bookConsultation: string;
  createdAt?: string;
  contacted?: boolean;
  contactedAt?: string;
  imgUrl?: string; // <-- new field
};

function toExcel(rows: ContactSubmission[]) {
  // Create Excel data with headers and data
  const excelData = [
    [...columns, "Contacted", "Contacted At"], // Header row
    ...rows.map((row) => [
      row.fullName,
      row.mobile,
      row.email,
      row.businessName,
      row.businessType === "Other" ? row.businessTypeOther : row.businessType,
      (row.services || []).join("; ") + (row.services && row.services.includes("Other") ? ` (${row.servicesOther})` : ""),
      row.turnover,
      (row.contactModes || []).join("; "),
      row.requirement,
      row.bookConsultation,
      row.createdAt ? new Date(row.createdAt).toLocaleString() : "",
      row.contacted ? "Yes" : "No",
      row.contactedAt ? new Date(row.contactedAt).toLocaleString() : "",
    ])
  ];

  // Create workbook and worksheet
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.aoa_to_sheet(excelData);

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, "Contact Submissions");

  // Generate Excel file
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  
  return excelBuffer;
}

function getAnalytics(submissions: ContactSubmission[], filter: string) {
  // Total submissions
  const total = submissions.length;

  // Submissions over time (dynamic by filter)
  let days: string[] = [];
  const submissionsByDay: Record<string, number> = {};
  let months: string[] = [];
  const submissionsByMonth: Record<string, number> = {};
  const now = new Date();
  if (filter === 'today') {
    days = [now.toISOString().slice(0, 10)];
    submissionsByDay[days[0]] = 0;
    submissions.forEach((s) => {
      const d = s.createdAt ? new Date(s.createdAt).toISOString().slice(0, 10) : null;
      if (d === days[0]) submissionsByDay[d]++;
    });
  } else if (filter === 'week') {
    days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toISOString().slice(0, 10);
    });
    days.forEach((d) => (submissionsByDay[d] = 0));
    submissions.forEach((s) => {
      const d = s.createdAt ? new Date(s.createdAt).toISOString().slice(0, 10) : null;
      if (d && submissionsByDay[d] !== undefined) submissionsByDay[d]++;
    });
  } else if (filter === 'month') {
    days = Array.from({ length: 30 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (29 - i));
      return d.toISOString().slice(0, 10);
    });
    days.forEach((d) => (submissionsByDay[d] = 0));
    submissions.forEach((s) => {
      const d = s.createdAt ? new Date(s.createdAt).toISOString().slice(0, 10) : null;
      if (d && submissionsByDay[d] !== undefined) submissionsByDay[d]++;
    });
  } else if (filter === 'all') {
    // Show all available days from earliest to latest submission
    const allDates = submissions
      .map(s => s.createdAt ? new Date(s.createdAt).toISOString().slice(0, 10) : null)
      .filter(Boolean) as string[];
    if (allDates.length > 0) {
      const minDate = new Date(Math.min(...allDates.map(d => new Date(d).getTime())));
      const maxDate = new Date(Math.max(...allDates.map(d => new Date(d).getTime())));
      const dateArray = [];
      for (let d = new Date(minDate); d <= maxDate; d.setDate(d.getDate() + 1)) {
        dateArray.push(new Date(d).toISOString().slice(0, 10));
      }
      days = dateArray;
      days.forEach((d) => (submissionsByDay[d] = 0));
      submissions.forEach((s) => {
        const d = s.createdAt ? new Date(s.createdAt).toISOString().slice(0, 10) : null;
        if (d && submissionsByDay[d] !== undefined) submissionsByDay[d]++;
      });
    } else {
      days = [];
    }
  } else if (filter === 'year') {
    // Last 12 months
    months = Array.from({ length: 12 }, (_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - (11 - i));
      return d.toISOString().slice(0, 7); // YYYY-MM
    });
    months.forEach((m) => (submissionsByMonth[m] = 0));
    submissions.forEach((s) => {
      const m = s.createdAt ? new Date(s.createdAt).toISOString().slice(0, 7) : null;
      if (m && submissionsByMonth[m] !== undefined) submissionsByMonth[m]++;
    });
  }

  // Business Types
  const businessTypeCounts: Record<string, number> = {};
  submissions.forEach((s) => {
    const type = s.businessType === "Other" ? s.businessTypeOther || "Other" : s.businessType;
    if (type) businessTypeCounts[type] = (businessTypeCounts[type] || 0) + 1;
  });

  // Services
  const serviceCounts: Record<string, number> = {};
  submissions.forEach((s) => {
    (s.services || []).forEach((svc: string) => {
      const key = svc === "Other" ? s.servicesOther || "Other" : svc;
      if (key) serviceCounts[key] = (serviceCounts[key] || 0) + 1;
    });
  });

  // Contact Modes
  const contactModeCounts: Record<string, number> = {};
  submissions.forEach((s) => {
    (s.contactModes || []).forEach((mode: string) => {
      if (mode) contactModeCounts[mode] = (contactModeCounts[mode] || 0) + 1;
    });
  });

  // Consultation Call
  const consultCounts = { Yes: 0, No: 0 };
  submissions.forEach((s) => {
    if (s.bookConsultation === "Yes") consultCounts.Yes++;
    else if (s.bookConsultation === "No") consultCounts.No++;
  });

  // Turnover
  const turnoverCounts: Record<string, number> = {};
  submissions.forEach((s) => {
    if (s.turnover) turnoverCounts[s.turnover] = (turnoverCounts[s.turnover] || 0) + 1;
  });

  return {
    total,
    days,
    submissionsByDay,
    months,
    submissionsByMonth,
    businessTypeCounts,
    serviceCounts,
    contactModeCounts,
    consultCounts,
    turnoverCounts,
  };
}

function filterSubmissions(submissions: ContactSubmission[], filter: string, contactStatusFilter: string) {
  const now = new Date();
  
  return submissions.filter(s => {
    if (!s.createdAt) return false;
    const date = new Date(s.createdAt);
    
    // Date filter
    let dateFilter = true;
    if (filter === 'today') {
      dateFilter = date.toDateString() === now.toDateString();
    } else if (filter === 'week') {
      const weekAgo = new Date(now);
      weekAgo.setDate(now.getDate() - 6);
      dateFilter = date >= weekAgo && date <= now;
    } else if (filter === 'month') {
      dateFilter = date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    } else if (filter === 'year') {
      dateFilter = date.getFullYear() === now.getFullYear();
    } else if (filter === 'all') {
      dateFilter = true;
    }
    
    // Contact status filter
    let contactFilter = true;
    if (contactStatusFilter === 'contacted') {
      contactFilter = s.contacted === true;
    } else if (contactStatusFilter === 'not_contacted') {
      contactFilter = s.contacted !== true;
    } else if (contactStatusFilter === 'all') {
      contactFilter = true;
    }
    
    return dateFilter && contactFilter;
  });
}

function ContactSubmissionsAdmin() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [filter, setFilter] = useState('all');
  const [contactStatusFilter, setContactStatusFilter] = useState('all');
  const [isClient, setIsClient] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [updatingContactId, setUpdatingContactId] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    fetch("/api/contact?all=1")
      .then((res) => res.json())
      .then((data) => {
        setSubmissions(data.submissions || []);
        setLoading(false);
      });
  }, []);

  const dateFilteredSubmissions = filterSubmissions(submissions, filter, 'all'); // For analytics - always use 'all' for contact status
  const filteredSubmissions = filterSubmissions(submissions, filter, contactStatusFilter); // For table and Excel - use contact status filter
  
  const handleDownload = () => {
    const excelBuffer = toExcel(filteredSubmissions);
    const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `contact_submissions_${filter}_${Date.now()}.xlsx`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const analytics = isClient ? getAnalytics(dateFilteredSubmissions, filter) : null;

  const handleContactStatusUpdate = async (id: string, contacted: boolean) => {
    setUpdatingContactId(id);
    try {
      const res = await fetch(`/api/contact?id=${id}`, { 
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ contacted })
      });
      if (res.ok) {
        setSubmissions(submissions => 
          submissions.map(s => 
            s._id === id 
              ? { ...s, contacted, contactedAt: contacted ? new Date().toISOString() : undefined }
              : s
          )
        );
      } else {
        // Optionally handle error
      }
    } catch {
      // Optionally handle error
    } finally {
      setUpdatingContactId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this submission?')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/contact?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSubmissions(submissions => submissions.filter(s => s._id !== id));
      } else {
        // Optionally handle error
      }
    } catch {
      // Optionally handle error
    } finally {
      setDeletingId(null);
    }
  };

  if (!isClient) {
    return <div className="w-full max-w-screen-lg mx-auto px-2 sm:px-4 py-8 text-center text-[#022d58]">Loading...</div>;
  }

  return (
    <div className="w-full max-w-screen-lg mx-auto px-2 sm:px-4">
      {/* Filter Controls */}
      <div className="flex flex-wrap gap-2 mb-4">
        {FILTERS.map(f => (
          <button
            key={f.value}
            className={`px-3 py-1 rounded-full border font-semibold text-xs sm:text-sm transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#022d58] ${filter === f.value ? 'bg-[#022d58] text-white border-[#022d58]' : 'bg-white text-[#022d58] border-[#022d58]/40 hover:bg-[#022d58]/10'}`}
            onClick={() => setFilter(f.value)}
            aria-pressed={filter === f.value}
          >
            {f.label}
          </button>
        ))}
      </div>
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-[#022d58]">Contact Form Submissions</h2>
      {/* Analytics Dashboard */}
      {analytics ? (
        <div className="flex flex-col gap-y-4 mb-6 w-full overflow-x-auto">
          <div className="bg-white rounded-2xl shadow p-3 sm:p-6 flex flex-col items-center w-full mb-2 sm:mb-4 min-w-0">
            <div className="text-3xl sm:text-4xl font-bold text-[#022d58]">{analytics.total}</div>
            <div className="text-gray-600 mt-1 sm:mt-2 text-sm">Total Submissions ({FILTERS.find(f => f.value === filter)?.label})</div>
          </div>
          <div className="bg-white rounded-2xl shadow p-3 sm:p-6 flex flex-col w-full mb-2 sm:mb-4 min-w-0">
            <div className="font-semibold text-[#022d58] mb-2">
              {filter === 'today' && 'Submissions (Today)'}
              {filter === 'week' && 'Submissions (Last 7 Days)'}
              {filter === 'month' && 'Submissions (Last 30 Days)'}
              {filter === 'year' && 'Submissions (Last 12 Months)'}
              {filter === 'all' && 'Submissions (All Time)'}
            </div>
            <div className="relative w-full max-w-full h-[80px] sm:h-[120px]">
              {filter === 'year' ? (
                <div style={{ width: '100%' }}>
                  <Line
                    data={{
                      labels: analytics.months,
                      datasets: [
                        {
                          label: 'Submissions',
                          data: analytics.months.map((m) => analytics.submissionsByMonth[m]),
                          borderColor: '#022d58',
                          backgroundColor: '#022d58',
                          fill: false,
                          tension: 0.3,
                        },
                      ],
                    }}
                    options={{
                      plugins: { legend: { display: false } },
                      scales: { x: { ticks: { maxTicksLimit: 6 } } },
                      responsive: true,
                      maintainAspectRatio: false,
                    }}
                  />
                </div>
              ) : (
                <div style={{ width: '100%' }}>
                  <Line
                    data={{
                      labels: analytics.days,
                      datasets: [
                        {
                          label: 'Submissions',
                          data: analytics.days.map((d) => analytics.submissionsByDay[d]),
                          borderColor: '#022d58',
                          backgroundColor: '#022d58',
                          fill: false,
                          tension: 0.3,
                        },
                      ],
                    }}
                    options={{
                      plugins: { legend: { display: false } },
                      scales: { x: { ticks: { maxTicksLimit: 6 } } },
                      responsive: true,
                      maintainAspectRatio: false,
                    }}
                  />
                </div>
              )}
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow p-3 sm:p-6 flex flex-col w-full mb-2 sm:mb-4 min-w-0">
            <div className="font-semibold text-[#022d58] mb-2">Business Types</div>
            <div className="relative w-full max-w-full h-[80px] sm:h-[120px] overflow-x-auto">
              <Pie
                data={{
                  labels: Object.keys(analytics?.businessTypeCounts || {}),
                  datasets: [
                    {
                      data: Object.values(analytics?.businessTypeCounts || {}),
                      backgroundColor: [
                        "#022d58",
                        "#003c96",
                        "#00bcd4",
                        "#8bc34a",
                        "#ff9800",
                        "#e91e63",
                      ],
                    },
                  ],
                }}
                options={{ plugins: { legend: { position: "bottom" } }, maintainAspectRatio: false }}
              />
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow p-3 sm:p-6 flex flex-col w-full mb-2 sm:mb-4 min-w-0">
            <div className="font-semibold text-[#022d58] mb-2">Top Services Interested In</div>
            <div className="relative w-full max-w-full h-[80px] sm:h-[120px] overflow-x-auto">
              <Bar
                data={{
                  labels: Object.keys(analytics?.serviceCounts || {}),
                  datasets: [
                    {
                      label: "Count",
                      data: Object.values(analytics?.serviceCounts || {}),
                      backgroundColor: "#022d58",
                    },
                  ],
                }}
                options={{ plugins: { legend: { display: false } }, maintainAspectRatio: false }}
              />
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow p-3 sm:p-6 flex flex-col w-full mb-2 sm:mb-4 min-w-0">
            <div className="font-semibold text-[#022d58] mb-2">Preferred Contact Modes</div>
            <div className="relative w-full max-w-full h-[80px] sm:h-[120px] overflow-x-auto">
              <Pie
                data={{
                  labels: Object.keys(analytics?.contactModeCounts || {}),
                  datasets: [
                    {
                      data: Object.values(analytics?.contactModeCounts || {}),
                      backgroundColor: ["#022d58", "#003c96", "#00bcd4"],
                    },
                  ],
                }}
                options={{ plugins: { legend: { position: "bottom" } }, maintainAspectRatio: false }}
              />
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow p-3 sm:p-6 flex flex-col w-full mb-2 sm:mb-4 min-w-0">
            <div className="font-semibold text-[#022d58] mb-2">Consultation Call Interest</div>
            <div className="relative w-full max-w-full h-[80px] sm:h-[120px] overflow-x-auto">
              <Pie
                data={{
                  labels: ["Yes", "No"],
                  datasets: [
                    {
                      data: [analytics?.consultCounts.Yes || 0, analytics?.consultCounts.No || 0],
                      backgroundColor: ["#022d58", "#00bcd4"],
                    },
                  ],
                }}
                options={{ plugins: { legend: { position: "bottom" } }, maintainAspectRatio: false }}
              />
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow p-3 sm:p-6 flex flex-col w-full mb-2 sm:mb-4 min-w-0">
            <div className="font-semibold text-[#022d58] mb-2">Monthly Turnover Distribution</div>
            <div className="relative w-full max-w-full h-[80px] sm:h-[120px] overflow-x-auto">
              <Bar
                data={{
                  labels: Object.keys(analytics?.turnoverCounts || {}),
                  datasets: [
                    {
                      label: "Count",
                      data: Object.values(analytics?.turnoverCounts || {}),
                      backgroundColor: "#003c96",
                    },
                  ],
                }}
                options={{ plugins: { legend: { display: false } }, maintainAspectRatio: false }}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full flex justify-center items-center py-8">
          <span className="text-[#022d58] text-lg font-semibold">Loading analytics...</span>
        </div>
      )}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <button
          onClick={handleDownload}
          className="px-4 sm:px-6 py-2 bg-[#022d58] text-white rounded hover:bg-[#003c96] font-semibold w-full sm:w-auto"
          disabled={loading || submissions.length === 0}
        >
          Download Excel File
        </button>
        <div className="flex flex-wrap gap-2">
          {CONTACT_STATUS_FILTERS.map(f => (
            <button
              key={f.value}
              className={`px-3 py-1 rounded-full border font-semibold text-xs sm:text-sm transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#022d58] ${contactStatusFilter === f.value ? 'bg-[#022d58] text-white border-[#022d58]' : 'bg-white text-[#022d58] border-[#022d58]/40 hover:bg-[#022d58]/10'}`}
              onClick={() => setContactStatusFilter(f.value)}
              aria-pressed={contactStatusFilter === f.value}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="overflow-x-auto w-full">
          <table className="min-w-full text-xs sm:text-sm text-left border border-gray-200 rounded-xl bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-2 py-2 font-semibold text-[#022d58] border-b border-gray-200 whitespace-nowrap"></th>
                <th className="px-2 py-2 font-semibold text-[#022d58] border-b border-gray-200 whitespace-nowrap">Email</th>
                <th className="px-2 py-2 font-semibold text-[#022d58] border-b border-gray-200 whitespace-nowrap">Business Name</th>
                <th className="px-2 py-2 font-semibold text-[#022d58] border-b border-gray-200 whitespace-nowrap">Monthly Turnover</th>
                <th className="px-2 py-2 font-semibold text-[#022d58] border-b border-gray-200 whitespace-nowrap">Book Consultation</th>
                <th className="px-2 py-2 font-semibold text-[#022d58] border-b border-gray-200 whitespace-nowrap">Contacted</th>
                <th className="px-2 py-2 font-semibold text-[#022d58] border-b border-gray-200 whitespace-nowrap">Submitted At</th>
                <th className="px-2 py-2 font-semibold text-[#022d58] border-b border-gray-200 whitespace-nowrap">Delete</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubmissions.map((row, idx) => {
                const isOpen = expanded === idx;
                return (
                  <React.Fragment key={row._id || idx}>
                    <tr className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                      <td className="px-2 py-2 text-center">
                        <button
                          type="button"
                          className="p-1 rounded-full hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-[#022d58]"
                          title={isOpen ? 'Hide details' : 'Show details'}
                          aria-label={isOpen ? 'Hide details' : 'Show details'}
                          onClick={() => setExpanded(isOpen ? null : idx)}
                        >
                          {isOpen ? '▲' : '▼'}
                        </button>
                      </td>
                      <td className="px-2 py-2 whitespace-nowrap">{row.email}</td>
                      <td className="px-2 py-2 whitespace-nowrap">{row.businessName}</td>
                      <td className="px-2 py-2 whitespace-nowrap">{row.turnover}</td>
                      <td className="px-2 py-2 whitespace-nowrap">{row.bookConsultation}</td>
                      <td className="px-2 py-2 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={row.contacted || false}
                          onChange={(e) => {
                            e.stopPropagation();
                            if (row._id) handleContactStatusUpdate(row._id, e.target.checked);
                          }}
                          disabled={updatingContactId === row._id || !row._id}
                          className="w-4 h-4 text-[#022d58] bg-gray-100 border-gray-300 rounded focus:ring-[#022d58] focus:ring-2"
                          title={row.contacted ? "Mark as not contacted" : "Mark as contacted"}
                        />
                        {row.contactedAt && (
                          <div className="text-xs text-gray-500 mt-1">
                            {new Date(row.contactedAt).toLocaleDateString()}
                          </div>
                        )}
                      </td>
                      <td className="px-2 py-2 whitespace-nowrap">{row.createdAt ? new Date(row.createdAt).toLocaleString() : ''}</td>
                      <td className="px-2 py-2">
                        <button
                          type="button"
                          className="p-1 rounded-full hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-400"
                          title="Delete submission"
                          aria-label="Delete submission"
                          onClick={e => { e.stopPropagation(); if (row._id) handleDelete(row._id); }}
                          disabled={deletingId === row._id || !row._id}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </td>
                    </tr>
                    {isOpen && (
                      <tr className="bg-blue-50">
                        <td colSpan={8} className="px-4 py-3">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm text-gray-700 break-words w-full">
                            <div><span className="font-semibold">Full Name:</span> {row.fullName}</div>
                            <div><span className="font-semibold">Mobile:</span> {row.mobile}</div>
                            <div><span className="font-semibold">Business Type:</span> {row.businessType === 'Other' ? row.businessTypeOther : row.businessType}</div>
                            <div><span className="font-semibold">Services:</span> {(row.services || []).join(', ')}{row.services && row.services.includes('Other') && row.servicesOther ? ` (${row.servicesOther})` : ''}</div>
                            <div><span className="font-semibold">Preferred Contact Modes:</span> {(row.contactModes || []).join(', ')}</div>
                            <div><span className="font-semibold">Contact Status:</span> {row.contacted ? 'Contacted' : 'Not Contacted'}{row.contactedAt ? ` (${new Date(row.contactedAt).toLocaleString()})` : ''}</div>
                            <div className="md:col-span-2"><span className="font-semibold">Requirement:</span> {row.requirement}</div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ContactSubmissionsAdmin;