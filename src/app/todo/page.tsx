// AddTodo.js
"use client";

import React, { useState } from "react";
import { useAllDocs, usePouch } from "use-pouchdb";

export default function AddTodo() {
  const db = usePouch(); // get the database

  const [input, setInput] = useState("");

  const handleAddTodo = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const doc = {
      _id: new Date().toJSON(), // give the document a unique id
      type: "todo",

      text: input,
      done: false,
    };

    const res = await db.put(doc); // put the new document into the database

    console.log(res);

    setInput("");
  };

  return (
    <form onSubmit={handleAddTodo}>
      <input
        type="text"
        value={input}
        className="border-2 border-gray-300 rounded-md w-full  max-w-lg p-4 m-4"
        minLength={1}
        onChange={(event) => {
          setInput(event.target.value);
        }}
      />

      <button>Add Todo</button>
      <ListTodos />
    </form>
  );
}

export const ListTodos = () => {
  const { rows: todos, loading } = useAllDocs({
    include_docs: true,
  });
  return (
    <div className="m-4">
      <p className="text-xl capitalize">list todos</p>
      {loading && <div>loading...</div>}
      {todos.map((todo) => (
        <Todo key={todo.id} todo={todo.doc} />
      ))}
    </div>
  );
};

export const Todo = ({ todo }: { todo: any }) => {
  const db = usePouch();

  const update = async () => {
    const doc = (await db.get(todo._id)) as any;

    // check if the UI state matches the state in the database.
    if (doc.done === todo.done) {
      doc.done = !doc.done; // Update the doc.

      try {
        await db.put(doc); // And put the new version into the database.
      } catch (err) {
        //@ts-ignore
        if (err.name === "conflict") {
          update(); // There was a conflict, try again.
        } else {
          console.error(err); // Handle other errors.
        }
      }
    }
  };

  return (
    <div className="space-x-2">
      <input type="checkbox" checked={todo.done} onChange={update} />
      <span>{todo.text}</span>
    </div>
  );
};
