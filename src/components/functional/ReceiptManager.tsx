import { useCallback, useEffect, useRef, useState } from 'react';
import type { Receipt } from '../../lib/types';
import { receiptService } from '../../lib/api';
import { Button } from '../common/Button';
import { SkeletonCard } from '../ui/SkeletonCard';

export const ReceiptManager = () => {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchReceipts = useCallback(async () => {
    try {
      setLoading(true);
      const { items } = await receiptService.getAll();

      const sorted = items.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
      setReceipts(sorted);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReceipts();
  }, [fetchReceipts]);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const processFile = async (file: File) => {
    // if (!e?.target.files?.[0]) return;

    // const file = e.target.files[0];

    try {
      setUploading(true);
      const { uploadUrl } = await receiptService.getUploadUrl();
      await receiptService.uploadToS3(uploadUrl, file);

      setTimeout(() => fetchReceipts(), 5000);
    } catch (err) {
      alert('Error uploading file');
    } finally {
      setUploading(false);
      // e.target.value = '';
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setIsDragging(true);
    else if (e.type === 'dragleave') setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) await processFile(file);
  };

  return (
    <div onDragEnter={handleDrag} className="relative min-h-[600px]">
      {isDragging && (
        <div
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className="fixed inset-0 z-50 flex items-center justify-center bg-blue-600/10 backdrop-blur-md border-4 border-blue-500 border-dashed m-4 rounded-3xl"
        >
          <div className="bg-white p-8 rounded-2xl shadow-2xl text-center pointer-events-none">
            <span className="text-6xl block mb-4 animate-bounce">📥</span>
            <h2 className="text-2xl font-bold text-blue-600">
              Drop receipt here
            </h2>
          </div>
        </div>
      )}
      <div className="space-y-12">
        <section
          aria-labelledby="upload-heading"
          className="flex justify-center"
        >
          <h2 id="upload-heading" className="sr-only">
            Upload New Receipt
          </h2>

          <label className="relative group">
            <Button
              isLoading={uploading}
              onClick={handleButtonClick}
              aria-label="Upload a receipt image"
            >
              📸 Scan New Receipt
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => {
                if (!e.target.files?.[0]) return;
                processFile(e.target.files[0]);
                e.target.value = '';
              }}
              className="hidden"
              accept="image/jpeg, image/png"
            />
          </label>
        </section>
        <section aria-labelledby="history-heading">
          <h2 id="history-heading" className="sr-only">
            Transaction History
          </h2>

          {loading && receipts.length === 0 && (
            <p
              role="status"
              className="text-center col-span-full text-slate-500 animate-pulse"
            >
              Loading history...
            </p>
          )}

          <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3" role="list">
            {loading && receipts.length === 0
              ? [...Array(6)].map((_, i) => (
                  <li key={i}>
                    <SkeletonCard />
                  </li>
                ))
              : receipts.map((receipt) => (
                  <li key={receipt.id}>
                    <article className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
                      <header className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-slate-800">
                            <time dateTime={receipt.createdAt}>
                              {new Date(receipt.createdAt).toLocaleDateString()}
                            </time>
                          </h3>
                          <p className="text-xs text-slate-400">
                            <time dateTime={receipt.createdAt}>
                              {new Date(receipt.createdAt).toLocaleTimeString()}
                            </time>
                          </p>
                        </div>
                        <span
                          className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium"
                          role="status"
                          aria-label="Status: AI Processed"
                        >
                          AI Processed
                        </span>
                      </header>

                      <div className="space-y-3 flex-grow">
                        <p
                          className="text-xs text-slate-500 truncate"
                          title={receipt.fileName}
                        >
                          <span className="sr-only">File name:</span>
                          📄 {receipt.fileName}
                        </p>

                        <details className="group">
                          <summary className="text-sm text-blue-600 cursor-pointer font-medium hover:text-blue-700 list-none flex items-center gap-1">
                            <span
                              className="group-open:rotate-90 transition-transform"
                              aria-hidden="true"
                            >
                              ▶
                            </span>
                            View Extracted Text
                          </summary>
                          <div className="mt-2 bg-slate-900 text-slate-50 p-3 rounded-lg text-xs font-mono overflow-x-auto max-h-32">
                            {receipt.detectedText?.join('\n') ||
                              'No text detected'}
                          </div>
                        </details>
                      </div>
                    </article>
                  </li>
                ))}
          </ul>
        </section>
      </div>
    </div>
  );
};
