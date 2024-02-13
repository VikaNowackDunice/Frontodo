const addButton = document.querySelector('.add-button')
const inputText = document.querySelector('.input-text')
const divTodo = document.querySelector('.todo')
const closeButton = document.querySelector('.closebutton')
const deleteAllButtonBig = document.querySelector('.Delete-button')
const checkAll = document.querySelector('.allCheckbox')
const editText = document.querySelector('.editTextInput')
const allButton = document.querySelector('.All-button')
const activeButton = document.querySelector('.Active-button')
const completedButton = document.querySelector('.Completed-button')


let todoList = [];
const ESCAPE = 'Escape';
const ENTER = 'Enter';

function render(){
    let htmllist = '';
    todoList.forEach(function(item) {
        htmllist+=
        `<li id="${item.id}">
            <input class="checkbox" type="checkbox" ${item.isChecked ? "checked" : ""}></input>
            <span id=${item.id} class="firsttext" >${item.text}</span>
            <input class="newInputRedact" hidden ></input>
            <button type="button" class="closebutton">Delete</button>
        </li>`
    });
    divTodo.innerHTML=htmllist;
}


const checkboxAll = () => {
    todoList.forEach(item => item.isChecked = checkAll.checked);
    console.log(todoList);
    render();
};
    
   

function addTask() {
    if(inputText.value!==''){
        const task = {
            id: Date.now(),
            text: inputText.value,
            isChecked: false
        }

        todoList.push(task)
        render();//название функции для отрисовки массива 
        updateTabsCounter()
        inputText.value='';//значение поля input 
    }
}

function checkDeleteTodoRewrite(event,id) {
    console.log(event.detail);
    const taskId = Number(event.target.parentElement.id);//сохраняем id родительского элемента 

    if (event.target.classList.contains('closebutton')) {//проверка нажатия на кнопку удаления
        todoList = todoList.filter(todo => todo.id !== taskId);
        render();
    }

    if (event.target.classList.contains('checkbox')) {//проверка нажатия на чекбокс
        todoList.forEach(item => {
            if (item.id === taskId) {
                item.isChecked = !item.isChecked;
            }
        })    
    }

        if (event.target.classList.contains('firsttext') && event.detail === 2) {//проверка нажатия на span перезапись
           
            event.target.parentElement.children[2].hidden = false; //показать инпут. св-во таргет указывает на какой элемент мы нажали . Парент элемент - родительский элемент span, чилдрен с индексом 2, это третий элемент в li
            event.target.parentElement.children[2].value = event.target.innerText;//инпут принимает значение span
            event.target.hidden = true;//убирает элемент span при открытии input
            inputEnter(event)
        }

    
}
function getIndexArray(id) {
    const indexArray = todoList.findIndex(
    (element) => element.id === Number(id)
    );
    if (indexArray !== -1) {
    return indexArray;
    }
    }
function saveСhanges(event) {
    const taskId = Number(event.target.parentElement.id)

    todoList.forEach((item) => {if (item.id == taskId) item.text = event.target.parentElement.children[2].value})

    // todolist[getIndexArray(event.target.id)].text = event.target.textContent;

    render();
}
        
function newTextSpan(event){
    console.log(event.target.parentElement)
    todoList[getIndexArray(event.target.id)].text = event.target.parentElement.children[2].value;
    
}

function inputEnter(eventSpan){
    const newInput = document.querySelector('.newInputRedact')

    newInput.focus()
    eventSpan.target.parentElement.children[2].addEventListener("blur", saveСhanges);

    function keyPress(event){
        
        if(event.key == ESCAPE){
            event.target.parentElement.children[2].removeEventListener("blur", saveСhanges);
            render();
        }    
        if(event.key == ENTER){
            event.target.parentElement.children[2].removeEventListener("blur", saveСhanges);
            saveСhanges(eventSpan);
            // todolist[getIndexArray(event.target.parentElement.id)].text = event.target.parentElement.children[2].value;
         }
    }
    newInput.addEventListener('keydown', keyPress);//обработчик нажатия на кнопку

}


function deleteAllButton(event){
    console.log(todoList)
    todoList = todoList.filter((todo) => todo.isChecked === false);
    render(); 
}

function buttnEnter(e) {
    let key = e.keyCode;
    if (key === 13) { // код клавиши Enter
        e.preventDefault();
        addTask();
    }

}
function butnActive(){

}

function butnAll(){

}

function updateButtonCompleted(event){
   //проверка нажатия на чекбокс
    let  counter = 0;
    todoList.forEach((item) => {
        if (item.isChecked === true) counter++
        activeButton.textContent=`Completed (${todoList.length})`
    });
   

}
 function updateTabsCounter(){
    //будет производиться подсчет количества всех таск и обновление значения в кнопках.
    allButton.textContent = `All (${todoList.length})`
    
}
 

inputText.addEventListener('keypress', buttnEnter);
addButton.addEventListener('click', addTask);
checkAll.addEventListener('click', checkboxAll);
deleteAllButtonBig.addEventListener('click', deleteAllButton);
divTodo.addEventListener('click', checkDeleteTodoRewrite);
activeButton.addEventListener('click', butnActive);
allButton.addEventListener('click', butnAll);
completedButton.addEventListener('click', updateButtonCompleted);
