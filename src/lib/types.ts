export type Receipt = {
  id: string;
  fileName: string;
  status: 'PROCESSING' | 'PROCESSED' | 'ERROR';
  createdAt: string;

  vendor?: string;
  total?: number;
  currency?: string;
  date?: string;
  items?: string[];
};

export type ReceiptsResponse = {
  items: Receipt[];
};

export type UploadResponse = {
  uploadUrl: string;
  key: string;
};
