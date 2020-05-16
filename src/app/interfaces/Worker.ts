export interface Worker {
  type: string;
  url?: string;
  args?: {[key: string]: any};
  host?: string;
  port?: string;
  username?: string;
  password?: string;
  command?: string;
  privateKey?: string;
  passphrase?: string;
}
