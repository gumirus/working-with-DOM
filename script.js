function renderTask2(parent, task) {
    let str = `<div class="task-item" data-task-id="${task.id}">
<div class="task-item__main-container">
  <div class="task-item__main-content">
    <form class="checkbox-form">
      <input class="checkbox-form__checkbox" type="checkbox" id="task-${task.id}">
      <label for="task-${task.id}"></label>
    </form>
    <span class="task-item__text">${task.text}</span>
  </div>
  <button class="task-item__delete-button default-button delete-button" data-delete-task-id="${task.id}">
    Удалить
  </button>
</div>
</div>`;
    parent.insertAdjacentHTML("beforeend", str);
    // Навесить обработчики на новую строку
    // parent.lastElementChild.querySelector(".checkbox-form__checkbox").onchange = checkbox_change;
    // parent.lastElementChild.querySelector(".task-item__delete-button").onclick = delete_click;
}
 
function renderTask(parent, task) {
    let div1 = document.createElement("div"),
        div2 = document.createElement("div"),
        div3 = document.createElement("div"),
        form = document.createElement("form"),
        input = document.createElement("input"),
        label = document.createElement("label"),
        span = document.createElement("span"),
        button = document.createElement("button");
    div1.className = "task-item";
    div1.dataset.taskId = task.id;
    div2.className = "task-item__main-container";
    div3.className = "task-item__main-content";
    form.className = "checkbox-form";
    input.className = "checkbox-form__checkbox";
    input.type = "checkbox";
    input.id = "task-" + task.id;
    label.htmlFor = "task-" + task.id;
    span.className = "task-item__text";
    span.innerText = task.text;
    button.className = "task-item__delete-button default-button delete-button";
    button.dataset.deleteTaskId = task.id; // Исправлено
    button.textContent = " Удалить ";
    form.append(input, " ", label);
    div3.append(form, " ", span);
    div2.append(div3, " ", button)
    div1.append(div2);
 
    parent.append(div1);
    // Навесить обработчики на новую строку
    // input.onchange = checkbox_change;
    // button.onclick = delete_click;
}
 
function renderModal(parent) {
    let str = `<div class="modal-overlay modal-overlay_hidden">
<div class="delete-modal">
  <h3 class="delete-modal__question">
    Вы действительно хотите удалить эту задачу?
  </h3>
  <div class="delete-modal__buttons">
    <button class="delete-modal__button delete-modal__cancel-button">
      Отмена
    </button>
    <button class="delete-modal__button delete-modal__confirm-button">
      Удалить
    </button>
  </div>
</div>
</div>`;
    parent.insertAdjacentHTML("beforeend", str);
}
 
function taskList_click(event) {
    let t = event.target;
    if (t.matches("button.task-item__delete-button")) {
        deleteTaskId = +t.dataset.deleteTaskId;
        delModal.classList.remove("modal-overlay_hidden");
    }
    else if (t.matches("input.checkbox-form__checkbox")) { // Чекбокс
        let id = +t.id.match(/^task-(\d+)$/)[1];
        tasks.find(e => e.id === id).completed = t.checked;
        console.log(tasks); // Тестирование
    }
}
 
function deleteCancel_click(event) {
    event.preventDefault();
    delModal.classList.add("modal-overlay_hidden");
}
function deleteConfirm_click(event) {
    event.preventDefault();
    let index = tasks.findIndex(e => e.id === deleteTaskId);
    tasks.splice(index, 1);
    taskList.querySelector(`div[data-task-id="${deleteTaskId}"]`).remove();
    console.log(tasks); // Тестирование
    delModal.classList.add("modal-overlay_hidden");
}

function validateInput() {
    let text = input.value,
        task = tasks.find(e => e.text === text);
 
    input.setCustomValidity(task ? "Задача с таким названием уже существует." : "");
    return input.checkValidity();
}
function form_submit(event) {
    event.preventDefault();
    form.querySelector(".error-message-block")?.remove(); // Удалить ошибку, если раньше была
 
    if (!validateInput()) {
        let obj = input.validity,
            message = obj.valueMissing
                ? "Название задачи не должно быть пустым"
                : input.validationMessage;
        let span = document.createElement("span");
        span.className = "error-message-block";
        span.textContent = message;
        form.append(span);
        return;
    }
 
    ++idCounter;
    let task = {
        id: idCounter,
        text: input.value
    };
    tasks.push(task);
    input.value = ""; // Очистить поле ввода, чтобы было видно, что добавили
    renderTask(taskList, task);
}
 

const tasks = [
    {
        id: 1,
        completed: false,
        text: 'Посмотреть новый урок по JavaScript',
    },
    {
        id: 2,
        completed: false,
        text: 'Выполнить тест после урока',
    },
    {
        id: 3,
        completed: false,
        text: 'Выполнить ДЗ после урока',
    },
];
let idCounter = 3; // Максимальное значение id у существующего массива задач
 
// Действия по отрисовке интерфейса
renderModal(document.body);
let delModal = document.body.lastElementChild;
 
let taskList = document.querySelector(".tasks-list");
for (let task of tasks)
    renderTask(taskList, task);
 
let form = document.querySelector(".create-task-block"),
    input = form.taskName; // Поле для названия новой задачи
 
input.value = ""; // Подготовка поля к валидации
form.noValidate = true;
input.required = true;
 
form.onsubmit = form_submit;
 
// Повесьте обработчик события “click” на элемент с классом “tasks-list”.
taskList.addEventListener("click", taskList_click);
delModal.querySelector(".delete-modal__cancel-button").onclick = deleteCancel_click;
delModal.querySelector(".delete-modal__confirm-button").onclick = deleteConfirm_click;
let deleteTaskId; // ID текущей удаляемой задачи. Один на модальное окно.

