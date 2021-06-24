let addInput = document.querySelector(".controll__addInput"),
  addBtn = document.querySelector(".controll__addBtn"),
  checkAll = document.querySelector(".checkAll"),
  importantAll = document.querySelector(".importantAll"),
  deleteAll = document.querySelector(".deleteAll"),
  deleteChecked = document.querySelector(".deleteChecked"),
  list = document.querySelector(".todoList"),
  body = document.querySelector("body");

let todoList = [];

window.addEventListener("load", checkList);
function checkList() {
  if (localStorage.getItem("todo")) {
    todoList = JSON.parse(localStorage.getItem("todo"));

    displayList();
  }
  checkDoneMsg();
  checkImpMsg();
  checkMsgColor();
  checkEmptyList();
  listenersOnListItem();

  // setColorOfMsg();
  setTimeout(setColorOfMsg, 1000);
}

function checkDoneMsg(e) {
  todoList.forEach((item, i) => {
    if (item.checked) {
      list.children[i].classList.add("doneMsg");
      list.children[i].children[0].setAttribute("checked", "");
    } else if (!item.checked) {
      list.children[i].classList.remove("doneMsg");
      list.children[i].children[0].removeAttribute("checked");
    }
  });
}
function checkImpMsg(e) {
  todoList.forEach((item, i) => {
    if (item.important) list.children[i].classList.add("importantMsg");
  });
}

function checkEmptyList() {
  let str = `<p class="empty">Sorry, it\`s empty here! 
    Please, add some tasks that You want to do.</p>`;

  if (todoList.length == 0) list.innerHTML = str;
}

function listenersOnListItem() {
  list.addEventListener("change", makeDoneMsg);

  let listItems = document.querySelectorAll(".todoList__item"),
    impBtn = document.querySelectorAll(".todoList__btn_important"),
    deleteBtn = document.querySelectorAll(".todoList__btn_delete");

  for (let i = 0; i < listItems.length; i++) {
    impBtn[i].addEventListener("click", makeImportantMsg);
    deleteBtn[i].addEventListener("click", deleteMsg);
  }
}

let bg = document.querySelector(".bg"),
  alertBx = document.querySelector(".alert"),
  alertText = document.querySelector(".alert__text");
function alertFn(str) {
  alertText.innerHTML = str;
  alertBx.classList.add("alert_active");
  addInput.setAttribute("disabled", "");
  setTimeout(hideAlert, 3000);
}
bg.addEventListener("click", hideAlert);
function hideAlert() {
  alertBx.classList.remove("alert_active");
  addInput.removeAttribute("disabled", "");
}

addBtn.addEventListener("click", addToList);
function addToList(e) {
  e.preventDefault();

  if (addInput.value == "" || !addInput.value.trim()) {
    alertFn("Write some text to add");
    return;
  }

  for (let i = 0; i < todoList.length; i++) {
    todoList[i].todo = todoList[i].todo.trim();
    addInput.value = addInput.value.replace(/\s+/g, " ").trim();

    if (todoList[i].todo === addInput.value) {
      alertFn("This task is already exist");
      addInput.value = "";
      return;
    }
  }

  let newTodo = {
    todo: addInput.value,
    checked: false,
    important: false,
    color: null,
  };

  todoList.push(newTodo);

  displayList();

  checkDoneMsg();
  checkImpMsg();
  checkEmptyList();
  checkMsgColor();
  checkDarkMode();

  setColorOfMsg();

  listenersOnListItem();

  addInput.value = "";

  localStorage.setItem("todo", JSON.stringify(todoList));
}

function displayList() {
  let displayMsg = "";
  todoList.forEach((item, i) => {
    displayMsg += `
    <li id="todoList_listItem_${i}" class="todoList__item">
      <input type="checkbox" id="todoList_item_${i}" class="todoList__checkbox" >
      <label for="todoList_item_${i}" class="todoList__customCheckbox"></label>
      <label for="todoList_item_${i}" class="todoList__label">${item.todo}</label>
      <div class='todoList__colors-icon'>
        <div class='todoList__colors'>
          <div class='todoList__color todoList__color_default'></div>
        </div>
      </div>
      <i id="todoList_importantBtn_${i}"  class="fas fa-exclamation todoList__btn todoList__btn_important"></i>
      <i id="todoList_deleteBtn_${i}" class="fas fa-trash todoList__btn todoList__btn_delete"></i>
    </li>
    `;

    // <button id="todoList_importantBtn_${i}" class="todoList__importantBtn"><i class="fas fa-exclamation"></i></button>
    //   <button id="todoList_deleteBtn_${i}" class="todoList__deleteBtn"><i class="fas fa-trash"></i></button>

    list.innerHTML = displayMsg;
  });
}

