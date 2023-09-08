import express from "express";
import bodyParser from "body-parser";
import favicon from "serve-favicon";
import path from "path";
import { fileURLToPath } from 'url';

const app = express();
const port = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const movies = [];
const tvshows = [];

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(favicon(path.join(__dirname, 'public', 'assets', 'favicon.ico')));

// Middleware to set the currentPage variable
app.use((req, res, next) => {
  res.locals.currentPage = req.path.substring(1); // Extract the current page from the request path
  next();
});

app.get("/", (req, res) => {
  // Render the index page with an empty array (common tasks or no tasks)
  res.render("index.ejs", { tasks: [] });
});

app.post("/addTask", (req, res) => {
  const newTaskName = req.body.task;
  const newTask = { name: newTaskName, completed: false };

  // Determine whether to add to movies or tvshows based on the route
  if (req.headers.referer && req.headers.referer.includes("/movies")) {
    movies.push(newTask);
    res.redirect("/movies");
  } else if (req.headers.referer && req.headers.referer.includes("/tvshows")) {
    tvshows.push(newTask);
    res.redirect("/tvshows");
  } else {
    // Handle other routes or redirect appropriately
    res.redirect("/");
  }
});

app.post("/deleteTask", (req, res) => {
  const taskId = req.body.taskId;

  // Determine whether to delete from movies or tvshows based on the route
  if (req.headers.referer && req.headers.referer.includes("/movies")) {
    // Handle deleting from movies array
    if (!isNaN(taskId) && taskId >= 0 && taskId < movies.length) {
      movies.splice(taskId, 1);
      res.sendStatus(200);
    } else {
      res.sendStatus(400);
    }
  } else if (req.headers.referer && req.headers.referer.includes("/tvshows")) {
    // Handle deleting from tvshows array
    if (!isNaN(taskId) && taskId >= 0 && taskId < tvshows.length) {
      tvshows.splice(taskId, 1);
      res.sendStatus(200);
    } else {
      res.sendStatus(400);
    }
  } else {
    // Handle other routes or return an error
    res.sendStatus(400);
  }
});

app.post("/completeTask", (req, res) => {
  const taskId = req.body.taskId;
  const isCompleted = req.body.isCompleted === "true"; // Convert the string to a boolean

  // Determine whether to mark as completed in movies or tvshows based on the route
  if (req.headers.referer && req.headers.referer.includes("/movies")) {
    // Handle marking as completed in movies array
    if (!isNaN(taskId) && taskId >= 0 && taskId < movies.length) {
      movies[taskId].completed = isCompleted;
      res.sendStatus(200);
    } else {
      res.sendStatus(400);
    }
  } else if (req.headers.referer && req.headers.referer.includes("/tvshows")) {
    // Handle marking as completed in tvshows array
    if (!isNaN(taskId) && taskId >= 0 && taskId < tvshows.length) {
      tvshows[taskId].completed = isCompleted;
      res.sendStatus(200);
    } else {
      res.sendStatus(400);
    }
  } else {
    // Handle other routes or return an error
    res.sendStatus(400);
  }
});



app.get("/movies", (req, res) => {
  res.render("movies.ejs", { tasks: movies });
});

app.get("/tvshows", (req, res) => {
  res.render("tvshows.ejs", { tasks: tvshows });
});


app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});