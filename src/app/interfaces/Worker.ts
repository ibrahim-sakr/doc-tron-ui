export interface Worker {
  type: string;
  url?: string;
  body?: string;
  host?: string;
  port?: string;
  username?: string;
  password?: string;
  command?: string;
  privateKey?: string;
  passphrase?: string;
}
