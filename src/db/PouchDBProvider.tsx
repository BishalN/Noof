"use client";

import React from "react";
import PouchDB from "pouchdb";

import find from "pouchdb-find";
import rel from "relational-pouch";

PouchDB.plugin(find).plugin(rel);

import { Provider } from "use-pouchdb";

const db = new PouchDB("noof");
export const reldb = db.setSchema([
  {
    singular: "notebook",
    plural: "notebooks",
    relations: {
      notes: { hasMany: "note" },
    },
  },
  {
    singular: "note",
    plural: "notes",
    relations: {
      notebook: { belongsTo: "notebook" },
      tags: { hasMany: "tag" },
    },
  },
  {
    singular: "tag",
    plural: "tags",
    relations: {
      notes: { hasMany: "note" },
    },
  },
]);

export const PouchDBProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <Provider pouchdb={reldb}>{children}</Provider>;
};
