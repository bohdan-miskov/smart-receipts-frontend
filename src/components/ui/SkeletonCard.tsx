import React from 'react';

export const SkeletonCard = () => (
  <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm animate-pulse h-full">
    <div className="flex justify-between items-start mb-4">
      <div className="space-y-2">
        <div className="h-4 w-24 bg-slate-200 rounded"></div>
        <div className="h-3 w-16 bg-slate-100 rounded"></div>
      </div>
      <div className="h-6 w-20 bg-green-50 rounded-full"></div>
    </div>
    <div className="space-y-3 mt-4">
      <div className="h-3 w-full bg-slate-100 rounded"></div>
      <div className="h-3 w-3/4 bg-slate-100 rounded"></div>
      <div className="h-4 w-28 bg-blue-50 rounded mt-2"></div>
    </div>
  </div>
);
