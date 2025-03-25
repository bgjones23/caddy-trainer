const golfers = [
  { name: "Chad the Business Bro", quirk: "Answers phone mid-swing", bonus: 0 },
  { name: "Linda the Rage Monster", quirk: "Breaks clubs when upset", bonus: 0 },
  { name: "Trevor the YouTube Guy", quirk: "Tries trick shots constantly", bonus: 0 },
  { name: "Marge the Zen Golfer", quirk: "Meditates before every shot", bonus: 0 },
  { name: "Zhu the Child Prodigy", quirk: "Genius, but flips out easily", bonus: 0 }
];

const golfJokes = [
"How does a golfer stay in shape? By doing lots of swing sets.",
"What's Tiger Woods' favorite sandwich? Club.",
"What's a golfer's favorite dance move? The bogey boogie.",
"What’s a golfer’s worst nightmare? The cart girl running out of beer.",
"Why did the ball go to therapy? Too much pressure on the green.",
"Why did the caddy get promoted? He was tee-rific.",
"Why did the golf ball break up with the tee? It felt too grounded.",
"Why did the golf ball get kicked out of the party? It kept bouncing around and causing a scene.",
"Why did the golf ball go to the dance? It wanted to practice its swing.",
"Why did the golf club break up with the ball? It just needed some space.",
"Why did the golf course get so quiet? Everyone was trying to find their inner fairway.",
"Why did the golfer bring a ladder to the game? To improve his swing elevation.",
"Why did the golfer bring an extra pair of pants? In case he got a hole-in-one.",
"Why did the golfer bring two shirts? In case he got a hole in one.",
"Why did the golfer carry a bucket of paint? To work on his stroke.",
"Why did the golfer get a job at the bank? He was good at making deposits in the sand trap.",
"Why did the golfer get kicked out of geometry class? Too many angles on his swing.",
"Why did the golfer get kicked out of the zoo? He tried to chip an elephant.",
"Why did the golfer go to the bakery? He needed a slice of humble pie.",
"Why did the golfer go to the library? To work on his reading greens.",
"Why did the golfer hate math? Too many divots and not enough angles.",
"Why did the putter break up with the driver? It was tired of being left out on long distances.",
"Why do golfers always bring a pencil to the course? Just in case they need to draw a bogey.",
"Why do golfers carry an extra pair of pants? In case they get a hole in one.",
"Why do golfers never fight with trees? They know they'll just leave.",
"Why don't golfers ever get lost? They always follow the course.",
"Why was the golf club so good at karaoke? It always hit the right pitch.",
"Why was the golfer always broke? Because he kept making poor drives.",
"Why was the golfer so calm during the storm? He knew how to keep his swing under par.",
];

const events = [
  // Common events
  { text: "A squirrel steals the ball.", choices: ["Chase it", "Drop a new ball"], outcomes: [10, 0] },
  { text: "Golfer insists on using driver for a chip shot.", choices: ["Talk them out of it", "Let them cook"], outcomes: [20, 0] },
  { text: "A drone drops a hot dog mid-round.", choices: ["Eat it", "Ignore it"], outcomes: [15, 5] },
  { text: "Golfer plays air guitar with their putter.", choices: ["Cheer them on", "Ask them to focus"], outcomes: [10, 0] },
  { text: "Cart dies near the bunker.", choices: ["Push it", "Call for help"], outcomes: [20, 5] },
  { text: "Ball lands in another golfer’s nachos.", choices: ["Replace ball", "Play it anyway"], outcomes: [0, 25] },
  { text: "The wind starts singing 'Eye of the Tiger'.", choices: ["Flex with confidence", "Act casual"], outcomes: [30, 15] },

  // Rare/absurd events
  { text: "A time traveler asks for directions to the clubhouse.", choices: ["Point left", "Point right"], outcomes: [50, 25] },
  { text: "You find a glowing golf ball marked 'EXCALIBALL'.", choices: ["Use it", "Save it for later"], outcomes: [50, 0] },
  { text: "An alpaca wanders across the fairway.", choices: ["Offer a snack", "Take a selfie"], outcomes: [25, 15] },
  { text: "You write a haiku mid-loop.", choices: ["Share it", "Keep it secret"], outcomes: [30, 20] }
];

