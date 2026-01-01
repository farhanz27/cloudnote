import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { useAuthenticator } from '@aws-amplify/ui-react';

const client = generateClient<Schema>();

function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const [newTodo, setNewTodo] = useState("");
  const { signOut, user } = useAuthenticator();

  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }, []);

  function createTodo(e: React.FormEvent) {
    e.preventDefault();
    if (newTodo.trim()) {
      client.models.Todo.create({ content: newTodo.trim() });
      setNewTodo("");
    }
  }

  function deleteTodo(id: string) {
    client.models.Todo.delete({ id });
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <h1>CloudNote</h1>
          <p className="welcome-text">Welcome back, {user?.signInDetails?.loginId || 'User'}!</p>
        </div>
        <button className="sign-out-btn" onClick={signOut}>
          Sign Out
        </button>
      </header>

      <main className="main-content">
        <div className="todo-card">
          <h2 className="card-title">My Todos</h2>
          
          <form onSubmit={createTodo} className="todo-form">
            <div className="input-group">
              <input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                placeholder="Add a new todo..."
                className="todo-input"
              />
              <button type="submit" className="add-btn">
                <span className="add-icon">+</span>
                Add
              </button>
            </div>
          </form>

          {todos.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📝</div>
              <p className="empty-text">No todos yet. Create your first one above!</p>
            </div>
          ) : (
            <ul className="todo-list">
              {todos.map((todo) => (
                <li key={todo.id} className="todo-item">
                  <span className="todo-content">{todo.content}</span>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="delete-btn"
                    aria-label="Delete todo"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
