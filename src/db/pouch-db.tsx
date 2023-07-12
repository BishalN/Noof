"use client";

import PouchDB from "pouchdb-browser";

import find from "pouchdb-find";
import rel from "relational-pouch";

PouchDB.plugin(find).plugin(rel);

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
