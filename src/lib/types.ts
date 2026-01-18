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

export type StatsData = {
  currencyList: { code: string; amount: number }[];
  receiptsCount: number;
  topVendors: { name: string; amount: number }[];
  chartData: { date: string; amount: number }[];
};
