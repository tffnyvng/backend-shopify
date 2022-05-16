// import "./App.css";
import React, { useState, useEffect } from "react";

function App() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    name: "",
    location: "N/A",
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    console.log("form", form);
  }

  async function handleCreate(e) {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:4000/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const newItem = await response.json();
      return newItem;
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    async function getItems() {
      try {
        const response = await fetch("http://localhost:4000/items", {
          headers: {
            "Content-Type": "application/json",
          },
        });

        const items = await response.json();
        setItems(items);
        console.log(items);
      } catch (err) {
        console.error(err);
      }
    }

    getItems();
  }, []);

  return (
    <section>
      <form>
        <label>New item:</label>
        <input name="name" value={form.name} onChange={handleChange}></input>
        <label>Location:</label>
        <input
          name="location"
          value={form.location}
          onChange={handleChange}
        ></input>
        <button id="create" onClick={handleCreate}>
          Add new item
        </button>
        <section>
          <label>Items in inventory:</label>
          {items &&
            items.map((item) => {
              const { name, id } = item;

              return (
                <ul key={id}>
                  <li>
                    {name}
                    <button>Edit</button>
                    <button>Delete</button>
                  </li>
                </ul>
              );
            })}
        </section>
      </form>
      {/* <div>Hello</div> */}
    </section>
  );
}

export default App;
