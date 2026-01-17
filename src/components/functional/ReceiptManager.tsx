import { useCallback, useEffect, useRef, useState } from 'react';
import type { Receipt } from '../../lib/types';
import { receiptService } from '../../lib/api';
import { Button } from '../common/Button';
import { SkeletonCard } from '../ui/SkeletonCard';
import { ReceiptCard } from '../ui/ReceiptCard';

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
    try {
      setUploading(true);
      const { uploadUrl } = await receiptService.getUploadUrl();
      await receiptService.uploadToS3(uploadUrl, file);

      setTimeout(() => fetchReceipts(), 10000);
    } catch (err) {
      alert('Error uploading file');
    } finally {
      setUploading(false);
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
                  <li key={receipt.id} className="h-full">
                    <ReceiptCard receipt={receipt} />
                  </li>
                ))}
          </ul>
        </section>
      </div>
    </div>
  );
};
