import './style.css';
import sync from './assets/images/sync.png';
import enter from './assets/images/subdirectory_arrow_left.png';
import {
  printtasks, addtask, deleteTask, edittask, deletecompleted,
} from './CRUD.js';
import isComplete from './status update.js';

const title = document.getElementById('title');
const addInput = document.getElementById('add');

title.src = sync;
addInput.src = enter;

printtasks();

const newtask = document.querySelector('.complete');

newtask.addEventListener('change', newtask.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    if (newtask.value !== '') {
      addtask(newtask.value);
      newtask.value = '';
    }
  }
}));

document.addEventListener('click', (e) => {
  const { id } = e.target;
  if (e.target.matches('.trash')) {
    deleteTask(id);
  }
  if (e.target.matches('.more')) {
    edittask(id);
  }

  if (e.target.matches('.check')) {
    isComplete(id);
  }
  if (e.target.matches('.all')) {
    deletecompleted();
  }
});



let Taskslist = [];
const isComplete = (checkid) => {
  const checkbox = document.getElementById(checkid);
  Taskslist = JSON.parse(window.localStorage.getItem('tasks'));
  if (checkbox.checked) {
    const sibling = checkbox.parentElement.querySelector('.complete');
    sibling.classList.add('active');
    Taskslist.find(({ description }) => description === sibling.value).completed = true;
    window.localStorage.setItem('tasks', JSON.stringify(Taskslist));
  } else {
    const sibling = checkbox.parentElement.querySelector('.complete');
    sibling.classList.remove('active');
    Taskslist.find(({ description }) => description === sibling.value).completed = false;
    window.localStorage.setItem('tasks', JSON.stringify(Taskslist));
  }
};

export default isComplete;


/* eslint-disable max-len */
import more from './assets/images/more_vert.png';
import dbin from './assets/images/trash.png';

let Taskslist = [];
let PostionToInsert = 2;

const List = document.querySelector('.list');

const printtask = (task) => {
  const listItem = document.createElement('li');
  const checkBoxId = task.description + task.index.toString();
  if (task.completed === true) {
    listItem.innerHTML = `
  <div class='textinput'><input id= ${checkBoxId} class='check' type="checkbox" checked=true>&nbsp;&nbsp;<input type="text" value=${task.description} class="complete active" readonly>
  </div>
  <img id=${task.description} class="more" src=${more} alt="more_vert">

                    `;
  } else {
    listItem.innerHTML = `
<div class='textinput' ><input id= ${checkBoxId} class='check' type="checkbox">&nbsp;&nbsp;<input type="text" value=${task.description} class="complete" readonly>
</div>
<img id=${task.description} class="more" src=${more} alt="more_vert">
                  `;
  }
  listItem.classList.add('listitem');
  List.insertBefore(listItem, List.children[PostionToInsert]);
  PostionToInsert += 1;
};

const printtasks = () => {
  [...List.children].forEach((child) => {
    if (child.querySelector('.more')) {
      List.removeChild(child);
    }
  });
  if (window.localStorage.getItem('tasks') !== null) {
    const tasks = JSON.parse(window.localStorage.getItem('tasks'));
    Taskslist = tasks;
    Taskslist.forEach((task) => {
      printtask(task);
    });
  }
};

const addtask = (description) => {
  const task = {
    description,
    completed: false,
    index: Taskslist.length + 1,
  };
  printtask(task);
  Taskslist.push(task);
  window.localStorage.setItem('tasks', JSON.stringify(Taskslist));
};

const deleteTask = (taskId) => {
  document.getElementById(taskId).parentElement.remove();
  Taskslist = Taskslist.filter((task) => task.description !== taskId);
  let newindex = 1;
  Taskslist.forEach((task) => {
    task.index = newindex;
    newindex += 1;
  });
  window.localStorage.setItem('tasks', JSON.stringify(Taskslist));
  PostionToInsert -= 1;
};

const edittask = (id) => {
  const trash = document.getElementById(id);
  trash.parentElement.style.backgroundColor = '#fff890';
  trash.src = dbin;
  trash.className = 'trash';
  const siblingInput = trash.parentElement.querySelector('.complete');
  siblingInput.addEventListener('click', () => {
    siblingInput.readOnly = false;
  });
  siblingInput.addEventListener('change', siblingInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      siblingInput.readOnly = true;
      Taskslist.find(({ description }) => description === trash.id).description = siblingInput.value;
      window.localStorage.setItem('tasks', JSON.stringify(Taskslist));
      trash.className = 'more';
      trash.id = siblingInput.value;
      trash.parentElement.style.backgroundColor = '#fff';
      trash.src = more;
    }
  }));
};

const deletecompleted = () => {
  const tasky = JSON.parse(window.localStorage.getItem('tasks'));
  Taskslist = tasky;
  Taskslist = Taskslist.filter((b) => b.completed !== true);
  let newind = 1;
  Taskslist.forEach((task) => {
    task.index = newind;
    newind += 1;
  });
  window.localStorage.setItem('tasks', JSON.stringify(Taskslist));
  PostionToInsert = 2;
  printtasks();
};

export {
  printtasks, addtask, deleteTask, edittask, deletecompleted,
};
