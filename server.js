const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
const PORT = 5000;
const DATA_FILE = "todos.json";

app.use(express.json());
app.use(cors());

// Load existing To-Dos
const loadToDos = () => {
    if (!fs.existsSync(DATA_FILE)) return [];
    return JSON.parse(fs.readFileSync(DATA_FILE));
};

// Save To-Dos
const saveToDos = (todos) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(todos, null, 2));
};

// Get all To-Dos
app.get("/todos", (req, res) => {
    res.json(loadToDos());
});

// Add a new To-Do
app.post("/todos", (req, res) => {
    const todos = loadToDos();
    const newToDo = { id: Date.now(), ...req.body, completed: false };
    todos.push(newToDo);
    saveToDos(todos);
    res.json(newToDo);
});

// Edit a To-Do
app.put("/todos/:id", (req, res) => {
    let todos = loadToDos();
    todos = todos.map(todo =>
        todo.id == req.params.id ? { ...todo, ...req.body } : todo
    );
    saveToDos(todos);
    res.json({ message: "To-Do updated!" });
});

// Delete a To-Do
app.delete("/todos/:id", (req, res) => {
    let todos = loadToDos();
    todos = todos.filter(todo => todo.id != req.params.id);
    saveToDos(todos);
    res.json({ message: "To-Do deleted!" });
});

// Toggle To-Do status
app.patch("/todos/:id/toggle", (req, res) => {
    let todos = loadToDos();
    todos = todos.map(todo =>
        todo.id == req.params.id ? { ...todo, completed: !todo.completed } : todo
    );
    saveToDos(todos);
    res.json({ message: "To-Do status updated!" });
});

// Start the server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