function setColorOfMsg() {
  // let colorArr = createColorsFn();
  let colorArr = [
    // "rgba(0, 0, 0, 0.1)",
    "rgb(0, 64, 255)",
    //"rgb(230, 25, 25)",
    "#ff8303",
    "#501072",
    "#fd055a",
    "#01b407",
    "#DFFF00",
    "#9514b1",
    "#700000",
  ];

  // let def = document.querySelectorAll(".todoList__color_default");
  // for (let i = 0; i < def.length; i++) {
  //   let defi = def[i].style.backgroundColor;
  //   if (defi == "rgba(0, 0, 0, 0.1)" || defi == "rgba(255, 255, 255, 0.1)")
  //     defi = null;
  //   // def[i].addEventListener("click", function () {
  //   //   this.removeAttribute("style");
  //   // });
  // }

  // if (body.classList.contains("darkMode"))
  //   colorArr[0] = "rgba(255, 255, 255, 0.1)";
  // else colorArr[0] = "rgba(0, 0, 0, 0.1)";

  let colorsBox = document.querySelectorAll(".todoList__colors");

  colorArr.forEach((item) => {
    for (let i = 0; i < colorsBox.length; i++) {
      let color = document.createElement("div");
      color.classList.add("todoList__color");
      color.style.backgroundColor = item;
      colorsBox[i].appendChild(color);
    }
  });

  let colors = document.querySelectorAll(".todoList__color");
  for (let i = 0; i < colors.length; i++) {
    colors[i].addEventListener("click", getColorFn);
  }
}
function getColorFn(e) {
  let getColor = window
    .getComputedStyle(this, null)
    .getPropertyValue("background-color");
  this.parentNode.parentNode.parentNode.style.backgroundColor = getColor;

  let id = e.target.parentNode.parentNode.parentNode
    .getAttribute("id")
    .split("_")[2];

  todoList.forEach((item, i) => {
    if (i == id) item.color = getColor;
    localStorage.setItem("todo", JSON.stringify(todoList));
  });
}
function checkMsgColor(e) {
  todoList.forEach((item, i) => {
    if (item.color) {
      list.children[i].style.backgroundColor = item.color;
    }

    if (
      item.color == "rgba(0, 0, 0, 0.1)" ||
      item.color == "rgba(255, 255, 255, 0.1)"
    ) {
      list.children[i].removeAttribute("style");
      item.color = null;
    }

    // let id = e.target.parentNode.parentNode.parentNode
    //   .getAttribute("id")
    //   .split("_")[2];
    // if (i == id) item.color = getColor;
    localStorage.setItem("todo", JSON.stringify(todoList));
  });
}

function makeDoneMsg(e) {
  let idInput = e.target.getAttribute("id");
  let forLabel = list.querySelector(".todoList__label[for=" + idInput + "]");
  let valueLabel = forLabel.innerHTML;

  e.target.parentNode.classList.toggle("doneMsg");

  todoList.forEach((item) => {
    if (item.todo === valueLabel) item.checked = !item.checked;

    localStorage.setItem("todo", JSON.stringify(todoList));
  });

  checkDoneMsg();
}

function makeImportantMsg(e) {
  e.target.parentNode.classList.toggle("importantMsg");

  let idImpMsg = e.target.getAttribute("id").split("_")[2];

  todoList.forEach((item, i) => {
    if (i == idImpMsg) item.important = !item.important;

    localStorage.setItem("todo", JSON.stringify(todoList));
  });
}

function deleteMsg(e) {
  let idDelBtn = e.target.getAttribute("id").split("_")[2],
    task = e.target.parentNode;

  todoList.forEach((item, i) => {
    if (i == idDelBtn) {
      todoList.splice(i, 1);
      task.remove();
      displayList();
      listenersOnListItem();
    }
    localStorage.setItem("todo", JSON.stringify(todoList));
  });

  checkDoneMsg();
  checkImpMsg();
  checkEmptyList();
  checkMsgColor();
  checkDarkMode();
}

checkAll.addEventListener("click", checkAllFn);
importantAll.addEventListener("click", importantAllFn);
deleteAll.addEventListener("click", deleteAllFn);
deleteChecked.addEventListener("click", deleteCheckedFn);

function checkAllFn(e) {
  e.preventDefault();
  todoList.forEach((item) => {
    if (!item.checked) item.checked = !item.checked;
    localStorage.setItem("todo", JSON.stringify(todoList));
  });
  checkDoneMsg();
  checkMsgColor();
}
function importantAllFn(e) {
  e.preventDefault();
  todoList.forEach((item) => {
    if (!item.important) item.important = !item.important;
    localStorage.setItem("todo", JSON.stringify(todoList));
  });
  checkImpMsg();
  checkMsgColor();
}
function deleteAllFn(e) {
  e.preventDefault();
  todoList.length = 0;
  localStorage.setItem("todo", JSON.stringify(todoList));
  checkEmptyList();
  checkMsgColor();
}
function deleteCheckedFn(e) {
  e.preventDefault();
  for (let i = todoList.length - 1; i >= 0; i--) {
    if (todoList[i].checked) {
      todoList.splice(i, 1);
      localStorage.setItem("todo", JSON.stringify(todoList));
    }
  }
  displayList();
  checkEmptyList();
  checkImpMsg();
  checkMsgColor();
  checkDarkMode();
  listenersOnListItem();
}

