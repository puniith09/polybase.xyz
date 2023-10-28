import React, { useState } from "react";
import "./styles.css";
import { Polybase } from "@polybase/client";
import { Auth } from "@polybase/auth";

export default function App() {
  const [createName, setCreateName] = useState("Sally");
  const [createEmoji, setCreateEmoji] = useState("emoji");
  const [createColor, setCreateColor] = useState("blue");
  const [recordId, setRecordId] = useState("");
  const [updateName, setUpdateName] = useState("");
  const [updateResult, setUpdateResult] = useState("");
  const [deleteResult, setDeleteResult] = useState("");

  const db = new Polybase({
    defaultNamespace:
      "pk/0xccfbdd6114b5cddb2e216affff8a0739acb39b01d3e94fe8a5e540c2f52d1c43d11740e1692e0c901898a64ecc40f6b8e41ed961f90d8ed697f9fcd487a567f8/quipeunfold"
  });
  const auth = new Auth();

  const create = async () => {
    const id = `${Date.now()}`;
    const name = createName;
    const emoji = createEmoji;
    const color = createColor;

    if (!name) return alert("Name is required");

    const res = await db.collection("User").create([id, name, emoji, color]);

    setRecordId(id); // Update recordId state for other functions
    setUpdateName(name); // Update updateName state for the update function
    setUpdateResult(""); // Clear the updateResult
    setDeleteResult(""); // Clear the deleteResult

    document.getElementById("create").innerText = JSON.stringify(
      res.data,
      null,
      4
    );
  };

  const get = async () => {
    document.getElementById("get").innerText = "";

    const res = await db.collection("User").record(recordId).get();

    document.getElementById("get").innerText = JSON.stringify(
      res.data,
      null,
      2
    );
  };

  const update = async () => {
    setUpdateResult("Loading...");

    const id = recordId;

    const res = await db
      .collection("User")
      .record(id)
      .call("setName", [updateName]);

    setUpdateResult(JSON.stringify(res.data, null, 2));
  };

  const del = async () => {
    setDeleteResult("Deleting record...");

    const res = await db.collection("User").record(recordId).call("del");

    setDeleteResult("Record deleted");
  };

  return (
    <div>
      <h3>Create Record</h3>
      <input
        id="create-name"
        placeholder="name"
        value={createName}
        onChange={(e) => setCreateName(e.target.value)}
      />
      <input
        id="create-emoji"
        placeholder="emoji"
        value={createEmoji}
        onChange={(e) => setCreateEmoji(e.target.value)}
      />
      <input
        id="create-color"
        placeholder="color"
        value={createColor}
        onChange={(e) => setCreateColor(e.target.value)}
      />
      <button onClick={create}>Create</button>
      <code>
        <pre id="create"></pre>
      </code>

      <h3>Get Record</h3>
      <input
        id="record-get"
        value={recordId}
        placeholder="record id"
        onChange={(e) => setRecordId(e.target.value)}
      />
      <button onClick={get}>Get</button>
      <code>
        <pre id="get"></pre>
      </code>

      <h3>Update Record</h3>
      <input
        id="record-update"
        value={recordId}
        placeholder="record id"
        onChange={(e) => setRecordId(e.target.value)}
      />
      <input
        id="name"
        value={updateName}
        placeholder="name"
        onChange={(e) => setUpdateName(e.target.value)}
      />
      <button onClick={update}>Update</button>
      <code>
        <pre id="update">{updateResult}</pre>
      </code>

      <h3>Delete Record</h3>
      <input
        id="record-del"
        value={recordId}
        placeholder="record id"
        onChange={(e) => setRecordId(e.target.value)}
      />
      <button id="delete-btn" onClick={del}>
        Delete
      </button>
      <code>
        <pre id="delete">{deleteResult}</pre>
      </code>
    </div>
  );
}