const shopItems = [
  { name: "🧢 Bucket Hat", cost: 50, symbol: "🧢" },
  { name: "🕶️ Sunglasses", cost: 100, symbol: "🕶️" },
  { name: "⛳ Caddy Bib", cost: 200, symbol: "⛳" },
  { name: "💎 Legendary Towel", cost: 500, symbol: "💎" },
  { name: "🎧 AirPods", cost: 999, symbol: "🎧" },
  { name: "👕 Signed Tiger Woods polo", cost: 2500, symbol: "👕" }
];

// Game state
let currentGolfer, currentEvent;
let tips = 0;
let loopCount = 0;
let totalHoles = 9;
let playerName = '';
let lifetimeTips = 0;
let ownedItems = [];
let leaderboard = [];

let jokeShownAtStart = false;
let jokeShownAtTurn = false;
let gameInProgress = false;

// DOM
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
const leaderboardDiv = document.getElementById('leaderboard');
const leaderboardList = document.getElementById('leaderboard-list');

function savePlayerName() {
  const input = document.getElementById('playerName');
  const name = input.value.trim();
  if (name.length < 2) return alert("Enter a real name, looper.");
  playerName = name;
  localStorage.setItem('caddyName', name);
  if (!localStorage.getItem('caddyTips')) localStorage.setItem('caddyTips', '0');
  if (!localStorage.getItem('caddyGear')) localStorage.setItem('caddyGear', '[]');
  if (!localStorage.getItem('caddyLeaderboard')) localStorage.setItem('caddyLeaderboard', '[]');
  lifetimeTips = parseInt(localStorage.getItem('caddyTips')) || 0;
  ownedItems = JSON.parse(localStorage.getItem('caddyGear')) || [];
  leaderboard = JSON.parse(localStorage.getItem('caddyLeaderboard')) || [];
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
  if (gameInProgress) return alert("The Pro Shop is closed during rounds.");
  if (lifetimeTips < item.cost) return alert("You don’t have enough tips for that.");
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
  leaderboardDiv.style.display = 'none';
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
  setTimeout(() => nextEvent(), 7000);
  if (timing === 'start') jokeShownAtStart = true;
  if (timing === 'turn') jokeShownAtTurn = true;
}

function handleChoice(choiceIndex) {
  const eventTips = Math.max(0, currentEvent.outcomes[choiceIndex]);
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
  updateLeaderboard();
  renderShop();
  gameBox.innerHTML = `<h2>Loop Complete!</h2><p>You earned $${tips} in tips over ${totalHoles} holes.</p>`;
  choicesBox.innerHTML = '';
  startButton.textContent = "Play Again";
  holeSelector.style.display = 'block';
  leaderboardDiv.style.display = 'block';
  renderLeaderboard();
}

// --- Firebase Leaderboard Integration ---
async function updateLeaderboard() {
  try {
    await db.collection("leaderboard").add({
      name: playerName,
      tips: tips,
      timestamp: new Date()
    });
    gameBox.innerHTML += "<p style='color:lightgreen;'>✅ Score submitted to global leaderboard!</p>";
  } catch (e) {
    console.error("Error saving to leaderboard:", e);
    gameBox.innerHTML += "<p style='color:red;'>⚠️ Failed to submit score. Check Firestore permissions.</p>";
  }
}

async function renderLeaderboard() {
  leaderboardList.innerHTML = '';
  try {
    const snapshot = await db.collection("leaderboard")
      .orderBy("tips", "desc")
      .limit(10)
      .get();

    let rank = 1;
    snapshot.forEach((doc) => {
      const entry = doc.data();
      const li = document.createElement('li');

      // Capitalize first letters of name
      const nameFormatted = entry.name
        ? entry.name.charAt(0).toUpperCase() + entry.name.slice(1)
        : "Unknown Caddy";

      li.textContent = `#${rank} - ${nameFormatted}: $${entry.tips}`;
      leaderboardList.appendChild(li);
      rank++;
    });
  } catch (e) {
    console.error("Error loading leaderboard:", e);
    leaderboardList.innerHTML = '<li>⚠️ Failed to load leaderboard</li>';
  }
}
