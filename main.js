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

  const ESCAPE = 'Escape';
  const ENTER = 'Enter';
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

  function render() {
    const configuredTodos = filterTodos()
      .slice((page - 1) * COUNT_OF_PAGINATION, page * COUNT_OF_PAGINATION);
    let htmllist = '';
    configuredTodos.forEach((item) => {
      htmllist
      += `<li id="${item.id}">
          <input class="checkbox" type="checkbox" ${item.isChecked ? 'checked' : ''}></input>
          <span id=${item.id} class="firstText" >${_.escape(item.text)}</span>
          <input id=${item.id} class="new-input-redact" type="text" hidden ></input>
          <button type="button" class="close-button">Delete</button>
      </li>`;
    });
    divTodo.innerHTML = htmllist;
    pagination();
    updateTabsCounter();
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

  function checkAllCheckbox() {
    checkAll.checked = todoList.every((item) => item.isChecked === true);
  }

  function addTask() {
    if (inputText.value.trim() !== '') {
      const task = {
        id: Date.now(),
        text: inputText.value.trim(),
        isChecked: false,
      };
      todoList.push(task);
      render();
      updateTabsCounter();
      inputText.value = '';
    } else {
      inputText.value = '';
    }
    checkAllCheckbox();
  }

  function saveСhanges(event) {
    if (event.target.textContent === '') {
      render();
    } else {
      const taskId = Number(event.target.parentElement.id);
      todoList.forEach((item) => {
        if (item.id === taskId) {
          item.text = event.target.parentElement.children[2].value;
          render();
        }
      });
    }
  }

  function inputEnter(eventSpan) {
    const newInputs = document.querySelectorAll('.new-input-redact');
    let newInput;
    function keyPress(event) {
      const newInputText = event.target.parentElement.children[2];
      if (event.key === ESCAPE) {
        newInputText.removeEventListener('blur', saveСhanges);
        render();
      }
      if (event.key === ENTER && newInput.value === '') {
        newInputText.removeEventListener('blur', saveСhanges);
        render();
      } else if (event.key === ENTER) {
        if (newInputs[0].textContent === '') {
          render();
        }
        newInputText.removeEventListener('blur', saveСhanges);
        saveСhanges(event);
        saveСhanges(eventSpan);
      }
    }
    newInputs.forEach((element, id) => {
      if (element.id === eventSpan.target.parentElement.id) {
        newInput = newInputs[id];
        newInput.addEventListener('keydown', keyPress); // button click handler
      }
    });
    newInput.focus();
    eventSpan.target.parentNode.children[2].addEventListener('blur', saveСhanges);

    newInput.addEventListener('keydown', keyPress); // button click handler
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

    if (event.target.classList.contains('firstText') && event.detail === 2) {
      const inputNewText = event.target.parentElement.children[2]; // span click check rewrite
      inputNewText.hidden = false;
      inputNewText.value = event.target.innerText; // input takes the value span
      event.target.hidden = true;// removes the span element when opening input
      inputEnter(event);
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

  inputText.addEventListener('keypress', buttnEnter);
  addButton.addEventListener('click', addTask);
  checkAll.addEventListener('click', checkboxAll);
  deleteAllButtonBig.addEventListener('click', deleteAllButton);
  divTodo.addEventListener('click', checkDeleteTodoRewrite);
  conditionsButn.addEventListener('click', setCondition);
  pagePagination.addEventListener('click', changePage);
})();
