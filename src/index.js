const express = require('express');
const { v4: uuidV4 } = require('uuid')
const app = express();

app.use(express.json());

const users = [];

function verifyUserExist(req, res, next) {
  const { username } = req.headers

  const user = users.find(user => user.username === username);
  
  if (!user) {
    return res.status(400).json({ error: "User not found." })
  }

  req.user = user;
  
  return next();
}

app.post('/users', (req, res) => {
  const { name, username, } = req.body;

  const userExist = users.some(user => user.username === username);
  
  if (userExist) {
      return res.json({ error: "User already exist." })
  }

  users.push({
      id: uuidV4(),
      name,
      username,
      todos: [],
  })

  return res.status(201).json(users);
})

app.get('/user', verifyUserExist, (req, res) => {
  const { user } = req;
  
  return res.json(user);
})

app.post('/todos', verifyUserExist, (req, res) => {
  const { tittle, done } = req.body;
  const { user } = req;
  
  const todoExist = user.todos.find(
    todo => todo.tittle === tittle
  )

  if (todoExist) {
    return res.status(404).json({ error: "Todo alread exist." })
  }

  const todo = {
    id: uuidV4(),
    tittle,
    done,
    deadline: new Date(),
    created_at: new Date(),
  }

  user.todos.push(todo);

  return res.status(201).send();
})

app.get('/todos', verifyUserExist, (req, res) => {
  const { user } = req;

  return res.json({ todos: user.todos });
})

app.put('/todos/:id', verifyUserExist, (req, res) => {
  const { user } = req;
  const { id } = req.params;
  const { tittle, deadline } = req.body;

  const todo = user.todos.find(todo => todo.id === id)

  if (!todo) {
    return res.status(404).json({ error: "Todo not found." })
  }

  todo.tittle = tittle;
  todo.deadline = new Date(deadline);
  
  return res.status(201).send();
})

app.patch('/todos/:id/done', verifyUserExist, (req, res) => {
  const { user } = req;
  const { id } = req.params;
  const { done } = req.body;

  const todo = user.todos.find(todo => todo.id === id);

  if (!todo) {
    return res.status(404).json({ error: "Todo not found." })
  }

  todo.done = done;

  return res.status(201).send();
})

app.delete('/todo/:id', verifyUserExist, (req, res) => {
  const { user } = req;
  const { id } = req.params;

  const todo = user.todos.find(todo => todo.id === id);

  if (!todo) {
    return res.status(404).json({ error: "Todo not found." })
  }

  user.todos.splice(todo, 1);

  return res.status(201).send();
})

app.listen(3000,() => console.log("Server on in port 3000"));