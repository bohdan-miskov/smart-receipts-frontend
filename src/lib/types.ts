export type Receipt = {
  id: string;
  fileName: string;
  detectedText: string[];
  createdAt: string;
};

export type ReceiptsResponse = {
  items: Receipt[];
};

export type UploadResponse = {
  uploadUrl: string;
  key: string;
};
