export type Lesson = {
  id: number;
  title?: string;
  start: string;
  studentId?: number;
  end: string;
  studentName: string;
  price?: number;
  isPaid?: boolean;
  isCancelled?: boolean;
  notes?: string;
};
