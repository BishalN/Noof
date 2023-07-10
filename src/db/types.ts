export type Note = {
  id: string;
  name: string;
  content: any;
  rev: string;
  // Relations
  // this will be notebookid
  notebook?: string;
  // this will be tagids
  tags?: string[];
};

export type Notebook = {
  id: string;
  name: string;
  rev: string;
  // Relations
  // this will be noteids
  notes?: string[];
};

export type Tag = {
  id: string;
  name: string;
  rev: string;
  // Relations
  // this will be noteids
  notes?: string[];
};
