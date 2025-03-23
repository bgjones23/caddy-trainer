let currentGolfer, currentEvent;
let tips = 0;
let loopCount = 0;
let totalHoles = 9;
let playerName = '';
let lifetimeTips = 0;
let ownedItems = [];

let jokeShownAtStart = false;
let jokeShownAtTurn = false;
let gameInProgress = false;

const avatarDisplay = document.getElementById('avatar');
const gameBox = document.getElementById('game-box');
const choicesBox = document.getElementById('choices');
const startButton = document.getElementById('start-button');
const holeSelector = document.getElementById('hole-selector');
const nameInput = document.getElementById('name-input');
const welcomeMessage = document.getElementById('welcome-message');
const cashTotal = document.getElementById('cash-total');
const shop = document.getElementById('shop');
const shopItemsDiv = document.getElementById('shop-items');

const golfers = [
  { name: "Chad the Business Bro", quirk: "Answers phone mid-swing", bonus: 0 },
  { name: "Linda the Rage Monster", quirk: "Breaks clubs when upset", bonus: 0 },
  { name: "Trevor the YouTube Guy", quirk: "Tries trick shots constantly", bonus: 0 },
  { name: "Marge the Zen Golfer", quirk: "Meditates before every shot", bonus: 0 }
];

const events = [
  { text: "A squirrel steals the ball.", choices: ["Chase it", "Drop a new ball"], outcomes: [10, 0] },
  { text: "UFO hovers over the green.", choices: ["Ignore it", "Signal it"], outcomes: [15, 10] },
  { text: "Cart runs out of power.", choices: ["Push it", "Call backup"], outcomes: [20, 5] },
  { text: "Golfer plays a shot off a rock.", choices: ["Film it", "Look away"], outcomes: [25, 0] },
  { text: "Drone delivers snacks mid-round.", choices: ["Accept snacks", "Wave it off"], outcomes: [30, 0] }
];

const golfJokes = [
  "Why do golfers carry an extra pair of pants? In case they get a hole in one.",
  "What’s a golfer’s worst nightmare? The cart girl running out of beer.",
  "What’s Tiger Woods’ favorite sandwich? Club."
];

const shopItems = [
  { name: "🧢 Bucket Hat", cost: 50, symbol: "🧢" },
  { name: "🕶️ Sunglasses", cost: 100, symbol: "🕶️" },
  { name: "⛳ Caddy Bib", cost: 200, symbol: "⛳" },
  { name: "💎 Legendary Towel", cost: 500, symbol: "💎" },
  { name: "🎧 AirPods", cost: 999, symbol: "🎧" }
];

function savePlayerName() {
  const input = document.getElementById('playerName');
  const name = input.value.trim();
  if (name.length < 2) return alert("Enter a real name, looper.");
  playerName = name;
  localStorage.setItem('caddyName', name);
  if (!localStorage.getItem('caddyTips')) localStorage.setItem('caddyTips', '0');
  if (!localStorage.getItem('caddyGear')) localStorage.setItem('caddyGear', '[]');
  lifetimeTips = parseInt(localStorage.getItem('caddyTips')) || 0;
  ownedItems = JSON.parse(localStorage.getItem('caddyGear')) || [];
  updateHUD();
  nameInput.style.display = 'none';
  holeSelector.style.display = 'block';
}

function updateHUD() {
  welcomeMessage.textContent = `Welcome, ${playerName}.`;
  cashTotal.textContent = `Lifetime Tips: $${lifetimeTips}`;
  updateAvatar();
}

function updateAvatar() {
  const base = "🧍";
  const gear = ownedItems.map(item => item.symbol).join(" ");
  avatarDisplay.innerHTML = `${base} ${gear}`;
}

