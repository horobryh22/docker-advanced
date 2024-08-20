import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HOST = process.env.REACT_APP_HOST || 'http://localhost:3002';

function App() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState('');

  // Получение всех элементов из базы данных
  useEffect(async () => {
    const fetchItems = async () => {
      try {
        const response = await axios.get(`${HOST}/api/items`);
        setItems(response.data);
      } catch (err) {
        console.error('Error fetching items:', err);
      }
    };

    await fetchItems();
  }, []);

  // Добавление нового элемента
  const addItem = async () => {
    try {
      const response = await axios.post(`${HOST}/api/items`, { name });
      setItems([...items, response.data]);
      setName('');
    } catch (err) {
      console.error('Error adding item:', err);
    }
  };

  // Удаление элемента
  const deleteItem = async (id) => {
    try {
      await axios.delete(`${HOST}/api/items/${id}`);
      setItems(items.filter(item => item.id !== id));
    } catch (err) {
      console.error('Error deleting item:', err);
    }
  };

  // Начало редактирования элемента
  const startEdit = (item) => {
    setEditId(item.id);
    setEditName(item.name);
  };

  // Завершение редактирования элемента
  const updateItem = async () => {
    try {
      const response = await axios.put(`${HOST}/api/items/${editId}`, { name: editName });
      setItems(items.map(item => (item.id === editId ? response.data : item)));
      setEditId(null);
      setEditName('');
    } catch (err) {
      console.error('Error updating item:', err);
    }
  };

  return (
      <div className="App">
        <h1>Item List</h1>

        {/* Форма добавления нового элемента */}
        <div>
          <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter item name"
          />
          <button onClick={addItem}>Add Item</button>
        </div>

        {/* Список элементов */}
        <ul>
          {items.map(item => (
              <li key={item.id}>
                {item.id === editId ? (
                    <div>
                      <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                      />
                      <button onClick={updateItem}>Save</button>
                      <button onClick={() => setEditId(null)}>Cancel</button>
                    </div>
                ) : (
                    <div>
                      {item.name}
                      <button onClick={() => startEdit(item)}>Edit</button>
                      <button onClick={() => deleteItem(item.id)}>Delete</button>
                    </div>
                )}
              </li>
          ))}
        </ul>
      </div>
  );
}

export default App;
