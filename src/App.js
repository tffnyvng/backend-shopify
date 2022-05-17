import "./App.css";
import React, { useState, useEffect } from "react";

function App() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    name: "",
    location: "N/A",
  });

  //Storing the inputs into state
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    console.log("form", form);
  }

  //Adding a new item into inventory
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
      setItems([...items, newItem]);
      return newItem;
    } catch (err) {
      console.error(err);
    }
  }

  //Editing the item

  const editpage = document.getElementById("editpage");
  const overlay = document.getElementById("overlay");

  async function openEditPage(e) {
    e.preventDefault();

    if (editpage === null) return;
    editpage.classList.add("active");
    overlay.classList.add("active");
  }

  async function closeEditPage(e) {
    e.preventDefault();

    if (editpage === null) return;
    editpage.classList.remove("active");
    overlay.classList.remove("active");
  }

  async function completeEdit(id) {
    try {
      const response = await fetch(`http://localhost:4000/items/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      console.log({ data });

      closeEditPage();
    } catch (err) {
      console.error(err);
    }
  }

  //Getting all items from inventory & storing them into state
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
      } catch (err) {
        console.error(err);
      }
    }

    getItems();
  }, []);

  //Deleting item

  async function deleteItem(id) {
    let answer = false;

    answer = window.confirm("Are you sure you want to delete this item?");

    if (answer) {
      try {
        const response = await fetch(`http://localhost:4000/items/${id}`, {
          method: "DELETE",
        });

        const data = await response.json();
      } catch (err) {
        console.error(err);
      }
    }
  }

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
              const { name, location, id } = item;

              return (
                <ul key={id}>
                  <li>Item: {name}</li>
                  <li>Location: {location}</li>
                  <button onClick={openEditPage}>Edit</button>
                  <div className="editpage" id="editpage">
                    <label>Name: </label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                    ></input>
                    <label>Location:</label>
                    <input
                      name="location"
                      value={form.location}
                      onChange={handleChange}
                    ></input>
                    <button
                      onClick={() => completeEdit(id)}
                      className="complete"
                    >
                      Complete
                    </button>
                    <button onClick={closeEditPage} className="cancel">
                      Cancel
                    </button>
                  </div>
                  <div id="overlay"></div>
                  <button onClick={() => deleteItem(id)}>Delete</button>
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
