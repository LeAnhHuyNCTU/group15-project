import React, { useState } from 'react';
import './App.css';
import UserList from './components/UserList';
import AddUser from './components/AddUser';

function App() {
  const [refresh, setRefresh] = useState(0);

  const handleUserAdded = () => {
    setRefresh(refresh + 1); // Trigger re-render
  };

  return (
    <div className="App">
      <h1>Quản lý User</h1>
      <AddUser onUserAdded={handleUserAdded} />
      <UserList key={refresh} />
    </div>
  );
}

export default App;
