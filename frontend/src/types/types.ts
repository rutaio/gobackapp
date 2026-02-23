export type Thread = {
  id: string;
  name: string;
  isArchived?: boolean;
};

export type Checkin = {
  id: string;
  threadId: string;
  text: string; // treat as Title (required)
  note?: string;
  createdAt: number;
};
