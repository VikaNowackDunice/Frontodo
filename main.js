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

  const { _ } = window;
  const ENTER = 'Enter';
  const ESCAPE = 'Escape';
  const COUNT_OF_PAGINATION = 5;

  let condition = 'all';
  let page = 1;
  let todoList = [];

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
    // display a list of pages
    let pages = '';
    const count = filterTodos().length;
    const countPage = Math.ceil(count / COUNT_OF_PAGINATION); // number of pages
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
    const valueButton = todoList.filter((item) => item.isChecked === false).length;
    allButton.textContent = `All (${todoList.length})`;
    activeButton.textContent = `Active (${todoList.filter((item) => !item.isChecked).length})`;
    completedButton.textContent = `Completed (${todoList.length - valueButton})`;
  }

  function checkAllCheckbox() {
    checkAll.checked = todoList.every((item) => item.isChecked === true);
    if (todoList.length === 0) {
      checkAll.checked = false;
    }
  }

  function render() {
    const configuredTodos = filterTodos()
      .slice((page - 1) * COUNT_OF_PAGINATION, page * COUNT_OF_PAGINATION);
    let htmllist = '';
    configuredTodos.forEach((item) => {
      htmllist += `<li id="${item.id}">
          <input class="checkbox" type="checkbox" ${item.isChecked ? 'checked' : ''}></input>
          <span id=${item.id} class="firstText" >${item.text}</span>
          <input id=${item.id} class="new-input-redact" type="text" value="${_.escape(item.text)}" hidden ></input>
          <button type="button" class="close-button">Delete</button>
      </li>`;
    });
    divTodo.innerHTML = htmllist;
    updateTabsCounter();
    checkAllCheckbox();
    pagination();
  }

  function changePage(event) {
    if (event.target.classList.contains('pagination-button')) {
      page = Number(event.target.id);
    }
    render();
  }

  const checkboxAll = () => {
    // eslint-disable-next-line no-return-assign
    todoList.forEach((item) => item.isChecked = checkAll.checked);
    render();
  };

  function addTask() {
    if (inputText.value.trim() !== '') {
      const task = {
        id: Date.now(),
        text: _.escape(inputText.value.trim()),
        isChecked: false,
      };
      todoList.push(task);
      page = Math.ceil(filterTodos().length / COUNT_OF_PAGINATION);
      inputText.value = '';
    } else {
      inputText.value = '';
    }
    updateTabsCounter();
    render();
    checkAllCheckbox();
    pagination();
  }

  function checkDeleteTodoRewrite(event) {
    const taskId = Number(event.target.parentElement.id);// save the id of the parent element

    if (event.target.classList.contains('close-button')) { // checking that the delete button is pressed
      todoList = todoList.filter((todo) => todo.id !== taskId);
      render();
      updateTabsCounter();
    }

    if (event.target.classList.contains('checkbox')) { // check for clicking a checkbox
      todoList.forEach((item) => {
        if (item.id === taskId) {
          item.isChecked = !item.isChecked;
        }
      });
      render();
      updateTabsCounter();
      checkAllCheckbox();
    }
  }

  function deleteAllButton() {
    todoList = todoList.filter((todo) => !todo.isChecked);
    render();
    updateTabsCounter();
  }

  function buttnEnter(e) {
    const key = e.keyCode;
    if (key === 13) {
      e.preventDefault();
      addTask();
    }
  }

  function setCondition(event) {
    const collectionOfTabs = conditionsButn.getElementsByClassName('btn');
    collectionOfTabs[0].classList.remove('active');
    collectionOfTabs[1].classList.remove('active');
    collectionOfTabs[2].classList.remove('active');

    if (event.target.classList.contains('btn')) {
      condition = event.target.id;
      event.target.classList.add('active');
      render();
    }
  }

  const finishEdit = (event) => {
    if (event.sourceCapabilities !== null) {
      let todoText = event.target.parentNode.children[2].value;
      if (todoText.trim() === '') {
        render();
        return;
      }
      const todoId = Number(event.target.parentElement.id);
      todoText = _.escape(todoText.trim().replace(/  +/g, ' '));

      todoList.forEach((item) => {
        if (item.id === todoId) {
          item.text = todoText;
        }
      });
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
})();
