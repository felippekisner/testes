// main.js — Organizador Escolar (versão corrigida)

// Importando Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCqWaY2RdgWVcJyZUZmAvnL7YJ41Et8Y6s",
  authDomain: "organizadorlp.firebaseapp.com",
  projectId: "organizadorlp",
  storageBucket: "organizadorlp.firebasestorage.app",
  messagingSenderId: "233130911029",
  appId: "1:233130911029:web:78e0542cd09f7830b4987c",
  measurementId: "G-WZP1LGTPQY"
};

// Inicializa Firebase e Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// =====================
// TROCA ENTRE ABAS
// =====================
const botoes = document.querySelectorAll(".aba");
const conteudos = document.querySelectorAll(".conteudo");

botoes.forEach((btn) => {
  btn.addEventListener("click", () => {
    const alvo = btn.getAttribute("data-alvo");
    conteudos.forEach((div) => (div.style.display = "none"));
    document.getElementById(alvo).style.display = "block";
  });
});

// =====================
// SEÇÃO: TAREFAS
// =====================
const tarefasLista = document.getElementById("tarefas-lista");
const formTarefa = document.getElementById("form-tarefa");

if (formTarefa) {
  formTarefa.addEventListener("submit", async (e) => {
    e.preventDefault();
    const titulo = formTarefa["titulo"].value.trim();
    const data = formTarefa["data"].value;

    if (!titulo || !data) return alert("Preencha todos os campos!");

    try {
      await addDoc(collection(db, "tarefas"), { titulo, data });
      formTarefa.reset();
    } catch (err) {
      console.error("Erro ao adicionar tarefa:", err);
    }
  });
}

// Função para renderizar tarefas em ordem crescente de data
function renderizarTarefas(snapshot) {
  tarefasLista.innerHTML = "";
  const tarefas = [];

  snapshot.forEach((docSnap) => {
    tarefas.push({ id: docSnap.id, ...docSnap.data() });
  });

  tarefas.sort((a, b) => new Date(a.data) - new Date(b.data));

  tarefas.forEach((tarefa) => {
    const div = document.createElement("div");
    div.classList.add("tarefa");
    div.innerHTML = `
      <p><strong>${tarefa.titulo}</strong> - ${tarefa.data}</p>
      <button class="excluir-tarefa" data-id="${tarefa.id}">Excluir</button>
    `;
    tarefasLista.appendChild(div);
  });

  document.querySelectorAll(".excluir-tarefa").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-id");
      try {
        await deleteDoc(doc(db, "tarefas", id));
        btn.parentElement.remove(); // remove da tela instantaneamente
      } catch (err) {
        console.error("Erro ao excluir tarefa:", err);
      }
    });
  });
}

// Atualização em tempo real das tarefas
onSnapshot(collection(db, "tarefas"), (snapshot) => {
  renderizarTarefas(snapshot);
});

// =====================
// SEÇÃO: HORÁRIOS
// =====================
const horariosTabela = document.getElementById("horarios-tabela");
const addHorarioBtn = document.getElementById("add-horario");

// Só tenta adicionar eventos se o elemento existir
if (addHorarioBtn && horariosTabela) {
  addHorarioBtn.addEventListener("click", async () => {
    const novaLinha = document.createElement("tr");
    novaLinha.innerHTML = `
      <td><input placeholder="Dia"></td>
      <td><input placeholder="Hora"></td>
      <td><input placeholder="Matéria"></td>
      <td><button class="salvar-horario">Salvar</button></td>
      <td><button class="excluir-horario">Excluir</button></td>
    `;
    horariosTabela.appendChild(novaLinha);

    novaLinha.querySelector(".salvar-horario").addEventListener("click", async () => {
      const dia = novaLinha.children[0].querySelector("input").value.trim();
      const hora = novaLinha.children[1].querySelector("input").value.trim();
      const materia = novaLinha.children[2].querySelector("input").value.trim();
      if (!dia || !hora || !materia) return alert("Preencha todos os campos!");

      try {
        await addDoc(collection(db, "horarios"), { dia, hora, materia });
        novaLinha.remove(); // limpa linha de edição
      } catch (err) {
        console.error("Erro ao salvar horário:", err);
      }
    });

    novaLinha.querySelector(".excluir-horario").addEventListener("click", () => {
      novaLinha.remove();
    });
  });

  // Atualização em tempo real dos horários
  onSnapshot(collection(db, "horarios"), (snapshot) => {
    horariosTabela.innerHTML = "";
    snapshot.forEach((docSnap) => {
      const horario = { id: docSnap.id, ...docSnap.data() };
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${horario.dia}</td>
        <td>${horario.hora}</td>
        <td>${horario.materia}</td>
        <td>-</td>
        <td><button class="excluir-horario" data-id="${horario.id}">Excluir</button></td>
      `;
      horariosTabela.appendChild(tr);
    });

    document.querySelectorAll(".excluir-horario").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const id = btn.getAttribute("data-id");
        try {
          await deleteDoc(doc(db, "horarios", id));
          btn.parentElement.parentElement.remove();
        } catch (err) {
          console.error("Erro ao excluir horário:", err);
        }
      });
    });
  });
} else {
  console.warn("⚠️ Elementos de horários não encontrados — verifique se o HTML está correto.");
}
