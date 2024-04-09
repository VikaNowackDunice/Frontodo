(() => {
  const addButton = document.querySelector('.add-button');
  const inputText = document.querySelector('.input-text');
  const divTodo = document.querySelector('.todo');
  const deleteAllButtonBig = document.querySelector('.delete-button');
  const checkAll = document.querySelector('.all-checkbox');
  const allButton = document.querySelector('.all-button');
  const activeButton = document.querySelector('.active-button');
  const completedButton = document.querySelector('.completed-button');
  const pagePagination = document.querySelector('.pagination');
  const conditionsButn = document.querySelector('.conditions');
  const errorWindow = document.querySelector('#error-window');
  const { _ } = window;
  const ENTER = 'Enter';
  const ESCAPE = 'Escape';
  const COUNT_OF_PAGINATION = 5;
  const TIME_SET = 5000;

  let condition = 'all';
  let page = 1;
  let todoList = [];
  let countPage = 1;
  let lastPage = 1;
  const URL = 'https://api.t4.academy.dunice-testing.com/todos';

  function showError(errorText) {
    errorWindow.innerText = errorText;
    errorWindow.show();
    setTimeout(() => errorWindow.closest(), TIME_SET);
  }

  const filterTodos = () => {
    switch (condition) {
      case 'active':
        return todoList.filter((todo) => !todo.isChecked);
      case 'completed':
        return todoList.filter((todo) => todo.isChecked);
      default:
        return todoList;
    }
  };

  function pagination() {
    let pages = '';
    const count = filterTodos().length;
    countPage = Math.ceil(count / COUNT_OF_PAGINATION);
    lastPage = countPage;
    for (let i = 0; i < countPage; i += 1) {
      pages += `
      <button 
        class="pagination-button ${i + 1 === page ? 'active' : ''}" 
        id="${i + 1}"
        >
        ${i + 1}
      </button>`;
    }
    pagePagination.innerHTML = pages;
  }

  function updateTabsCounter() {
    const completedTask = todoList.filter((item) => !item.isChecked).length;
    allButton.textContent = `All (${todoList.length})`;
    activeButton.textContent = `Active (${todoList.filter((item) => !item.isChecked).length})`;
    completedButton.textContent = `Completed (${todoList.length - completedTask})`;
  }

  function checkAllCheckbox() {
    const allCheck = todoList.length > 0 && todoList.every((item) => item.isChecked);
    checkAll.checked = allCheck;
  }

  function thisPage(newPage) {
    if (newPage !== lastPage) {
      page = newPage;
    } else {
      page = Math.ceil(filterTodos().length / COUNT_OF_PAGINATION);
    }
  }

  function render() {
    thisPage(page);
    const configuredTodos = filterTodos()
      .slice((page - 1) * COUNT_OF_PAGINATION, page * COUNT_OF_PAGINATION);
    let htmllist = '';
    configuredTodos.forEach((item) => {
      htmllist += `<li id="${item.id}">
      <input class="checkbox" type="checkbox" ${item.isChecked ? 'checked' : ''}></input>
      <span id=${item.id} class="firstText" >${item.text}</span>
      <input id=${item.id} class="new-input-redact" type="text" value="${item.text.replace(/"/g, '\\"')}" hidden ></input>
      <button type="button" class="close-button">Delete</button>
      </li>`;
    });
    divTodo.innerHTML = htmllist;

    pagination();
    updateTabsCounter();
    checkAllCheckbox();
    backlightButton();
  }

  function changePage(event) {
    if (event.target.classList.contains('pagination-button')) {
      page = Number(event.target.id);
      thisPage(page);
    }
    render();
  }

  const checkboxAll = () => {
    // eslint-disable-next-line no-return-assign
    todoList.forEach((item) => item.isChecked = checkAll.checked);
    render();
  };

  function getAllTodo() {
    fetch(URL, {
      headers: { 'Content-Type': 'application/json' },
      method: 'GET',
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error(res.statusText);
      })
      .then((data) => {
        todoList = data;
        render();
      })
      .catch((error) => showError(error));
  }
  window.onload = getAllTodo();

  function createTodo(task) {
    fetch(URL, {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify({
        id: +task.id,
        text: task.text,
        isChecked: task.isChecked,
      }),
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error(res.statusText);
      })
      .then(() => {
        render();
      })
      .catch((error) => showError(error));
  }

  function updateAllTodo(allCheck) {
    fetch(URL, {
      headers: { 'Content-Type': 'application/json' },
      method: 'PUT',
      body: JSON.stringify({ isChecked: allCheck }),
    })
      .then((res) => {
        if (res.ok) {
          render();
        } else {
          throw new Error(res.statusText);
        }
      })
      .catch((error) => showError(error));
  }

  function updateCheckTodo(todoId, todoText, isCheck) {
    fetch(`${URL}/${todoId}`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'PUT',
      body: JSON.stringify({
        id: todoId,
        text: todoText,
        isChecked: isCheck,
      }),
    })
      .then((res) => {
        if (res.ok) {
          condition = 'all';
          pagination();
          render();
        } else {
          throw new Error(res.statusText);
        }
      })
      .catch((error) => showError(error));
  }

  function deleteOne(todoId) {
    fetch(`${URL}/${todoId}`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'DELETE',
    })
      .then((res) => {
        if (res.ok) {
          condition = 'all';
          inputText.value = '';
          pagination();
          render();
        } else {
          throw new Error(res.statusText);
        }
      })
      .catch((error) => showError(error));
  }

  function deleteCheckedTodo() {
    fetch(URL, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => {
        if (res.ok) {
          condition = 'all';
          pagination();
          render();
        } else {
          throw new Error(res.statusText);
        }
      })
      .catch((error) => showError(error));
  }

  function setCondition(event) {
    const collectionOfTabs = conditionsButn.children;

    collectionOfTabs[0].classList.remove('active');
    collectionOfTabs[1].classList.remove('active');
    collectionOfTabs[2].classList.remove('active');

    if (event.target.classList.contains('btn')) {
      condition = event.target.id;
    }
    render();
  }

  function backlightButton() {
    const collectionOfTabs = conditionsButn.children;
    collectionOfTabs[0].classList.remove('active');
    collectionOfTabs[1].classList.remove('active');
    collectionOfTabs[2].classList.remove('active');

    switch (condition) {
      case 'active':
        collectionOfTabs[1].classList.add('active');
        break;
      case 'completed':
        collectionOfTabs[2].classList.add('active');
        break;
      default:
        collectionOfTabs[0].classList.add('active');
    }
  }

  function addTask() {
    const textInputTask = inputText.value.trim();
    if (textInputTask === '') return;
    const task = {
      id: Math.floor(performance.now()) + Math.floor(Math.random() * 100),
      text: _.escape(textInputTask),
      isChecked: false,
    };
    condition = 'all';

    todoList.push(task);
    page = Math.ceil(filterTodos().length / COUNT_OF_PAGINATION);
    inputText.value = '';
    updateTabsCounter();
    render();
    checkAllCheckbox();
    pagination();
    thisPage(page);
    createTodo(task);
  }

  function checkDeleteTodoRewrite(event) {
    const todoId = Number(event.target.parentElement.id);// save the id of the parent element
    const todoText = event.target.parentNode.children[2].value;
    const isCheck = event.target.checked;

    if (event.target.classList.contains('close-button')) { // checking that the delete button is pressed
      todoList = todoList.filter((todo) => todo.id !== todoId);

      updateTabsCounter();
      deleteOne(todoId);
      render();
    }

    if (event.target.classList.contains('checkbox')) { // check for clicking a checkbox
      todoList.forEach((item) => {
        if (item.id === todoId) {
          item.isChecked = !item.isChecked;
        }
      });
      updateTabsCounter();
      checkAllCheckbox();
      updateCheckTodo(todoId, todoText, isCheck);
      render();
    }
  }

  function deleteAllButton() {
    todoList = todoList.filter((todo) => !todo.isChecked);
    updateTabsCounter();
    deleteCheckedTodo(todoList);
    render();
  }

  function buttnEnter(event) {
    if (event.key === ENTER) {
      addTask();
    }
  }

  const finishEdit = (event) => {
    if (event.sourceCapabilities !== null) {
      let todoText = event.target.parentNode.children[2].value;
      if (todoText.trim() === '') {
        render();
      }
      const isCheck = event.target.checked;
      const todoId = Number(event.target.parentElement.id);
      todoText = _.escape(todoText.trim().replace(/  +/g, ' '));

      todoList.forEach((item) => {
        if (item.id === todoId) {
          item.text = todoText;
        }
      });
      updateCheckTodo(todoId, todoText, isCheck);
      render();
    }
  };

  const startEdit = (event) => {
    if (event.target.classList.contains('firstText')) {
      const { children } = event.target.parentNode;
      children[1].hidden = true;
      children[2].hidden = false;
      children[2].focus();
    }
  };

  const editOrExit = (event) => {
    if (event.target.classList.contains('new-input-redact')) {
      if (event.key === ENTER) {
        finishEdit(event);
      }
      if (event.key === ESCAPE) {
        render();
      }
    }
  };

  function changeCheck() {
    const allCheck = this.checked;
    // eslint-disable-next-line no-return-assign
    todoList.forEach((item) => item.isChecked = allCheck);
    updateAllTodo(allCheck);
    render();
  }

  divTodo.addEventListener('dblclick', startEdit);
  divTodo.addEventListener('keyup', editOrExit);
  divTodo.addEventListener('blur', finishEdit, true);
  divTodo.addEventListener('click', checkDeleteTodoRewrite);
  inputText.addEventListener('keypress', buttnEnter);
  addButton.addEventListener('click', addTask);
  checkAll.addEventListener('click', checkboxAll);
  deleteAllButtonBig.addEventListener('click', deleteAllButton);
  conditionsButn.addEventListener('click', setCondition);
  pagePagination.addEventListener('click', changePage);
  checkAll.addEventListener('change', changeCheck);
})();
