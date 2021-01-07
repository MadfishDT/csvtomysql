export interface iConfigFileInfo {
  host: string;
  user: string;
  password: string;
  database: string;
  table: string;
  csv: string;
  mode: "update" | "insert";
  keys?: string[];
}

export interface iDBInfo {
  host?: string;
  user?: string;
  password?: string;
  database?: string;
}

export interface iCSVFileInfo {
  path?: string;
  keyField?: string;
  keyDBField?: string;
  keyDBTable?: string;
  row?: any[];
  updateField?: string;
  updateDBField?: string;
}
