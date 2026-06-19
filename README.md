# 🍄 Retro Platformer

A browser-based side-scrolling platformer built with **Next.js**, **TypeScript**, and **Phaser 3**.

## 📸 In-Game Screenshots

<p align="center">
  <img src="https://raw.githubusercontent.com/rust-src/retro-platformer/refs/heads/main/preview1.png" width="60%" />
</p>

<p align="center">
  <em>In-game screenshot (1)</em>
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/rust-src/retro-platformer/refs/heads/main/preview2.png" width="60%" />
</p>

<p align="center">
  <em>In-game screenshot (2)</em>
</p>

> **Every line of code in this repository was written by zAI (Z.ai).** I didn't write the game's code myself—the entire project was created through prompting and iterative feedback.

## 🤖 Why This Exists

This repository is an experiment to answer a simple question:

> **Can an AI build a complete platformer from scratch?**

I spent roughly **half a day** working with zAI, refining prompts, fixing problems, and seeing how far it could get without me writing the code myself.

The end result is... a bit janky.

The physics aren't always right, the gameplay has rough edges, and there are plenty of places where a human developer would have made different decisions. But despite all that, it eventually produced a fully playable game with multiple levels, enemies, a boss fight, procedurally generated graphics, and procedurally generated audio.

I thought that alone made it worth sharing.

---

## ✨ Features

* Three playable levels
* Classic side-scrolling platforming
* Boss fight
* Persistent power-ups between levels
* Procedurally generated pixel art using the HTML5 Canvas API
* Procedurally generated 8-bit sound effects and music using the Web Audio API
* Entirely original assets—no copyrighted graphics or audio

---

## 🛠 Tech Stack

* Next.js (App Router)
* TypeScript
* Phaser 3
* Tailwind CSS
* HTML5 Canvas API
* Web Audio API

---

## 🚀 Running the Game

### Requirements

* Node.js 18+
* npm

Clone the repository and install dependencies:

```bash
git clone https://github.com/rust-src/retro-platformer.git
cd retro-platformer
npm install
npm run dev
```

Then open:

```text
http://localhost:3000
```

> **Note:** Click inside the game window once so your browser captures keyboard input.

---

## 🎮 Controls

| Action           | Keys                       |
| ---------------- | -------------------------- |
| Move             | **A / D** or **← / →**     |
| Jump             | **W**, **Space**, or **↑** |
| Start / Continue | **Enter**                  |

---

## ⭐ Final Thoughts

This project isn't meant to be a polished game. It's a snapshot of what an AI could produce in about half a day's worth of prompting in mid-2026.

It's rough around the edges, but it's also surprisingly complete—and I found that interesting enough to publish.

If you enjoyed checking it out, consider giving the repository a ⭐.
