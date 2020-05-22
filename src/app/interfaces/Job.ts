import {Worker} from './Worker';
import {Log} from './Log';

export interface Job {
  id?: number;
  name?: string;
  description?: string;
  in_progress?: boolean;
  queued?: boolean;
  scheduled?: string;
  next_run?: Date;
  worker?: Worker;
  logs?: Log[];
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
}
