let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];
let filtroAtual = 'todas'; 

const entradaTarefa = document.getElementById("entradaTarefa");
const listaTarefas = document.getElementById("listaTarefas");

function salvarTarefas() {
  localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

function adicionarTarefa() {
  const texto = entradaTarefa.value.trim();
  if (texto === "") return;

  tarefas.push({ texto, concluida: false });
  entradaTarefa.value = "";
  salvarTarefas();
  atualizarLista();
}

function alternarConclusao(index) {
  tarefas[index].concluida = !tarefas[index].concluida;
  salvarTarefas();
  atualizarLista();
}

function removerTarefa(index) {
  tarefas.splice(index, 1);  // Remover tarefa do array permanentemente
  salvarTarefas();
  atualizarLista();
}

function atualizarLista() {
  listaTarefas.inn
}