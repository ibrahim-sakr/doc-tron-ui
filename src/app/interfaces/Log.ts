export interface Log {
  id: number;
  job_id: number;
  status: string;
  output?: string;
  error?: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
}
