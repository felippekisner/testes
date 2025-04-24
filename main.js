// Firebase Configuração já existente
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

// Referências
const toggleButton = document.getElementById("menu-toggle");
const sidebar = document.getElementById("sidebar");

// Hover no botão abre a sidebar e troca o texto
toggleButton.addEventListener("mouseenter", () => {
  sidebar.classList.add("open");
  toggleButton.textContent = "Organizador";
});

const toggleSidebar = () => {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('open');
  };
  
  document.getElementById('menu-toggle').addEventListener('click', toggleSidebar);
  

// Quando o mouse sair da sidebar, fecha e volta o texto
sidebar.addEventListener("mouseleave", () => {
  sidebar.classList.remove("open");
  toggleButton.textContent = "☰";
});

// Fechar sidebar ao selecionar uma aba (em dispositivos móveis)
document.querySelectorAll("#sidebar a").forEach(link => {
  link.addEventListener("click", () => {
    if (window.innerWidth <= 768) {
      sidebar.classList.remove("open");
      toggleButton.textContent = "☰";
    }
  });
});

// Troca entre abas
window.trocarAba = function(abaId) {
    document.querySelectorAll('.tab-content').forEach(div => div.style.display = 'none');
    document.getElementById(abaId).style.display = 'block';

    if (abaId === 'pgIncial') carregarInicial();
    if (abaId === 'tarefas') carregarTarefas();
    if (abaId === 'noticias') carregarNoticias();
    if (abaId === 'horarios') carregarHorarios();
    if (abaId === 'professores') carregarProfessores();
};

// Ao carregar o site, abre direto na aba inicial
window.onload = () => {
    trocarAba("pgIncial");
    ajustarSidebar();
};

// Função para ajustar a sidebar em telas pequenas
function ajustarSidebar() {
  if (window.innerWidth <= 768) {
    sidebar.classList.remove("open");
    toggleButton.textContent = "☰";
  }
}

// Recalcular ao redimensionar a janela
window.addEventListener("resize", ajustarSidebar);

// --- TAREFAS ---

function carregarTarefas() {
    document.getElementById("tarefas").innerHTML = `
    <h2> Cadastrar Tarefas </h2>
        <form id="formTarefa">
            <label>Data:</label>
            <input type="date" id="dataTarefa" required>
            <label>Matéria:</label>
            <select id="materiaTarefa">
                ${gerarOpcoesMateria()}
            </select>
            <label>Tipo de Avaliação:</label>
            <select id="tipoTarefa">
                <option>Trabalho</option>
                <option>Prova</option>
                <option>Tarefa</option>
            </select>
            <label>Tarefa:</label>
            <textarea id="descricaoTarefa" rows="4"></textarea>
            <button type="submit">Adicionar</button>
        </form>
        <table>
            <thead>
                <tr><th>Data</th><th>Matéria</th><th>Tipo</th><th>Tarefa</th><th>Ação</th></tr>
            </thead>
            <tbody id="listaTarefas"></tbody>
        </table>
    `;

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
}

async function atualizarTabelaTarefas() {
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
}

window.excluirTarefa = async function(id) {
    await deleteDoc(doc(db, "tarefas", id));
    carregarTarefas();
};