function renderShop() {
  shopItemsDiv.innerHTML = '';
  shop.style.display = 'block';
  shopItems.forEach(item => {
    if (!ownedItems.some(i => i.name === item.name)) {
      const btn = document.createElement('button');
      btn.textContent = `${item.name} - $${item.cost}`;
      btn.onclick = () => buyItem(item);
      shopItemsDiv.appendChild(btn);
    }
  });
}

function buyItem(item) {
  if (gameInProgress) {
    alert("The Pro Shop is closed during rounds. Loop first, shop after.");
    return;
  }
  if (lifetimeTips < item.cost) {
    alert("You don’t have enough tips for that, looper.");
    return;
  }
  lifetimeTips -= item.cost;
  ownedItems.push(item);
  localStorage.setItem('caddyTips', lifetimeTips);
  localStorage.setItem('caddyGear', JSON.stringify(ownedItems));
  updateHUD();
  renderShop();
}

function setHoleCount(count) {
  totalHoles = count;
  holeSelector.style.display = 'none';
  startButton.style.display = 'inline-block';
}

startButton.addEventListener('click', startGame);

function getRandomJoke() {
  return golfJokes[Math.floor(Math.random() * golfJokes.length)];
}

function startGame() {
  tips = 0;
  loopCount = 0;
  jokeShownAtStart = false;
  jokeShownAtTurn = false;
  gameInProgress = true;
  shop.style.display = 'none';
  startButton.style.display = 'none';
  gameBox.innerHTML = '';
  nextEvent();
}

function nextEvent() {
  if (loopCount >= totalHoles) {
    endGame();
    return;
  }

  if (loopCount === 0) {
    currentGolfer = golfers[Math.floor(Math.random() * golfers.length)];
    gameBox.innerHTML = `<h2>Your Golfer: ${currentGolfer.name}</h2><p>Quirk: ${currentGolfer.quirk}</p>`;
    showGolfJoke('start');
  } else if (loopCount === 9 && totalHoles === 18 && !jokeShownAtTurn) {
    showGolfJoke('turn');
  } else {
    currentEvent = events[Math.floor(Math.random() * events.length)];
    gameBox.innerHTML = `<h3>Hole ${loopCount + 1}</h3><p>${currentEvent.text}</p>`;
    choicesBox.innerHTML = '';
    currentEvent.choices.forEach((choice, index) => {
      const btn = document.createElement('button');
      btn.textContent = choice;
      btn.onclick = () => handleChoice(index);
      choicesBox.appendChild(btn);
    });
  }

  loopCount++;
}

function showGolfJoke(timing) {
  const joke = getRandomJoke();
  const timingLabel = timing === 'start' ? "Before the First Tee" : "At the Turn";
  gameBox.innerHTML += `<p style="margin-top:20px; font-style:italic;">Golf Joke (${timingLabel}):<br>🃏 ${joke}</p>`;
  choicesBox.innerHTML = '';
  setTimeout(() => nextEvent(), 3000);
  if (timing === 'start') jokeShownAtStart = true;
  if (timing === 'turn') jokeShownAtTurn = true;
}

function handleChoice(choiceIndex) {
  const eventTips = Math.max(0, currentEvent.outcomes[choiceIndex]); // $0 or positive only
  tips += eventTips;
  const resultText = eventTips > 0 ? "Nice call!" : "Oof. No tip.";
  gameBox.innerHTML = `<p>${resultText} ${eventTips > 0 ? `(+$${eventTips})` : ""}</p>`;
  choicesBox.innerHTML = '';
  setTimeout(nextEvent, 1500);
}

function endGame() {
  gameInProgress = false;
  lifetimeTips += tips;
  localStorage.setItem('caddyTips', lifetimeTips.toString());
  updateHUD();
  renderShop();
  gameBox.innerHTML = `<h2>Loop Complete!</h2><p>You earned $${tips} in tips over ${totalHoles} holes.</p>`;
  choicesBox.innerHTML = '';
  startButton.textContent = "Play Again";
  holeSelector.style.display = 'block';
}
