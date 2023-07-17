# Lets talk requirements

## Notebook

Can contain multiple notes,
Each notebook will just have a unique id, and a name, and a list of notes
Single note book can have multiple notes

Users can create, edit, delete notebook

## Note

Each note will have a unique id, a title, a content, a notebook id and a list of tag ids
Single note can only belong to one notebook
Single note can have multiple tags

Users can create, edit, delete note

## Tag

Each tag will have a unique id, a name, and a list of note ids

Single tag can have multiple notes
Single note can have multiple tags

Users can create, edit, delete tag

## Let's make relationship between them

This is the format to use to form relation

```js
db.setSchema([
  {
    singular: "post",
    plural: "posts",
    relations: {
      author: { belongsTo: "author" },
      comments: { hasMany: "comment" },
    },
  },
  {
    singular: "author",
    plural: "authors",
    relations: {
      posts: { hasMany: "post" },
    },
  },
  {
    singular: "comment",
    plural: "comments",
    relations: {
      post: { belongsTo: "post" },
    },
  },
]);
```

Now give me the relation between notebook, note and tag

## Let's make the schema

```js
db.setSchema([
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
```

## Tasks to do

- use proper layout system for whole app rather than having everything in page file
- add loading components to all place

- Proper onboarding flow for user
- Smooth Transition from one note to other or even one notebook to other or tags

- Add a feedback button in bottom right corner to github issue
- Mobile ui for sidebar
- Add a search bar in sidebar just like notion search with note, tags, notebooks

- there is a loading state so take care of it in production it seems to be serious issue there

- redirect the user to notes page if there are notes available