// --- NOTÍCIAS ---
function carregarNoticias() {
    document.getElementById("noticias").innerHTML = `
    <h2> Cadastrar Noticias </h2>
        <form id="formNoticias">
            <label>Data:</label>
            <input type="date" id="dataNoticia" placeholder="Ex: 23/04/25" required>
            <label>Matéria:</label>
            <select id="materiaNoticia">
                <option>Mensagem do Instituto</option>
                ${gerarOpcoesMateria()}
            </select>
            <label>Notícia:</label>
            <textarea id="descricaoNoticia" rows="4"></textarea>
             <label for="arquivo">Arquivo:</label>
    <input type="file" id="arquivo" name="arquivo" required />
            <button type="submit">Adicionar</button>
        </form>
        <table>
            <thead>
                <tr><th>Data</th><th>Matéria</th><th>Notícia</th><th>Ação</th></tr>
            </thead>
            <tbody id="listaNoticias"></tbody>
        </table>
    `;

    document.getElementById("formNoticias").addEventListener("submit", async (e) => {
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
}

async function atualizarTabelaNoticias() {
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
}

window.excluirNoticia = async function(id) {
    await deleteDoc(doc(db, "noticias", id));
    carregarNoticias();
};

// --- HORÁRIOS (fixos no HTML mesmo) ---
function carregarHorarios() {
    document.getElementById("horarios").innerHTML = `
        <h2>Horário de Aulas</h2>
        <table>
            <tr>
                <th>Segunda</th><th>Terça</th><th>Quarta</th><th>Quinta</th><th>Sexta</th>
            </tr>
            <tr>
                <td><strong>Manhã</strong><br>Inglês<br>Inglês<br><strong>Lanche</strong><br>Geografia<br>Geografia<br>Biologia</td>
                <td><strong>Manhã</strong><br>Hardware<br>Hardware<br><strong>Lanche</strong><br>Filosofia<br>Lógica de Programação<br>Lógica de Programação</td>
                <td><strong>Manhã</strong><br>Química<br>Química<br><strong>Lanche</strong><br>Matemática<br>Matemática<br>Filosofia</td>
                <td><strong>Manhã</strong><br>História<br>Artes<br><strong>Lanche</strong><br>Artes<br>Lógica de Programação<br>Lógica de Programação</td>
                <td><strong>Manhã</strong><br>Português<br>Português<br><strong>Lanche</strong><br>Português<br>Educação Física<br>Educação Física</td>
            </tr>
            <tr>
                <td><strong>Tarde</strong><br>Biologia<br>Matemática<br>Matemática<br><strong>Lanche</strong><br>Web Design<br>Web Design</td>
                <td></td>
                <td><strong>Tarde</strong><br>História<br>Hardware<br>Hardware<br><strong>Lanche</strong><br>Metodologia Científica<br>Metodologia Científica</td>
                <td></td>
                <td><strong>Tarde</strong><br>Física<br>Física<br>Fundamentos da Informática<br><strong>Lanche</strong><br>Fundamentos da Informática</td>
            </tr>
        </table>
    `;
}
function carregarInicial() {
    document.getElementById("pgInicial").innerHTML = `
        <h2>Introdução</h2> <br>
        <p>                                                 Bem-vindo ao seu espaço de apoio à organização escolar! Este site foi criado especialmente para ajudar alunos como você a se manterem organizados, motivados e no controle da rotina de estudos. Aqui, você vai encontrar dicas, ferramentas e materiais que facilitam o planejamento das tarefas, o gerenciamento do tempo e o alcance de melhores resultados na escola. 
        Tudo pensado para tornar o seu dia a dia mais leve e produtivo.</p>
        
        
    `;
}

// --- PROFESSORES (fixos no HTML mesmo) ---
function carregarProfessores() {
    document.getElementById("professores").innerHTML = `
        <h2>Professores e Contato</h2>
        <table>
            <thead>
                <tr><th>Matéria</th><th>Nome do Professor</th><th>E-mail</th></tr>
            </thead>
            <tbody>
                <tr><td>Artes</td><td>Suzana Back</td><td>suzana.back@ifc.edu.br</td></tr>
                <tr><td>Biologia</td><td>Karlan Rau</td><td>karlan.rau@ifc.edu.br</td></tr>
                <tr><td>Educação Física</td><td>Daniel Minuzzi de Souza</td><td>daniel.souza@ifc.edu.br</td></tr>
                <tr><td>Filosofia</td><td>Adaltro Prochnov Nunes</td><td>adaltro.nunes@ifc.edu.br</td></tr>
                <tr><td>Física</td><td>Cinta Barbosa Passos</td><td>cinta.passos@ifc.edu.br</td></tr>
                <tr><td>Fundamentos da Informática</td><td>Adriano Pizzini</td><td>adriano.pizzini@ifc.edu.br</td></tr>
                <tr><td>Geografia</td><td>Cloves Alexandre de Castro</td><td>cloves.castro@ifc.edu.br</td></tr>
                <tr><td>Hardware e Sistemas Operacionais</td><td>Heverton Mendes de Oliveira</td><td>heverton.oliveira@ifc.edu.br</td></tr>
                <tr><td>História</td><td>Anderson Negru Galcoswki</td><td>anderson.galcoswki@ifc.edu.br</td></tr>
                <tr><td>Inglês</td><td>Rita de Cássia da Silveira Cordeiro</td><td>rita.cordeiro@ifc.edu.br</td></tr>
                <tr><td>Língua Portuguesa</td><td>Cleonice Marisa de Brito Nazedok</td><td>cleonice.nazedok@ifc.edu.br</td></tr>
                <tr><td>Lógica de Programação</td><td>Riad Mattos Nassife</td><td>riad.nassife@ifc.edu.br</td></tr>
                <tr><td>Matemática</td><td>Micheli Cristina Starosky Roloff</td><td>micheli.roloff@ifc.edu.br</td></tr>
                <tr><td>Metodologia Científica</td><td>Fani Luci Martendal Bernhardt</td><td>fani.bernhardt@ifc.edu.br</td></tr>
                <tr><td>Química</td><td>Carlos Eduardo Bencke</td><td>carlos.bencke@ifc.edu.br</td></tr>
                <tr><td>Web Design</td><td>Shirlei Magali Vendrami</td><td>shirlei.vendrami@ifc.edu.br</td></tr>
            </tbody>
        </table>
    `;
}

// Função auxiliar para montar as <option> de matérias
function gerarOpcoesMateria() {
    const materias = [
        "Matemática", "Português", "Física", "Química", "Biologia", "História",
        "Geografia", "Inglês", "Filosofia", "Artes", "Educação Física",
        "Web Design", "Lógica de Programação", "Hardware", "Metodologia Científica", "Fundamentos da Informática"
    ];
    return materias.map(m => `<option>${m}</option>`).join("");
}
