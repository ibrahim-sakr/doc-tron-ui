import {Worker} from './Worker';

export interface Job {
  id?: number;
  name: string;
  description?: string;
  in_progress?: boolean;
  queued: boolean;
  scheduled: string;
  next_run?: Date;
  worker: Worker;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
}
