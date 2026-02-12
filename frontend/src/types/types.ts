export type Thread = {
  id: string;
  name: string;
};

export type Checkin = {
  id: string;
  threadId: string;
  text: string;
  createdAt: number;
};
