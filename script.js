// ==== SIMPLE MODERN CALCULATOR (WORKING CLEAN VERSION) ====

const display = document.getElementById("calcDisplay"),
      buttons = document.querySelectorAll(".btn"),
      result = document.getElementById("result"),
      historyList = document.getElementById("historyList"),
      clearHistory = document.getElementById("clearHistory"),
      clearAll = document.getElementById("clearAll"),
      themeToggle = document.getElementById("themeToggle"),
      body = document.body;

let history = JSON.parse(localStorage.getItem("calc_history") || "[]");

// === FUNCTIONS ===

// Show history in UI
const showHistory = () => {
  historyList.innerHTML = "";
  history.slice(-50).reverse().forEach(item => {
    historyList.innerHTML += `<li>${item}</li>`;
  });
};

// Add value to display
const addValue = val => {
  if (val === "C") return (display.value = "", result.textContent = "");
  if (val === ".") {
    const lastNum = display.value.split(/[\+\-\*\/%]/).pop();
    if (lastNum.includes(".")) return;
  }
  display.value += val;
};

// Check if expression is valid
const validExpr = expr => /^[0-9+\-*/.%() \t]+$/.test(expr);

// Calculate
const calc = () => {
  const expr = display.value.trim();
  if (!expr) return;
  if (!validExpr(expr)) return (result.textContent = "❌ Invalid", result.style.color = "#ff4d4d");

  try {
    const safeExpr = expr.replace(/%/g, "/100*");
    const ans = Function(`"use strict";return(${safeExpr})`)();
    display.value = ans;
    result.textContent = `✅ Result: ${ans}`;
    result.style.color = "#00ffae";
    history.push(`${expr} = ${ans}`);
    localStorage.setItem("calc_history", JSON.stringify(history.slice(-50)));
    showHistory();
  } catch {
    result.textContent = "Error";
    result.style.color = "#ff4d4d";
  }
};

// === EVENTS ===

// Buttons
buttons.forEach(b => b.addEventListener("click", () => {
  const v = b.dataset.val;
  v === "=" ? calc() : addValue(v);
}));

// Keyboard
window.addEventListener("keydown", e => {
  const k = e.key;
  if (/^[0-9+\-*/.%()]$/.test(k)) addValue(k);
  if (k === "Enter") calc();
  if (k === "Escape") display.value = result.textContent = "";
  if (k === "Backspace") display.value = display.value.slice(0, -1);
});

// Clear
clearAll.onclick = () => (display.value = result.textContent = "");
clearHistory.onclick = () => (history = [], localStorage.removeItem("calc_history"), showHistory());

// Theme toggle
const setTheme = t => {
  body.dataset.theme = t;
  themeToggle.textContent = t === "dark" ? "🌗" : "🌞";
  localStorage.setItem("calc_theme", t);
};
setTheme(localStorage.getItem("calc_theme") || "dark");
themeToggle.onclick = () => setTheme(body.dataset.theme === "dark" ? "light" : "dark");

// Init
showHistory();
console.log("✅ StellarDev Calculator Ready");
