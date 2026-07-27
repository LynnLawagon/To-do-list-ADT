// In-memory state, mirroring the ArrayList<String> tasks in the Java version
let tasks = []; // { id, text, done }
let filter = 'all';
let nextId = 1;

const form = document.getElementById('addForm');
const input = document.getElementById('taskInput');
const errorMsg = document.getElementById('errorMsg');
const list = document.getElementById('taskList');
const emptyState = document.getElementById('emptyState');
const emptyTitle = document.getElementById('emptyTitle');
const emptySub = document.getElementById('emptySub');
const jarFill = document.getElementById('jarFill');
const jarLabel = document.getElementById('jarLabel');
const jarCount = document.getElementById('jarCount');
const filterBtns = document.querySelectorAll('.filters button');
const glow = document.querySelector('.mouse-glow');

const MOODS = [
  [0, "Let's get started"],
  [1, "Nice, warming up"],
  [40, "Making moves"],
  [70, "Almost there"],
  [99, "So close!"],
  [100, "Cleared the whole list! 🎊"]
];

function moodFor(pct){
  let label = MOODS[0][1];
  for(const [threshold, text] of MOODS){
    if(pct >= threshold) label = text;
  }
  return label;
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if(!text){
    errorMsg.textContent = "Dili pwede empty ang task — type something first!";
    return;
  }
  errorMsg.textContent = '';
  tasks.push({ id: nextId++, text, done: false });
  input.value = '';
  render();
});

list.addEventListener('click', (e) => {
  const li = e.target.closest('li');
  if(!li) return;
  const id = Number(li.dataset.id);

  if(e.target.classList.contains('check')){
    const t = tasks.find(t => t.id === id);
    if(t) t.done = !t.done;
    render();
  }
  if(e.target.classList.contains('del')){
    tasks = tasks.filter(t => t.id !== id);
    render();
  }
});

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filter = btn.dataset.filter;
    filterBtns.forEach(b => b.classList.toggle('active', b === btn));
    render();
  });
});

function render(){
  const total = tasks.length;
  const doneCount = tasks.filter(t => t.done).length;
  const pct = total === 0 ? 0 : Math.round((doneCount/total) * 100);

  jarFill.style.width = pct + '%';
  jarLabel.textContent = moodFor(pct);
  jarCount.textContent = `${doneCount} / ${total} done`;

  let visible = tasks;
  if(filter === 'active') visible = tasks.filter(t => !t.done);
  if(filter === 'done') visible = tasks.filter(t => t.done);

  list.innerHTML = '';

  if(total === 0){
    emptyState.style.display = 'block';
    emptyTitle.textContent = "Wala pa'y list diri!";
    emptySub.textContent = "Type something above and hit Add to start your list.";
    list.style.display = 'none';
    return;
  }

  if(visible.length === 0){
    emptyState.style.display = 'block';
    list.style.display = 'none';
    if(filter === 'done'){
      emptyTitle.textContent = "Nothing finished yet";
      emptySub.textContent = "Check off a task and it'll show up here.";
    } else {
      emptyTitle.textContent = "Everything's done!";
      emptySub.textContent = "Add a new task or switch to the Done tab.";
    }
    return;
  }

  emptyState.style.display = 'none';
  list.style.display = 'flex';

  visible.forEach(t => {
    const li = document.createElement('li');
    li.dataset.id = t.id;
    if(t.done) li.classList.add('done');
    li.innerHTML = `
      <button class="check ${t.done ? 'checked' : ''}" title="Mark ${t.done ? 'not done' : 'done'}">${t.done ? '✓' : ''}</button>
      <span class="task-text">${escapeHtml(t.text)}</span>
      <button class="del" title="Remove task">✕</button>
    `;
    list.appendChild(li);
  });
}

function escapeHtml(str){
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

window.addEventListener('mousemove', (e) => {
  glow.style.left = `${e.clientX}px`;
  glow.style.top = `${e.clientY}px`;
});

render();
