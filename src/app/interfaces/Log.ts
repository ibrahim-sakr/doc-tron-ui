import {Job} from './Job';

export interface Log {
  id: number;
  job_id: number;
  status: string;
  output?: string;
  error?: string;
  job?: Job;
  started_at: Date;
  finished_at: Date;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
}
