let addInput = document.querySelector(".controll__addInput"),
  addBtn = document.querySelector(".controll__addBtn"),
  list = document.querySelector(".todoList");

let checkAll = document.querySelector(".checkAll"),
  importantAll = document.querySelector(".importantAll"),
  deleteAll = document.querySelector(".deleteAll"),
  deleteChecked = document.querySelector(".deleteChecked");

let todoList = [];

if (localStorage.getItem("todo")) {
  todoList = JSON.parse(localStorage.getItem("todo"));
  displayMessages();
}

function checkEmptyList() {
  if (todoList.length == 0) list.innerHTML = "It`s empty here!";
}
window.addEventListener("load", checkEmptyList);

addBtn.addEventListener("click", function () {
  if (addInput.value == "" || !addInput.value.trim()) {
    alert("Wrtite smthng");
    return;
  }
  let newTodo = {
    todo: addInput.value,
    checked: false,
    important: false,
  };

  todoList.push(newTodo);

  displayMessages();

  let deleteBtn = document.querySelectorAll(".delete");
  for (let i = 0; i < deleteBtn.length; i++) {
    todoList[i].id = deleteBtn[i].getAttribute("id").slice(7);
  }
  localStorage.setItem("todo", JSON.stringify(todoList));
});

list.addEventListener("change", makeDoneMessage);

let importantBtn = document.querySelectorAll(".todoList__importantBtn");
importantBtn.forEach((item) => {
  item.addEventListener("click", makeImportantMessage);
});

let deleteItemBtn = document.querySelectorAll(".todoList__deleteBtn");
deleteItemBtn.forEach((item) => {
  item.addEventListener("click", deleteMessage);
});

let formSubmit = document.querySelector(".form__submit"),
  formInputBx = document.querySelector("form__input");

//
//
// FUNCTIONS
function displayMessages() {
  let displayMessage = "";
  todoList.forEach(function (item, i) {
    displayMessage += `
    <li id='todoList-item-${i}' class='todoList__item'>
      <input type='checkbox' id='item_${i}' ${item.checked ? "checked" : ""}>
      <label for='item_${i}' class="item_${i}">${item.todo}</label>
      <button id='important_${i}' class='todoList__importantBtn'>!</button>
      <button id='delete_${i}' class='todoList__deleteBtn'>X</button>
    </li>
    `;
    list.innerHTML = displayMessage;
  });
}

function makeDoneMessage(e) {
  let idInput = e.target.getAttribute("id");
  let forLabel = list.querySelector("[for=" + idInput + "]");
  let valueLabel = forLabel.innerHTML;

  let li = e.target.parentNode;

  todoList.forEach(function (item) {
    if (item.todo === valueLabel) {
      item.checked = !item.checked;

      if (item.checked == true) li.classList.add("doneMsg");
      else li.classList.remove("doneMsg");

      localStorage.setItem("todo", JSON.stringify(todoList));
    }
  });
}

function makeImportantMessage(e) {
  let idImportant = e.target.getAttribute("id");
  let idImportantNum = idImportant.slice(10);

  let li = e.target.parentNode;

  todoList.forEach(function (item, i) {
    if (i == idImportantNum) {
      item.important = !item.important;

      if (item.important) li.classList.add("importantMsg");
      else li.classList.remove("importantMsg");

      localStorage.setItem("todo", JSON.stringify(todoList));
    }
  });
}

function deleteMessage(e) {
  let idDelete = e.target.getAttribute("id");
  let idDeleteNum = idDelete.slice(7);

  let li = e.target.parentNode;

  todoList.forEach(function (item, i) {
    if (item.id == idDeleteNum) {
      li.remove();
      todoList.splice(i, 1);

      localStorage.setItem("todo", JSON.stringify(todoList));
    }
  });

  checkEmptyList();
}

function checkImportant() {
  let li = list.querySelectorAll(".todoList li");
  todoList.forEach((item) => {
    for (let i = 0; i < li.length; i++)
      if (item.important && item.id == li[i].getAttribute("id").slice(14))
        li[i].classList.add("importantMsg");
  });
}
window.addEventListener("load", checkImportant);

function checkDone() {
  let label = list.querySelectorAll("label");
  todoList.forEach((item) => {
    for (let i = 0; i < label.length; i++)
      if (item.checked && item.id == label[i].getAttribute("class").slice(5))
        label[i].parentNode.classList.add("doneMsg");
  });
}
window.addEventListener("load", checkDone);

/////////////////////
//// BUTTONS ALL ////
/////////////////////
checkAll.addEventListener("click", function () {
  todoList.forEach(function (item) {
    if (item.checked == false) item.checked = true;
    localStorage.setItem("todo", JSON.stringify(todoList));
  });
});

importantAll.addEventListener("click", function () {
  todoList.forEach(function (item) {
    if (item.important == false) item.important = true;
    localStorage.setItem("todo", JSON.stringify(todoList));
  });
});

deleteAll.addEventListener("click", function () {
  localStorage.clear();
  location.reload();
});

deleteChecked.addEventListener("click", function () {
  todoList.forEach((item, i) => {
    if (item.checked) {
      todoList.splice(i, 1);
      localStorage.setItem("todo", JSON.stringify(todoList));
    }
  });
});
