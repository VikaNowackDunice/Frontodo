const addButton = document.querySelector('.add-button')
const inputText = document.querySelector('.input-text')
const divTodo = document.querySelector('.todo')
const closeButton = document.querySelector('.closebutton')
const deleteAllButtonBig = document.querySelector('.Delete-button')
const checkAll = document.querySelector('.allCheckbox')
let todolist = []

function render(){
    let htmllist = '';
    todolist.forEach(function(item) {
        htmllist+=
        `<div class="outputLine"> <li id="${item.id}">
            <input class="checkbox" type="checkbox" ${item.isChecked ? "checked" : ""}></input>
            <span class="firsttext" >${item.text}</span>
            <button type="button" class="closebutton">Delete</button>
        </li> </div>`
    });
    divTodo.innerHTML=htmllist;
}

const checkboxAll = () => {
    todolist.forEach(item => item.isChecked = checkAll.checked);
    console.log(todolist);
    render();
};
    
   

function addTask() {
    if(inputText.value!==''){
        const task = {
            id: Date.now(),
            text: inputText.value,
            isChecked: false
        }

        todolist.push(task)
        render();//название функции для отрисовки массива 
        inputText.value='';//значение поля input 
    }
}

function checkDeleteTodo(event,id) {
    console.log(event.target);
    const taskId = Number(event.target.parentElement.id);//сохраняем id родительского элемента 
    if (event.target.classList.contains('closebutton')) {//проверка нажатия на кнопку удаления
        todolist = todolist.filter(todo => todo.id !== taskId);
        render();
    }
    if (event.target.classList.contains('checkbox')) {//проверка нажатия на чекбокс
        todolist.forEach(item => {
            if (item.id === taskId) {
                item.isChecked = !item.isChecked;
            }
        })
        
    }
}
function deleteAllButton(event){
    console.log(todolist)
    todolist = todolist.filter((todo) => todo.isChecked === false);
    render(); 
}

function buttnEnter(e) {
    let key = e.keyCode;
    if (key === 13 ) { // код клавиши Enter
        e.preventDefault();
        addTask();
    }
}



inputText.addEventListener('keypress', buttnEnter);
addButton.addEventListener('click', addTask);
checkAll.addEventListener('click', checkboxAll);
deleteAllButtonBig.addEventListener('click', deleteAllButton);
//addButton.addEventListener('keypress', addTask);
divTodo.addEventListener('click', checkDeleteTodo);
