// Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, query, orderBy } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCqWaY2RdgWVcJyZUZmAvnL7YJ41Et8Y6s",
  authDomain: "organizadorlp.firebaseapp.com",
  projectId: "organizadorlp",
  storageBucket: "organizadorlp.firebasestorage.app",
  messagingSenderId: "233130911029",
  appId: "1:233130911029:web:78e0542cd09f7830b4987c",
  measurementId: "G-WZP1LGTPQY"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Trocar conteúdo no section#conteudo
function setConteudo(html) {
  document.getElementById("conteudo").innerHTML = html;
}

// Tarefas
window.carregarTarefas = function () {
  setConteudo(`
    <h2>Tarefas</h2>
    <form id="formTarefa">
      <label>Data:</label>
      <input type="date" id="dataTarefa" required>
      <label>Matéria:</label>
      <input type="text" id="materiaTarefa" required>
      <label>Tipo:</label>
      <input type="text" id="tipoTarefa" required>
      <label>Descrição:</label>
      <textarea id="descricaoTarefa"></textarea>
      <button type="submit">Adicionar</button>
    </form>
    <div id="listaTarefas"></div>
  `);

  document.getElementById("formTarefa").addEventListener("submit", async (e) => {
    e.preventDefault();
    const nova = {
      data: document.getElementById("dataTarefa").value,
      materia: document.getElementById("materiaTarefa").value,
      tipo: document.getElementById("tipoTarefa").value,
      descricao: document.getElementById("descricaoTarefa").value
    };
    await addDoc(collection(db, "tarefas"), nova);
    carregarTarefas();
  });

  atualizarTabelaTarefas();
};

async function atualizarTabelaTarefas() {
  const div = document.getElementById("listaTarefas");
  div.innerHTML = "";
  const q = query(collection(db, "tarefas"), orderBy("data"));
  const snap = await getDocs(q);
  snap.forEach(docSnap => {
    const t = docSnap.data();
    div.innerHTML += `
      <div class="card">
        <strong>${t.data}</strong> - ${t.materia} (${t.tipo}): ${t.descricao}
        <button onclick="excluirTarefa('${docSnap.id}')">Excluir</button>
      </div>
    `;
  });
}

window.excluirTarefa = async function (id) {
  await deleteDoc(doc(db, "tarefas", id));
  carregarTarefas();
};

// Notícias
window.carregarNoticias = function () {
  setConteudo(`
    <h2>Notícias</h2>
    <form id="formNoticia">
      <label>Data:</label>
      <input type="date" id="dataNoticia" required>
      <label>Matéria:</label>
      <input type="text" id="materiaNoticia" required>
      <label>Descrição:</label>
      <textarea id="descricaoNoticia"></textarea>
      <button type="submit">Adicionar</button>
    </form>
    <div id="listaNoticias"></div>
  `);

  document.getElementById("formNoticia").addEventListener("submit", async (e) => {
    e.preventDefault();
    const nova = {
      data: document.getElementById("dataNoticia").value,
      materia: document.getElementById("materiaNoticia").value,
      descricao: document.getElementById("descricaoNoticia").value
    };
    await addDoc(collection(db, "noticias"), nova);
    carregarNoticias();
  });

  atualizarTabelaNoticias();
};

async function atualizarTabelaNoticias() {
  const div = document.getElementById("listaNoticias");
  div.innerHTML = "";
  const q = query(collection(db, "noticias"), orderBy("data"));
  const snap = await getDocs(q);
  snap.forEach(docSnap => {
    const n = docSnap.data();
    div.innerHTML += `
      <div class="card">
        <strong>${n.data}</strong> - ${n.materia}: ${n.descricao}
        <button onclick="excluirNoticia('${docSnap.id}')">Excluir</button>
      </div>
    `;
  });
}

window.excluirNoticia = async function (id) {
  await deleteDoc(doc(db, "noticias", id));
  carregarNoticias();
};

// Horários
window.carregarHorarios = function () {
  setConteudo(`
    <h2>Horários</h2>
    <div class="card">Segunda: Inglês, Geografia, Biologia...</div>
    <div class="card">Terça: Hardware, Filosofia...</div>
    <div class="card">Quarta: Matemática, História...</div>
    <div class="card">Quinta: Física, Química...</div>
    <div class="card">Sexta: Programação, Educação Física...</div>
  `);
};

// Professores
window.carregarProfessores = function () {
  setConteudo(`
    <h2>Professores</h2>
    <div class="card">Artes: Suzana Back - suzana.back@ifc.edu.br</div>
    <div class="card">Biologia: Karlan Rau - karlan.rau@ifc.edu.br</div>
    <div class="card">Matemática: José Silva - jose.silva@ifc.edu.br</div>
    <div class="card">Programação: Maria Souza - maria.souza@ifc.edu.br</div>
    <div class="card">Física: Ana Lima - ana.lima@ifc.edu.br</div>
  `);
};
