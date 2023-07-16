"use strict";
const listContiner = document.querySelector("[data-lists]");
const form = document.querySelector("[data-form]");
const formInput = document.querySelector("[data-form-input]");
const LOCAL_SOTREGE_LIST_KEY = "taks.listis";
const LOCAL_SOTREGE_SELECTED_LIST_ID = "taks.selectedListId";
const deleteBtn = document.querySelector("[data-delete-btn]");
const todoContiner = document.querySelector("[data-todo-list]");
const todoTitle = document.querySelector("[data-todo-titile]");
const todoCount = document.querySelector("[data-count]");
const tasksContiner = document.querySelector("[data-tasks]");
const template = document.getElementById("task-templata");
const taskForm = document.querySelector("[data-task-form]");
const inputTasks = document.querySelector("[data-task-input]");
const removeComplete = document.querySelector("[data-delete-complete-tasks]");

let selectedListId = localStorage.getItem(LOCAL_SOTREGE_SELECTED_LIST_ID);
let lists = JSON.parse(localStorage.getItem(LOCAL_SOTREGE_LIST_KEY)) || [];

listContiner.addEventListener("click", (e) => {
  if (!e.target.classList.contains("list-name")) return;
  selectedListId = e.target.dataset.listId;
  saveAndRender();
});

tasksContiner.addEventListener("click", (e) => {
  if (e.target.tagName.toLowerCase() === "input") {
    const selectedList = lists.find((e) => e.id === selectedListId);
    const selectedTask = selectedList.tasks.find(
      (task) => task.id === e.target.id
    );
    selectedTask.complete = e.target.checked;
    save();
    renderTaskCount(selectedList);
  }
});

deleteBtn.addEventListener("click", () => {
  lists = lists.filter((list) => list.id !== selectedListId);
  selectedListId = null;
  saveAndRender();
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const listName = formInput.value; //name
  if (listName == null || listName === "") return;
  const list = createList(listName);
  lists.push(list);
  saveAndRender();
  formInput.value = null;
});

taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const taskName = inputTasks.value; //name
  if (taskName == null || taskName === "") return;
  const task = createTask(taskName);
  const selectedList = lists.find((list) => list.id === selectedListId);
  selectedList.tasks.push(task);
  inputTasks.value = null;
  saveAndRender();
});

removeComplete.addEventListener("click", () => {
  const selectedList = lists.find((list) => list.id === selectedListId);
  selectedList.tasks = selectedList.tasks.filter((e) => !e.complete);
  saveAndRender();
});

function createTask(taskName) {
  return {
    id: new Date().toString(),
    name: taskName,
    complete: false,
  };
}

function saveAndRender() {
  render();
  save();
}

function save() {
  localStorage.setItem(LOCAL_SOTREGE_LIST_KEY, JSON.stringify(lists));
  localStorage.setItem(LOCAL_SOTREGE_SELECTED_LIST_ID, selectedListId);
}

function createList(name) {
  return {
    id: new Date().toString(),
    name: name,
    tasks: [],
  };
}

function render() {
  clearElement(listContiner);
  renderList();
  const selectedList = lists.find((list) => list.id === selectedListId);
  if (selectedListId == null) {
    todoContiner.style.display = "none";
  } else {
    todoContiner.style.display = "";
    todoTitle.innerText = selectedList.name;
    renderTaskCount(selectedList);
    clearElement(tasksContiner);
    renderTasks(selectedList);
  }
}

function renderTasks(selectedList) {
  selectedList.tasks.forEach((task) => {
    const taskElement = document.importNode(template.content, true);
    const checkBox = taskElement.querySelector("input");
    checkBox.id = task.id;
    checkBox.checked = task.complete;
    const label = taskElement.querySelector("label");
    label.htmlFor = task.id;
    label.append(task.name);
    tasksContiner.appendChild(taskElement);
  });
}

function renderTaskCount(selectedList) {
  const inCompleteTasksCount = selectedList.tasks.filter(
    (task) => !task.complete
  ).length;
  const taskString = inCompleteTasksCount == 1 ? "Task" : "Tasks";
  todoCount.innerText = `${inCompleteTasksCount} ${taskString} remaining`;
}

function renderList() {
  lists.forEach((list) => {
    const listElment = document.createElement("li");
    listElment.dataset.listId = list.id;
    listElment.classList.add("list-name");
    if (selectedListId === list.id) {
      listElment.classList.add("active-list");
    }
    listElment.innerText = list.name;
    listContiner.appendChild(listElment);
  });
}
function clearElement(list) {
  while (list.firstChild) {
    list.removeChild(list.firstChild);
  }
  // list.forEach((e) => list.removeChild(e)); this delete all childs
}
render();
