const QUESTIONS = [
  {
    "theme": "Estrés laboral y sus efectos en la salud",
    "case": "Un colaborador informa cansancio constante, dolor de cabeza y dificultad para concentrarse por presión continua de entrega.",
    "answer": true,
    "feedback": "Sí es riesgo: hay señales de afectación física y mental asociadas a presión laboral sostenida."
  },
  {
    "theme": "Estrés laboral y sus efectos en la salud",
    "case": "El supervisor solicita terminar una tarea urgente dentro de la jornada, explicando prioridad y recursos disponibles.",
    "answer": false,
    "feedback": "No necesariamente es riesgo: puede ser gestión normal si se comunica con respeto y no es una exigencia abusiva o permanente."
  },
  {
    "theme": "Burnout o síndrome de agotamiento laboral",
    "case": "Una persona expresa que se siente emocionalmente agotada, sin motivación y con rechazo constante hacia sus tareas.",
    "answer": true,
    "feedback": "Sí es riesgo: son señales compatibles con agotamiento laboral o burnout."
  },
  {
    "theme": "Burnout o síndrome de agotamiento laboral",
    "case": "Después de una semana intensa, el equipo toma pausas activas y redistribuye tareas para recuperar el ritmo normal.",
    "answer": false,
    "feedback": "No necesariamente es riesgo: aplicar pausas y redistribución es una medida preventiva."
  },
  {
    "theme": "Acoso laboral en el ambiente de trabajo",
    "case": "Un jefe ridiculiza repetidamente a un colaborador frente al equipo y le asigna tareas humillantes.",
    "answer": true,
    "feedback": "Sí es riesgo: la humillación repetida puede constituir acoso laboral o mobbing."
  },
  {
    "theme": "Acoso laboral en el ambiente de trabajo",
    "case": "El líder corrige un error operativo en privado, con evidencia y explicando la forma correcta de trabajar.",
    "answer": false,
    "feedback": "No necesariamente es riesgo: la retroalimentación técnica, respetuosa y privada es parte de la gestión laboral."
  },
  {
    "theme": "Salud mental y bienestar ocupacional",
    "case": "Un trabajador evita interactuar, llora frecuentemente y comenta que el ambiente laboral le está afectando.",
    "answer": true,
    "feedback": "Sí es riesgo: hay señales de posible afectación emocional vinculada al trabajo."
  },
  {
    "theme": "Salud mental y bienestar ocupacional",
    "case": "La empresa realiza una encuesta de clima laboral para identificar oportunidades de mejora.",
    "answer": false,
    "feedback": "No es riesgo por sí mismo: es una herramienta preventiva si se usa con confidencialidad y mejora real."
  },
  {
    "theme": "Carga laboral y fatiga mental",
    "case": "Una persona debe cubrir dos puestos por varias semanas sin apoyo ni ajuste de tiempos.",
    "answer": true,
    "feedback": "Sí es riesgo: existe sobrecarga laboral sostenida y posible fatiga mental."
  },
  {
    "theme": "Carga laboral y fatiga mental",
    "case": "Durante una auditoría se asignan tareas adicionales por un día, con apoyo del equipo y prioridad definida.",
    "answer": false,
    "feedback": "No necesariamente es riesgo: una demanda puntual y controlada puede ser parte del trabajo normal."
  },
  {
    "theme": "Comunicación y relaciones laborales",
    "case": "Los compañeros excluyen constantemente a una persona de reuniones necesarias para hacer su trabajo.",
    "answer": true,
    "feedback": "Sí es riesgo: la exclusión sistemática puede afectar relaciones, desempeño y bienestar."
  },
  {
    "theme": "Comunicación y relaciones laborales",
    "case": "Un equipo establece reglas claras para reportar avances diarios y evitar confusiones.",
    "answer": false,
    "feedback": "No es riesgo por sí mismo: la organización y comunicación clara reducen errores y tensión."
  }
];
const THEMES = [
  "Acoso laboral en el ambiente de trabajo",
  "Burnout o síndrome de agotamiento laboral",
  "Carga laboral y fatiga mental",
  "Comunicación y relaciones laborales",
  "Estrés laboral y sus efectos en la salud",
  "Salud mental y bienestar ocupacional"
];

