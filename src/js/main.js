const taskStorage = "TASK_STORAGE";

const creatId = () => {
  return `task-${Math.floor(Math.random() * 100000)}`;
};

const createLi = (data) => {
  return `
     <li  data-id = ${data.id}
          data-iscomplete = ${data.isComplete}
          class="task-container"
        >
          <input type="checkbox" ${
            data.isComplete ? "checked" : ""
          } class="w-4.5 cursor-pointer peer" />
          <p class="task">
            ${data.task}
          </p>
          <button class="btn-delete">
            <img src="src/img/bin.png" alt="bin icon" class="btn-delete-icon" />
          </button>
        </li>
  `;
};

const addTaskToStorage = (data) => {
  let taskData = [];
  try {
    taskData = JSON.parse(localStorage.getItem(taskStorage));
    taskData.push(data);
    localStorage.setItem(taskStorage, JSON.stringify(taskData));
  } catch (e) {
    throw new Error("Storage tidak tersedia!");
  }
};

const removeTaskFromStorage = (id) => {
  let taskData = [];
  try {
    taskData = JSON.parse(localStorage.getItem(taskStorage));
    taskData = taskData.filter((data) => data.id !== id);
    localStorage.setItem(taskStorage, JSON.stringify(taskData));
  } catch (e) {
    throw new Error("Gagal mendapatkan data dari storage!");
  }
};

const getDataFromStorage = () => {
  let taskData = [];
  try {
    taskData = JSON.parse(localStorage.getItem(taskStorage));
  } catch (e) {
    throw new Error("Gagal mendapatkan data dari storage!");
  }
  return taskData;
};

const updateData = (isComplete, id) => {
  let taskData = [];

  try {
    taskData = JSON.parse(localStorage.getItem(taskStorage));
    const dataTarget = taskData.find((data) => data.id === id);
    dataTarget.isComplete = isComplete ? false : true;
    taskData = taskData.filter((data) => data.id !== id);
    taskData.unshift(dataTarget);

    localStorage.setItem(taskStorage, JSON.stringify(taskData));
  } catch (e) {
    throw new Error("Gagal mendapatkan data dari storage!");
  }
};

const renderEvent = () => {
  const taskData = getDataFromStorage();
  const listContainer = document.querySelector("ul");

  if (taskData.length > 0) {
    const incompleteTask = taskData.filter((data) => !data.isComplete);
    const completeTask = taskData.filter((data) => data.isComplete);

    let el = "";
    incompleteTask.forEach((data) => (el += createLi(data)));
    completeTask.forEach((data) => (el += createLi(data)));

    listContainer.innerHTML = el;
  } else {
    listContainer.innerHTML = "";
  }
};

document.addEventListener("DOMContentLoaded", () => {
  if (typeof Storage === "undefined") {
    return `Maaf browser anda tidak mendukung web storage!`;
  }

  if (localStorage.getItem(taskStorage) === null) {
    localStorage.setItem(taskStorage, JSON.stringify([]));
  }

  renderEvent();

  const form = document.querySelector("form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const getTask = document.getElementById("inputTask");
    if (getTask.value === "") {
      Swal.fire({
        title: "Task tidak boleh kosong!",
        icon: "error",
      });
      return;
    }
    const taskId = creatId();
    const data = {
      id: taskId,
      task: getTask.value,
      isComplete: false,
    };
    addTaskToStorage(data);
    renderEvent();
    getTask.value = "";
  });

  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-delete")) {
      const taskId = e.target.closest("li")?.getAttribute("data-id");
      try {
        removeTaskFromStorage(taskId);
        Swal.fire({
          title: "Task berhasil dihapus!",
          icon: "success",
        });
        renderEvent();
      } catch (e) {
        Swal.fire({
          title: e,
          icon: "error",
        });
      }
    }

    if (e.target.getAttribute("type") === "checkbox") {
      const li = e.target.closest("li");
      const targetId = li.getAttribute("data-id");
      const isComplete = li.getAttribute("data-iscomplete");

      li.setAttribute(
        "data-iscomplete",
        isComplete === "false" ? "true" : "false"
      );
      updateData(isComplete === "false" ? false : true, targetId);

      renderEvent();
    }
  });
});