/////////// dark mode
let darkModeBtn = document.getElementById("darkMode"),
  tableStyleBtn = document.getElementById("tableStyle"),
  listStyleBtn = document.getElementById("listStyle"),
  settings = document.querySelector(".header__settings"),
  menu = document.querySelector(".menu"),
  task = document.getElementsByClassName("todoList__item");

let themeStyle = [],
  f;

settings.addEventListener("click", function () {
  menu.classList.toggle("menu_active");
});
document.addEventListener("click", function (e) {
  if (e.target != menu && e.target != settings && e.target.parentNode != menu)
    menu.classList.remove("menu_active");
});

window.addEventListener("load", function () {
  if (localStorage.getItem("theme")) {
    themeStyle = JSON.parse(localStorage.getItem("theme"));
  }
});

window.addEventListener("load", function () {
  let theme = {
    dark: false,
    listStyle: true,
    tableStyle: false,
  };

  themeStyle.push(theme);
  themeStyle.length = 1;

  f = themeStyle[0];

  checkDarkMode();
  checkMsgColor();
  checkListStyle();
  checkTableStyle();

  localStorage.setItem("theme", JSON.stringify(themeStyle));
});

darkModeBtn.addEventListener("click", makeDarkMode);
listStyleBtn.addEventListener("click", makeListStyle);
tableStyleBtn.addEventListener("click", makeTableStyle);

function makeDarkMode() {
  checkMsgColor();

  if (!f.dark) {
    f.dark = !f.dark;
  } else f.dark = !f.dark;
  checkDarkMode();
  // setColorOfMsg();
  localStorage.setItem("theme", JSON.stringify(themeStyle));
}
function makeListStyle() {
  if (!f.listStyle) f.listStyle = !f.listStyle;
  checkListStyle();
  localStorage.setItem("theme", JSON.stringify(themeStyle));
}
function makeTableStyle() {
  if (!f.tableStyle) f.tableStyle = !f.tableStyle;
  checkTableStyle();
  localStorage.setItem("theme", JSON.stringify(themeStyle));
}

function checkDarkMode() {
  if (f.dark) {
    body.classList.add("darkMode");
    darkModeBtn.classList.add("active_light");
    menu.classList.add("menu_dark");
    menu.classList.remove("menu_light");
  } else {
    body.classList.remove("darkMode");
    darkModeBtn.classList.remove("active_light");
    menu.classList.add("menu_light");
    menu.classList.remove("menu_dark");
  }

  for (let i = 0; i < task.length; i++) {
    if (f.dark) {
      task[i].classList.add("todoList__item_dark");
      task[i].classList.remove("todoList__item_light");
    } else {
      task[i].classList.remove("todoList__item_dark");
      task[i].classList.add("todoList__item_light");
    }
  }

  checkMsgColor();

  localStorage.setItem("theme", JSON.stringify(themeStyle));
}
function checkListStyle() {
  if (f.listStyle) {
    list.classList.add("listStyle");
    list.classList.remove("tableStyle");
    f.tableStyle = false;
  }
}
function checkTableStyle() {
  if (f.tableStyle) {
    list.classList.add("tableStyle");
    list.classList.remove("listStyle");
    f.listStyle = false;
  }
}

let preloaderBox = document.querySelector(".preloader__box");
let preloaderEl = `
  <div class='preloader__item'>
    <div class='preloader__circle'></div>
  </div>
`;
let preloaderElCount = 18;
let a = preloaderElCount;
while (a--) {
  preloaderBox.innerHTML += preloaderEl;
}

let preloaderItem = document.querySelectorAll(".preloader__item");
for (let i = 0; i < preloaderItem.length; i++) {
  let x = (360 / preloaderItem.length) * i;
  preloaderItem[i].style.transform = "translateY(-50%) rotate(" + x + "deg)";
}
let preloaderCircle = document.querySelectorAll(".preloader__circle");
let delay = 0;
let w = 0.6;
let q = w / preloaderElCount;

for (let i = 0; i < preloaderCircle.length; i++) {
  delay += q;
  preloaderCircle[i].style.animationDelay = delay + "s"; //задержка
  preloaderCircle[i].style.animationDuration = w + "s"; // длительность
}

window.addEventListener("load", () => {
  setTimeout(() => {
    let preloader = document.querySelector(".preloader");
    preloader.style = "opacity: 0; z-index: -1";
  }, 2000);
});