const $ = (id) => document.getElementById(id);

let pool = [];
let current = 0;
let score = 0;
let history = [];

function shuffle(arr){
  return [...arr].sort(() => Math.random() - 0.5);
}

function show(id){
  ["startScreen","gameScreen","resultScreen"].forEach(s => $(s).classList.add("hidden"));
  $(id).classList.remove("hidden");
}

function init(){
  THEMES.forEach(t => {
    const opt = document.createElement("option");
    opt.value = t;
    opt.textContent = t;
    $("topicSelect").appendChild(opt);
  });

  $("startBtn").addEventListener("click", startGame);
  $("riskBtn").addEventListener("click", () => answer(true));
  $("notRiskBtn").addEventListener("click", () => answer(false));
  $("nextBtn").addEventListener("click", next);
  $("restartBtn").addEventListener("click", () => show("startScreen"));
  $("reviewBtn").addEventListener("click", () => $("review").classList.toggle("hidden"));
}

function startGame(){
  const topic = $("topicSelect").value;
  const amount = Number($("amountSelect").value);
  let filtered = topic === "TODOS" ? QUESTIONS : QUESTIONS.filter(q => q.theme === topic);
  filtered = shuffle(filtered);
  pool = amount === 999 ? filtered : filtered.slice(0, Math.min(amount, filtered.length));
  current = 0;
  score = 0;
  history = [];
  show("gameScreen");
  renderQuestion();
}

function renderQuestion(){
  const q = pool[current];
  $("topicChip").textContent = q.theme;
  $("counter").textContent = `${current + 1}/${pool.length}`;
  $("score").textContent = score;
  $("questionText").textContent = q.case;
  $("progress").style.width = `${(current / pool.length) * 100}%`;
  $("feedback").className = "feedback hidden";
  $("feedback").textContent = "";
  $("nextBtn").classList.add("hidden");
  $("riskBtn").disabled = false;
  $("notRiskBtn").disabled = false;
}

function answer(selected){
  const q = pool[current];
  const correct = selected === q.answer;
  if(correct) score++;

  history.push({...q, selected, correct});

  $("score").textContent = score;
  $("feedback").className = `feedback ${correct ? "correct" : "incorrect"}`;
  $("feedback").textContent = `${correct ? "Correcto." : "Incorrecto."} ${q.feedback}`;
  $("progress").style.width = `${((current + 1) / pool.length) * 100}%`;
  $("riskBtn").disabled = true;
  $("notRiskBtn").disabled = true;
  $("nextBtn").classList.remove("hidden");
}

function next(){
  current++;
  if(current >= pool.length){
    finish();
  }else{
    renderQuestion();
  }
}

function finish(){
  show("resultScreen");
  const percent = Math.round((score / pool.length) * 100);
  $("resultScore").textContent = `${score}/${pool.length}`;
  $("resultTitle").textContent = percent >= 80 ? "¡Excelente!" : percent >= 60 ? "Buen avance" : "Hay que reforzar";
  $("resultMessage").textContent = percent >= 80
    ? "Identificaste correctamente la mayoría de situaciones."
    : percent >= 60
      ? "Tienes una base aceptable, pero conviene reforzar criterios."
      : "Debes repasar la diferencia entre riesgo psicosocial y gestión laboral normal.";

  $("review").innerHTML = history.map((h,i) => `
    <div class="review-item">
      <b>${i+1}. ${h.case}</b><br>
      Tema: ${h.theme}<br>
      Tu respuesta: <span class="${h.correct ? "ok" : "bad"}">${h.selected ? "Sí es riesgo" : "No es riesgo"}</span><br>
      Correcta: <b>${h.answer ? "Sí es riesgo" : "No es riesgo"}</b>
    </div>
  `).join("");
}

init();
