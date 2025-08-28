let items = [];
const STORAGE_KEY = "shopping.items.v1"; 


const form = document.getElementById("form-add");
const inputName = document.getElementById("input-name");
const inputQty = document.getElementById("input-qty");
const listEl = document.getElementById("list");
const tmpl = document.getElementById("item-template"); 
const countEl = document.getElementById("count");
const clearDoneBtn = document.getElementById("clear-done");
const searchEl = document.getElementById("search");
const sortEl = document.getElementById("sort");
const filterBtns = document.querySelectorAll(".filters button");


let currentFilter = "all";  
let currentQuery = "";       
let currentSort = "created"; 


function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function load() {
  const raw = localStorage.getItem(STORAGE_KEY);
  items = raw ? JSON.parse(raw) : [];
}


function addItem(name, qty) {
  items.push({
    id: crypto.randomUUID(),   
    name,
    qty: Number(qty),
    done: false,               
    createdAt: Date.now()      
  });
  save(); render();
}


function toggleItem(id) {
  const it = items.find(i => i.id === id);
  if (it) it.done = !it.done;
  save(); render();
}


function removeItem(id) {
  items = items.filter(i => i.id !== id);
  save(); render();
}


function editItem(id, newName, newQty) {
  const it = items.find(i => i.id === id);
  if (it) {
    it.name = newName;
    it.qty = Number(newQty);
  }
  save(); render();
}

function applyViewPipeline(arr) {
  let out = arr;

 
  if (currentFilter !== "all") {
    out = out.filter(i => currentFilter === "done" ? i.done : !i.done);
  }

  
  if (currentQuery) {
    const q = currentQuery.toLowerCase();
    out = out.filter(i => i.name.toLowerCase().includes(q));
  }

 
  if (currentSort === "name") {
    out = [...out].sort((a, b) => a.name.localeCompare(b.name));
  } else if (currentSort === "status") {
    out = [...out].sort((a, b) => Number(a.done) - Number(b.done));
  } else {
    
    out = [...out].sort((a, b) => a.createdAt - b.createdAt);
  }

  return out;
}


function render() {
  listEl.innerHTML = ""; 
  const view = applyViewPipeline(items);

 
  view.forEach(item => {
    const node = tmpl.content.firstElementChild.cloneNode(true);
    const checkbox = node.querySelector(".toggle");
    const title = node.querySelector(".title");
    const qty = node.querySelector(".qty");

 
    title.textContent = item.name;
    qty.textContent = `× ${item.qty}`;
    checkbox.checked = item.done;
    if (item.done) title.classList.add("done");

  
    checkbox.addEventListener("change", () => toggleItem(item.id));
    node.querySelector(".remove").addEventListener("click", () => removeItem(item.id));
    node.querySelector(".edit").addEventListener("click", () => {
      const newName = prompt("Novo nome:", item.name);
      if (newName === null) return; 
      const newQty = prompt("Nova quantidade:", item.qty);
      if (newQty === null) return;
      if (newName.trim()) editItem(item.id, newName.trim(), newQty || 1);
    });

    
    listEl.appendChild(node);
  });

  
  const pending = items.filter(i => !i.done).length;
  countEl.textContent = `${pending} pendente(s) de ${items.length}`;

  
  document.querySelectorAll(".filters button").forEach(b =>
    b.classList.toggle("is-active", b.dataset.filter === currentFilter)
  );
}


form.addEventListener("submit", (e) => {
  e.preventDefault(); 
  const name = inputName.value.trim();
  const qty = inputQty.value;
  if (!name) return;
  addItem(name, qty);
  form.reset(); 
  inputName.focus();
});


clearDoneBtn.addEventListener("click", () => {
  items = items.filter(i => !i.done);
  save(); render();
});


searchEl.addEventListener("input", (e) => {
  currentQuery = e.target.value;
  render();
});


sortEl.addEventListener("change", (e) => {
  currentSort = e.target.value;
  render();
});


filterBtns.forEach(btn =>
  btn.addEventListener("click", () => {
    currentFilter = btn.dataset.filter;
    render();
  })
);


load();
render();
