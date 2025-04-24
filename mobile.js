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

// Função para trocar entre abas
window.trocarAba = function(abaId) {
    document.querySelectorAll('.tab-content').forEach(div => div.classList.remove('active'));
    document.getElementById(abaId).classList.add('active');

    if (abaId === 'tarefas') carregarTarefas();
    if (abaId === 'noticias') carregarNoticias();
};

// Carregar tarefas
async function carregarTarefas() {
    const tbody = document.getElementById("listaTarefas");
    tbody.innerHTML = "";

    const q = query(collection(db, "tarefas"), orderBy("data"));
    const snap = await getDocs(q);
    snap.forEach(docSnap => {
        const t = docSnap.data();
        tbody.innerHTML += `
            <tr>
                <td>${t.data}</td>
                <td>${t.materia}</td>
                <td>${t.tipo}</td>
                <td>${t.descricao}</td>
                <td><button onclick="excluirTarefa('${docSnap.id}')">Excluir</button></td>
            </tr>
        `;
    });

    document.getElementById("formTarefas").addEventListener("submit", async (e) => {
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
}

// Carregar notícias
async function carregarNoticias() {
    const tbody = document.getElementById("listaNoticias");
    tbody.innerHTML = "";

    const q = query(collection(db, "noticias"), orderBy("data"));
    const snap = await getDocs(q);
    snap.forEach(docSnap => {
        const n = docSnap.data();
        tbody.innerHTML += `
            <tr>
                <td>${n.data}</td>
                <td>${n.materia}</td>
                <td>${n.descricao}</td>
                <td><button onclick="excluirNoticia('${docSnap.id}')">Excluir</button></td>
            </tr>
        `;
    });

    document.getElementById("formNoticias").addEventListener("submit", async (e) => {
        e.preventDefault();
        const nova = {
            data: document.getElementById("dataNoticia").value,
            materia: document.getElementById("materiaNoticia").value,
            descricao: document.getElementById("conteudoNoticia").value
        };
        await addDoc(collection(db, "noticias"), nova);
        carregarNoticias();
    });
}

// Excluir tarefa
window.excluirTarefa = async function(id) {
    await deleteDoc(doc(db, "tarefas", id));
    carregarTarefas();
};

// Excluir notícia
window.excluirNoticia = async function(id) {
    await deleteDoc(doc(db, "noticias", id));
    carregarNoticias();
};

// Ao carregar o site, abre direto na aba inicial
window.onload = () => {
    trocarAba("pgIncial");
};