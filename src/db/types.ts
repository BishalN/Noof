export type Note = {
  id: string;
  name: string;
  content: any;
  type: "note";
  rev: string;
  // Relations
  // this will be notebookid
  notebook?: string;
  // this will be tagids
  tags: string[];
};

export type Notebook = {
  id: string;
  name: string;
  type: "notebook";
  rev: string;
  // Relations
  // this will be noteids
  notes: string[];
};

export type Tag = {
  id: string;
  name: string;
  type: "tag";
  rev: string;
  // Relations
  // this will be noteids
  notes: string[];
};
