import type { Receipt } from '../../lib/types';

type ReceiptCardProps = {
  receipt: Receipt;
};

export const ReceiptCard: React.FC<ReceiptCardProps> = ({ receipt }) => {
  const formattedTotal = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: receipt.currency || 'USD',
  }).format(receipt.total || 0);

  const displayDate = receipt.date
    ? new Date(receipt.date).toLocaleDateString()
    : new Date(receipt.createdAt).toLocaleDateString();

  return (
    <article className="group relative bg-white flex flex-col h-full rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
      <div
        className={`h-2 w-full ${
          receipt.status === 'PROCESSED' ? 'bg-emerald-500' : 'bg-slate-300'
        }`}
      />

      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-bold text-slate-800 text-lg tracking-tight">
              {receipt.vendor || 'Unknown Store'}
            </h3>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">
              {displayDate}
            </p>
          </div>
          {receipt.status === 'PROCESSED' ? (
            <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded-full border border-emerald-100">
              AI PROCESSED
            </span>
          ) : (
            <span className="bg-amber-50 text-amber-600 text-[10px] font-bold px-2 py-1 rounded-full animate-pulse">
              ANALYZING...
            </span>
          )}
        </div>
        <div className="mb-6">
          <p className="text-sm text-slate-500 mb-1">Total Amount</p>
          <div className="text-3xl font-black text-slate-900 tracking-tight">
            {receipt.total ? formattedTotal : '--.--'}
          </div>
        </div>
        <div className="mt-auto border-t border-dashed border-slate-200 pt-4">
          <details className="group/details">
            <summary className="flex items-center justify-between cursor-pointer list-none text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">
              <span>View Items ({receipt.items?.length || 0})</span>
              <span className="group-open/details:rotate-180 transition-transform duration-200 text-xs">
                ▼
              </span>
            </summary>

            <div className="mt-3 bg-slate-50 rounded-lg p-3 text-xs font-mono text-slate-600 space-y-1 max-h-32 overflow-x-auto overflow-y-auto border border-slate-100">
              {receipt.items && receipt.items.length > 0 ? (
                receipt.items.map((item, idx) => (
                  <div key={idx} className="flex gap-2 leading-relaxed">
                    <span className="text-slate-400 select-none shrink-0">
                      •
                    </span>
                    <span className="break-words whitespace-normal">
                      {item}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-slate-400 italic">No items detected</p>
              )}
            </div>
          </details>
        </div>
      </div>

      <div
        className="absolute bottom-0 left-0 w-full h-1.5 bg-repeat-x opacity-50"
        style={{
          backgroundImage:
            'linear-gradient(45deg, transparent 33.333%, #cbd5e1 33.333%, #cbd5e1 66.667%, transparent 66.667%), linear-gradient(-45deg, transparent 33.333%, #cbd5e1 33.333%, #cbd5e1 66.667%, transparent 66.667%)',
          backgroundSize: '12px 24px',
        }}
      />
    </article>
  );
};
