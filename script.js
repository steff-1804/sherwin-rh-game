let gameQuestions = [];
let current = 0;
let score = 0;
let answers = [];

const $ = (id) => document.getElementById(id);

function normalizeAnswer(value){
  return value ? "Sí es riesgo psicosocial" : "No es riesgo / gestión normal";
}

function feedbackText(question, selected){
  const correct = selected === question.isRisk;
  const dimension = question.dimension;

  let base = "";
  if(question.isRisk){
    base = `La situación sí representa un posible riesgo psicosocial dentro de la dimensión "${dimension}" porque puede afectar el bienestar, la comunicación, la carga laboral o las relaciones de trabajo.`;
  }else{
    base = `La situación no necesariamente representa un riesgo psicosocial. Puede ser una acción normal de gestión, seguimiento o control laboral si se realiza con respeto, claridad y dentro de las normas.`;
  }

  if(correct){
    return `Correcto. ${base}`;
  }

  return `Incorrecto. La respuesta correcta era: "${normalizeAnswer(question.isRisk)}". ${base}`;
}

function shuffle(array){
  return [...array].sort(() => Math.random() - 0.5);
}

function init(){
  const select = $("dimensionSelect");
  DIMENSIONS.forEach(d => {
    const opt = document.createElement("option");
    opt.value = d;
    opt.textContent = d;
    select.appendChild(opt);
  });

  $("btnStart").addEventListener("click", startGame);
  $("btnRisk").addEventListener("click", () => answer(true));
  $("btnNoRisk").addEventListener("click", () => answer(false));
  $("btnNext").addEventListener("click", nextQuestion);
  $("btnRestart").addEventListener("click", () => showScreen("screenStart"));
  $("btnReview").addEventListener("click", toggleReview);
}

function showScreen(id){
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  $(id).classList.add("active");
}

function startGame(){
  const selectedDimension = $("dimensionSelect").value;
  const count = Number($("questionCount").value);

  let pool = selectedDimension === "TODOS"
    ? QUESTIONS
    : QUESTIONS.filter(q => q.dimension === selectedDimension);

  pool = shuffle(pool);
  gameQuestions = count === 999 ? pool : pool.slice(0, Math.min(count, pool.length));

  current = 0;
  score = 0;
  answers = [];

  if(gameQuestions.length === 0){
    alert("No hay preguntas para este tema.");
    return;
  }

  $("totalQuestions").textContent = gameQuestions.length;
  $("score").textContent = score;
  showScreen("screenGame");
  renderQuestion();
}

function renderQuestion(){
  const q = gameQuestions[current];

  $("currentDimension").textContent = q.dimension;
  $("currentIndex").textContent = current + 1;
  $("dimensionChip").textContent = q.dimension;
  $("caseText").textContent = q.case;
  $("score").textContent = score;

  const progress = ((current) / gameQuestions.length) * 100;
  $("progressBar").style.width = `${progress}%`;

  $("feedback").className = "feedback hidden";
  $("feedback").innerHTML = "";
  $("btnNext").classList.add("hidden");

  $("btnRisk").disabled = false;
  $("btnNoRisk").disabled = false;
}

function answer(selected){
  const q = gameQuestions[current];
  const correct = selected === q.isRisk;

  if(correct) score++;

  answers.push({
    question: q,
    selected,
    correct
  });

  $("score").textContent = score;
  $("feedback").className = `feedback ${correct ? "correct" : "incorrect"}`;
  $("feedback").innerHTML = feedbackText(q, selected);

  $("btnRisk").disabled = true;
  $("btnNoRisk").disabled = true;
  $("btnNext").classList.remove("hidden");
  $("progressBar").style.width = `${((current + 1) / gameQuestions.length) * 100}%`;
}

function nextQuestion(){
  current++;
  if(current >= gameQuestions.length){
    finishGame();
  }else{
    renderQuestion();
  }
}

function finishGame(){
  showScreen("screenResult");

  const total = gameQuestions.length;
  const percent = Math.round((score / total) * 100);

  $("finalScore").textContent = `${score}/${total}`;
  $("finalTitle").textContent = percent >= 80 ? "¡Excelente criterio preventivo!" :
                                percent >= 60 ? "Buen avance, falta afinar criterios" :
                                "Hay que reforzar conceptos";

  $("finalMessage").textContent =
    percent >= 80
      ? "Identificaste correctamente la mayoría de situaciones. Buen manejo de riesgos psicosociales."
      : percent >= 60
        ? "Reconoces varios casos, pero debes diferenciar mejor entre riesgo real y gestión laboral normal."
        : "Necesitas repasar los conceptos. Revisa especialmente las situaciones que parecen normales pero pueden afectar el bienestar.";

  renderReview();
}

function renderReview(){
  const list = $("reviewList");
  list.innerHTML = answers.map((a, i) => `
    <article class="review-item">
      <strong>${i + 1}. ${a.question.case}</strong>
      <div>Dimensión: <b>${a.question.dimension}</b></div>
      <div>Tu respuesta: <span class="${a.correct ? "ok" : "bad"}">${normalizeAnswer(a.selected)}</span></div>
      <div>Respuesta correcta: <b>${normalizeAnswer(a.question.isRisk)}</b></div>
    </article>
  `).join("");
}

function toggleReview(){
  $("reviewPanel").classList.toggle("hidden");
}

init();
