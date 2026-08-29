# 💌 Interactive Love Letter / Anniversary Website — Complete Blueprint & Source Code

This document provides everything you need to create your own standalone, self-contained **Interactive Love Letter / Anniversary Experience** in your own repository.

---

## 🌟 What This Project Includes
1. ✉️ **Interactive Wax Seal Envelope**: Envelope flips open with particle burst VFX and paper rustling sound.
2. 📜 **Typewriter Love Letter**: Heartfelt letter reveals character-by-character with mechanical typing SFX and a "Skip" option.
3. 🏃‍♂️ **Playful "No" & Growing "Yes"**: The "No" button playfully runs away when hovered/touched, changing text step-by-step while "Yes" grows bigger and glows brighter.
4. 🎵 **Zero-Asset Chiptune Music Box (Web Audio API)**: Built-in 8-bit romantic BGM synthesizer playing soothing chiptune music without needing any external `.mp3` files!
5. 🎆 **Pixel Heart Fireworks & Confetti**: Fullscreen canvas fireworks display upon clicking "Yes".
6. ⏱️ **Real-Time Relationship Milestone Ticker**: Live counter tracking Days, Hours, Minutes, Seconds together from your special date.
7. 📸 **Exportable Memory Card (`.png`)**: HTML5 Canvas rendering a downloadable commemorative souvenir card.
8. 💖 **Cursor & Touch Particle Trail**: Floating hearts and stars follow mouse and touch movements.

---

## 🚀 Quick Start in Your Own Repository

### Step 1: Create a new repository
Create a new GitHub repository (e.g. `my-love-letter` or `anniversary`).

### Step 2: Create `index.html`
Copy the complete, production-ready code from the section below into a file named **`index.html`** in your repository.

### Step 3: Customize your details
Edit the customizable variables in the `<script>` section (names, anniversary date, love letter message, colors).

### Step 4: Publish to GitHub Pages
1. Go to **Repository Settings** > **Pages**.
2. Under **Branch**, select `main` and root `/`.
3. Click **Save** — your personalized site is live!

---

## 📦 Complete Standalone `index.html` Source Code

```html
<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <title>💌 A Special Letter For You</title>
  
  <!-- Retro & Modern Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Mali:wght@400;600;700&family=VT323&family=Press+Start+2P&display=swap" rel="stylesheet">

  <style>
    :root {
      --bg: #121826;
      --envelope-bg: #f5ebe0;
      --envelope-dark: #e6ccb2;
      --primary-pink: #ff6b8b;
      --primary-pink-hover: #ff4770;
      --gold: #ffd166;
      --seal-red: #d90429;
      --dark-text: #2b2d42;
      --light-text: #edf2f4;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      user-select: none;
      -webkit-user-select: none;
    }

    body {
      background: radial-gradient(circle at center, #1e293b 0%, #0f172a 100%);
      color: var(--light-text);
      font-family: 'Mali', cursive, sans-serif;
      min-height: 100vh;
      overflow-x: hidden;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;
    }

    /* Floating Canvas VFX */
    #fxCanvas {
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 10;
    }

    /* Audio Toggle Button */
    .audio-toggle {
      position: fixed;
      top: 16px;
      left: 16px;
      z-index: 100;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(8px);
      color: #fff;
      padding: 8px 14px;
      border-radius: 999px;
      font-size: 14px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s;
    }
    .audio-toggle:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: scale(1.05);
    }

    /* ── Envelope Scene ── */
    #envelopeScene {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      transition: opacity 0.6s ease, transform 0.6s ease;
      z-index: 20;
    }

    .envelope-wrapper {
      position: relative;
      width: 280px;
      height: 180px;
      background: var(--envelope-dark);
      border-radius: 12px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5), 0 0 30px rgba(255, 107, 139, 0.2);
      cursor: pointer;
      transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    .envelope-wrapper:hover {
      transform: translateY(-8px) scale(1.02);
    }

    .envelope-flap {
      position: absolute;
      top: 0;
      left: 0;
      width: 0;
      height: 0;
      border-left: 140px solid transparent;
      border-right: 140px solid transparent;
      border-top: 100px solid var(--envelope-bg);
      transform-origin: top;
      transition: transform 0.6s ease;
      z-index: 5;
    }

    .envelope-pocket {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 0;
      height: 0;
      border-left: 140px solid var(--envelope-bg);
      border-right: 140px solid var(--envelope-bg);
      border-bottom: 90px solid var(--envelope-dark);
      border-top: 90px solid transparent;
      border-radius: 0 0 12px 12px;
      z-index: 4;
    }

    .wax-seal {
      position: absolute;
      top: 90px;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 48px;
      height: 48px;
      background: var(--seal-red);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
      color: #fff;
      box-shadow: 0 4px 12px rgba(217, 4, 41, 0.5);
      z-index: 6;
      animation: pulseSeal 2s infinite ease-in-out;
    }

    @keyframes pulseSeal {
      0%, 100% { transform: translate(-50%, -50%) scale(1); }
      50% { transform: translate(-50%, -50%) scale(1.1); }
    }

    .hint-text {
      margin-top: 24px;
      font-size: 16px;
      letter-spacing: 1px;
      color: rgba(255, 255, 255, 0.8);
      animation: fadeInOut 2s infinite;
    }

    @keyframes fadeInOut {
      0%, 100% { opacity: 0.5; }
      50% { opacity: 1; }
    }

    /* ── Letter Modal ── */
    #letterModal {
      position: fixed;
      inset: 0;
      background: rgba(10, 15, 29, 0.85);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
      z-index: 50;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.4s ease;
    }
    #letterModal.active {
      opacity: 1;
      pointer-events: auto;
    }

    .letter-card {
      background: #fffdfa;
      color: var(--dark-text);
      width: 100%;
      max-width: 480px;
      border-radius: 20px;
      padding: 28px 24px;
      box-shadow: 0 25px 60px rgba(0, 0, 0, 0.6);
      position: relative;
      max-height: 90vh;
      overflow-y: auto;
      transform: translateY(30px) scale(0.95);
      transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    #letterModal.active .letter-card {
      transform: translateY(0) scale(1);
    }

    .letter-header {
      font-size: 20px;
      font-weight: 700;
      color: var(--primary-pink);
      border-bottom: 2px dashed #f0d5db;
      padding-bottom: 12px;
      margin-bottom: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .skip-btn {
      background: none;
      border: 1px solid var(--primary-pink);
      color: var(--primary-pink);
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 11px;
      cursor: pointer;
      font-family: inherit;
    }
    .skip-btn:hover {
      background: var(--primary-pink);
      color: #fff;
    }

    .letter-body {
      font-size: 15px;
      line-height: 1.8;
      min-height: 140px;
      white-space: pre-wrap;
      word-break: break-word;
    }

    .typewriter-cursor {
      display: inline-block;
      width: 2px;
      height: 16px;
      background: var(--primary-pink);
      margin-left: 3px;
      animation: blink 0.8s infinite;
      vertical-align: middle;
    }
    @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }

    /* Interactive Buttons */
    .button-group {
      margin-top: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
      position: relative;
      min-height: 60px;
    }

    .btn-yes {
      background: linear-gradient(135deg, #ff6b8b, #ff4770);
      color: #fff;
      border: none;
      padding: 12px 28px;
      font-size: 16px;
      font-weight: 700;
      border-radius: 999px;
      cursor: pointer;
      box-shadow: 0 6px 20px rgba(255, 71, 112, 0.4);
      transition: all 0.25s ease;
      font-family: inherit;
      z-index: 2;
    }
    .btn-yes:hover {
      transform: scale(1.08);
      box-shadow: 0 8px 25px rgba(255, 71, 112, 0.6);
    }

    .btn-no {
      background: #e2e8f0;
      color: #64748b;
      border: none;
      padding: 10px 20px;
      font-size: 14px;
      font-weight: 600;
      border-radius: 999px;
      cursor: pointer;
      transition: all 0.2s ease;
      font-family: inherit;
      white-space: nowrap;
      z-index: 1;
    }

    /* ── Success Celebration Scene ── */
    #celebrationScene {
      display: none;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 24px;
      max-width: 520px;
      width: 100%;
      z-index: 30;
      animation: popIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
    }
    @keyframes popIn {
      0% { transform: scale(0.85); opacity: 0; }
      100% { transform: scale(1); opacity: 1; }
    }

    .celebration-title {
      font-size: 28px;
      color: var(--gold);
      margin-bottom: 8px;
    }

    .celebration-subtitle {
      font-size: 15px;
      color: #cbd5e1;
      margin-bottom: 20px;
    }

    .ticker-box {
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(12px);
      padding: 18px;
      border-radius: 16px;
      width: 100%;
      margin-bottom: 20px;
    }

    .ticker-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 8px;
      margin-top: 10px;
    }

    .ticker-item {
      background: rgba(0, 0, 0, 0.25);
      padding: 10px 4px;
      border-radius: 10px;
    }
    .ticker-val {
      font-family: 'VT323', monospace;
      font-size: 32px;
      color: var(--primary-pink);
      line-height: 1;
    }
    .ticker-lbl {
      font-size: 11px;
      color: #94a3b8;
      margin-top: 4px;
    }

    .save-card-btn {
      background: rgba(255, 255, 255, 0.15);
      color: #fff;
      border: 1px solid rgba(255, 255, 255, 0.3);
      padding: 12px 24px;
      font-size: 14px;
      font-weight: 600;
      border-radius: 999px;
      cursor: pointer;
      font-family: inherit;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s;
    }
    .save-card-btn:hover {
      background: rgba(255, 255, 255, 0.25);
      transform: translateY(-2px);
    }
  </style>
</head>
<body>

  <!-- Audio Toggle -->
  <button id="audioBtn" class="audio-toggle">
    <span>🔊</span> <span id="audioLbl">BGM: OFF</span>
  </button>

  <!-- VFX Canvas -->
  <canvas id="fxCanvas"></canvas>

  <!-- 1. Envelope Scene -->
  <div id="envelopeScene">
    <div id="envelopeWrapper" class="envelope-wrapper">
      <div id="envelopeFlap" class="envelope-flap"></div>
      <div class="envelope-pocket"></div>
      <div class="wax-seal">💖</div>
    </div>
    <p class="hint-text">✨ แตะที่ซองจดหมายเพื่อเปิดอ่าน ✨</p>
  </div>

  <!-- 2. Letter Modal -->
  <div id="letterModal">
    <div class="letter-card">
      <div class="letter-header">
        <span id="letterTitle">💌 ถึงเธอที่แสนพิเศษ...</span>
        <button id="skipBtn" class="skip-btn">ข้ามอนิเมชัน ▶</button>
      </div>
      <div class="letter-body">
        <span id="letterContent"></span><span id="cursor" class="typewriter-cursor"></span>
      </div>
      
      <div id="buttonGroup" class="button-group" style="display: none;">
        <button id="yesBtn" class="btn-yes">ตกลงนะ 💖</button>
        <button id="noBtn" class="btn-no">คิดดูก่อน 🥺</button>
      </div>
    </div>
  </div>

  <!-- 3. Celebration & Relationship Milestone Scene -->
  <div id="celebrationScene">
    <h1 class="celebration-title">🎉 Yayyy! สัญญานะ 💖</h1>
    <p class="celebration-subtitle">บันทึกช่วงเวลาแห่งความสุขไว้ในใจตลอดไป</p>

    <div class="ticker-box">
      <p style="font-size: 13px; color: #cbd5e1;">⏳ เรามีกันและกันมาแล้วเป็นเวลา</p>
      <div class="ticker-grid">
        <div class="ticker-item"><div id="tDays" class="ticker-val">0</div><div class="ticker-lbl">วัน</div></div>
        <div class="ticker-item"><div id="tHours" class="ticker-val">0</div><div class="ticker-lbl">ชั่วโมง</div></div>
        <div class="ticker-item"><div id="tMins" class="ticker-val">0</div><div class="ticker-lbl">นาที</div></div>
        <div class="ticker-item"><div id="tSecs" class="ticker-val">0</div><div class="ticker-lbl">วินาที</div></div>
      </div>
    </div>

    <button id="saveCardBtn" class="save-card-btn">
      <span>📸</span> บันทึกการ์ดความทรงจำ (.png)
    </button>
  </div>

  <script>
    /* =========================================================================
       ⚙️ CUSTOMIZATION SETTINGS — ปรับแต่งข้อมูลของคุณที่นี่
       ========================================================================= */
    const CONFIG = {
      // 1. วันที่เริ่มต้นความสัมพันธ์ (ปี-เดือน-วันTชั่วโมง:นาที:วินาที)
      startDate: '2026-08-08T19:00:00+07:00',
      
      // 2. ชื่อหัวข้อจดหมาย
      title: '💌 ถึงคนพิเศษของเค้า...',
      
      // 3. ข้อความในจดหมาย (รองรับการเว้นบรรทัด \n)
      message: `สวัสดีคนเก่ง ✨\n\nขอบคุณที่เข้ามาเป็นรอยยิ้มและความสดใสในทุกๆ วันนะ\nไม่ว่าจะเจอเรื่องอะไรมา แค่มีเธออยู่ข้างๆ ก็ทำให้ทุกวันมีความหมายขึ้นมาเสมอเลย\n\nอยู่เป็นความสุขให้กันแบบนี้ไปนานๆ เลยนะคับ 💖`,
      
      // 4. สเต็ปข้อความของปุ่ม No เมื่อพยายามกดหนี
      noButtonTexts: [
        'คิดดูก่อน 🥺',
        'แน่ใจเหรอ? 😢',
        'อย่าใจร้ายน้าา 🥺',
        'ให้โอกาสอีกทีนะ!',
        'ปุ่มนี้กดไม่ได้แล้วว 😜',
        'ตกลง (เขินๆ) 😳'
      ]
    };

    /* =========================================================================
       🎵 8-BIT MUSIC BOX SYNTHESIZER (Web Audio API - Zero External Assets)
       ========================================================================= */
    let audioCtx = null;
    let isBgmPlaying = false;
    let bgmInterval = null;

    function initAudio() {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
    }

    function playTone(freq, duration, type = 'triangle', gainVal = 0.1) {
      if (!audioCtx) return;
      try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

        gain.gain.setValueAtTime(gainVal, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + duration);
      } catch (e) {}
    }

    // Sound FX: Typewriter
    function sfxType() {
      playTone(600 + Math.random() * 200, 0.04, 'square', 0.02);
    }

    // Sound FX: Envelope Opening Rustle
    function sfxRustle() {
      if (!audioCtx) return;
      const bufferSize = audioCtx.sampleRate * 0.15;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

      const noise = audioCtx.createBufferSource();
      noise.buffer = buffer;
      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
      noise.connect(gain);
      gain.connect(audioCtx.destination);
      noise.start();
    }

    // Sound FX: Whoosh (Button Runaway)
    function sfxWhoosh() {
      if (!audioCtx) return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(500, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, audioCtx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.2);
    }

    // Romantic Chiptune Music Box Melody
    const NOTES = {
      C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, B4: 493.88,
      C5: 523.25, D5: 587.33, E5: 659.25, G5: 783.99, A5: 880.00
    };
    const MELODY = [
      NOTES.C5, NOTES.G4, NOTES.E4, NOTES.G4,
      NOTES.A4, NOTES.E4, NOTES.C4, NOTES.E4,
      NOTES.F4, NOTES.C4, NOTES.A4, NOTES.C5,
      NOTES.G4, NOTES.D4, NOTES.B4, NOTES.D5
    ];

    function startBgm() {
      if (isBgmPlaying) return;
      initAudio();
      isBgmPlaying = true;
      document.getElementById('audioLbl').textContent = 'BGM: ON';

      let step = 0;
      bgmInterval = setInterval(() => {
        const note = MELODY[step % MELODY.length];
        playTone(note, 0.4, 'triangle', 0.05);
        if (step % 2 === 0) playTone(note / 2, 0.6, 'sine', 0.03); // Warm Bass
        step++;
      }, 350);
    }

    function toggleBgm() {
      if (isBgmPlaying) {
        clearInterval(bgmInterval);
        isBgmPlaying = false;
        document.getElementById('audioLbl').textContent = 'BGM: OFF';
      } else {
        startBgm();
      }
    }
    document.getElementById('audioBtn').addEventListener('click', toggleBgm);

    /* =========================================================================
       🎆 VFX PARTICLES & FIREWORKS ENGINE
       ========================================================================= */
    const canvas = document.getElementById('fxCanvas');
    const ctx = canvas.getContext('2d');
    let particles = [];

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
      constructor(x, y, color, isHeart = false) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.isHeart = isHeart;
        this.size = isHeart ? Math.random() * 14 + 10 : Math.random() * 6 + 2;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 6 + 2;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.alpha = 1;
        this.decay = Math.random() * 0.02 + 0.01;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.08; // Gravity
        this.alpha -= this.decay;
      }
      draw() {
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.alpha);
        if (this.isHeart) {
          ctx.font = `${this.size}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.fillText('💖', this.x, this.y);
        } else {
          ctx.fillStyle = this.color;
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
    }

    function spawnFireworks(x, y) {
      const colors = ['#ff6b8b', '#ffd166', '#06d6a0', '#118ab2', '#ffbe0b'];
      for (let i = 0; i < 35; i++) {
        const color = colors[Math.floor(Math.random() * colors.length)];
        particles.push(new Particle(x, y, color, Math.random() > 0.6));
      }
    }

    // Cursor / Touch Trail
    function addTrail(x, y) {
      if (Math.random() > 0.6) {
        const p = new Particle(x, y, '#ff6b8b', true);
        p.vx *= 0.3;
        p.vy = -Math.random() * 1.5 - 0.5;
        p.decay = 0.03;
        particles.push(p);
      }
    }
    window.addEventListener('mousemove', (e) => addTrail(e.clientX, e.clientY));
    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) addTrail(e.touches[0].clientX, e.touches[0].clientY);
    });

    function loopFx() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles = particles.filter(p => p.alpha > 0);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(loopFx);
    }
    loopFx();

    /* =========================================================================
       💌 INTERACTIVE LETTER & TYPEWRITER LOGIC
       ========================================================================= */
    const envelopeWrapper = document.getElementById('envelopeWrapper');
    const envelopeFlap = document.getElementById('envelopeFlap');
    const letterModal = document.getElementById('letterModal');
    const letterContent = document.getElementById('letterContent');
    const cursor = document.getElementById('cursor');
    const buttonGroup = document.getElementById('buttonGroup');
    const skipBtn = document.getElementById('skipBtn');
    const yesBtn = document.getElementById('yesBtn');
    const noBtn = document.getElementById('noBtn');

    let typeInterval = null;
    let noClickCount = 0;

    // Open Envelope
    envelopeWrapper.addEventListener('click', () => {
      initAudio();
      sfxRustle();
      startBgm();

      const rect = envelopeWrapper.getBoundingClientRect();
      spawnFireworks(rect.left + rect.width / 2, rect.top + rect.height / 2);

      envelopeFlap.style.transform = 'rotateX(180deg)';
      setTimeout(() => {
        document.getElementById('envelopeScene').style.opacity = '0';
        document.getElementById('envelopeScene').style.pointerEvents = 'none';
        letterModal.classList.add('active');
        startTypewriter();
      }, 500);
    });

    function startTypewriter() {
      document.getElementById('letterTitle').textContent = CONFIG.title;
      let i = 0;
      letterContent.textContent = '';
      
      typeInterval = setInterval(() => {
        if (i < CONFIG.message.length) {
          letterContent.textContent += CONFIG.message[i];
          if (CONFIG.message[i] !== ' ' && CONFIG.message[i] !== '\n') sfxType();
          i++;
        } else {
          finishTypewriter();
        }
      }, 55);
    }

    function finishTypewriter() {
      clearInterval(typeInterval);
      letterContent.textContent = CONFIG.message;
      cursor.style.display = 'none';
      skipBtn.style.display = 'none';
      buttonGroup.style.display = 'flex';
    }
    skipBtn.addEventListener('click', finishTypewriter);

    /* Playful Runaway "No" Button */
    function moveNoButton() {
      sfxWhoosh();
      noClickCount++;

      // Make Yes Button grow
      const scale = 1 + noClickCount * 0.15;
      yesBtn.style.transform = `scale(${scale})`;

      if (noClickCount < CONFIG.noButtonTexts.length) {
        noBtn.textContent = CONFIG.noButtonTexts[noClickCount];
        
        // Random repositioning within modal
        const card = document.querySelector('.letter-card');
        const cardRect = card.getBoundingClientRect();
        const randX = (Math.random() - 0.5) * (cardRect.width - 140);
        const randY = (Math.random() - 0.5) * 80;

        noBtn.style.transform = `translate(${randX}px, ${randY}px)`;
      } else {
        // Morph No button into another Yes button
        noBtn.textContent = '✓ YES (เขินๆ) 😳';
        noBtn.style.background = '#ff6b8b';
        noBtn.style.color = '#fff';
        noBtn.onclick = handleYes;
      }
    }
    noBtn.addEventListener('mouseenter', moveNoButton);
    noBtn.addEventListener('touchstart', (e) => { e.preventDefault(); moveNoButton(); });

    /* Handle "Yes" Celebration */
    function handleYes() {
      letterModal.classList.remove('active');
      document.getElementById('envelopeScene').style.display = 'none';
      const celeb = document.getElementById('celebrationScene');
      celeb.style.display = 'flex';

      // Confetti burst
      for (let i = 0; i < 5; i++) {
        setTimeout(() => {
          spawnFireworks(
            window.innerWidth * (0.2 + Math.random() * 0.6),
            window.innerHeight * (0.2 + Math.random() * 0.4)
          );
        }, i * 300);
      }

      startMilestoneTicker();
    }
    yesBtn.addEventListener('click', handleYes);

    /* =========================================================================
       ⏱️ LIVE RELATIONSHIP MILESTONE TICKER
       ========================================================================= */
    function startMilestoneTicker() {
      const startMs = new Date(CONFIG.startDate).getTime();

      function updateTicker() {
        const now = Date.now();
        let diff = Math.max(0, now - startMs);

        const secs = Math.floor((diff / 1000) % 60);
        const mins = Math.floor((diff / (1000 * 60)) % 60);
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        document.getElementById('tDays').textContent = days;
        document.getElementById('tHours').textContent = hours;
        document.getElementById('tMins').textContent = mins;
        document.getElementById('tSecs').textContent = secs;
      }

      updateTicker();
      setInterval(updateTicker, 1000);
    }

    /* =========================================================================
       📸 EXPORT COMMEMORATIVE MEMORY CARD (.PNG)
       ========================================================================= */
    document.getElementById('saveCardBtn').addEventListener('click', () => {
      const cardCanvas = document.createElement('canvas');
      cardCanvas.width = 600;
      cardCanvas.height = 700;
      const c = cardCanvas.getContext('2d');

      // Background Gradient
      const grad = c.createLinearGradient(0, 0, 0, 700);
      grad.addColorStop(0, '#1e293b');
      grad.addColorStop(1, '#0f172a');
      c.fillStyle = grad;
      c.fillRect(0, 0, 600, 700);

      // Decorative Frame
      c.strokeStyle = '#ff6b8b';
      c.lineWidth = 4;
      c.strokeRect(20, 20, 560, 660);

      // Title
      c.fillStyle = '#ffd166';
      c.font = 'bold 30px Mali, sans-serif';
      c.textAlign = 'center';
      c.fillText('💖 OUR SWEET MILESTONE 💖', 300, 90);

      // Date
      c.fillStyle = '#94a3b8';
      c.font = '16px Mali, sans-serif';
      c.fillText(`Since ${new Date(CONFIG.startDate).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}`, 300, 130);

      // Ticker Box
      c.fillStyle = 'rgba(255, 255, 255, 0.08)';
      c.fillRect(60, 170, 480, 160);

      const d = document.getElementById('tDays').textContent;
      const h = document.getElementById('tHours').textContent;
      const m = document.getElementById('tMins').textContent;
      const s = document.getElementById('tSecs').textContent;

      c.fillStyle = '#ff6b8b';
      c.font = 'bold 44px monospace';
      c.fillText(`${d}d  ${h}h  ${m}m  ${s}s`, 300, 255);

      c.fillStyle = '#cbd5e1';
      c.font = '14px Mali, sans-serif';
      c.fillText('และจะเพิ่มขึ้นเรื่อยๆ ในทุกๆ วัน...', 300, 300);

      // Custom Quote
      c.fillStyle = '#ffffff';
      c.font = 'italic 16px Mali, sans-serif';
      c.fillText('"Every moment with you is a memory I treasure."', 300, 480);

      // Watermark / Brand
      c.fillStyle = '#64748b';
      c.font = '12px Mali, sans-serif';
      c.fillText('Created with Love ❤️', 300, 630);

      // Download Trigger
      const link = document.createElement('a');
      link.download = 'Our-Love-Memory.png';
      link.href = cardCanvas.toDataURL('image/png');
      link.click();
    });
  </script>
</body>
</html>
```

---

## 🎨 How to Customize for Yourself

Open the code and scroll to the `CONFIG` object:

```javascript
const CONFIG = {
  // Set your anniversary or relationship start date
  startDate: '2026-08-08T19:00:00+07:00',
  
  // Title at the top of the letter
  title: '💌 ถึงคนพิเศษของเค้า...',
  
  // Your personalized letter message
  message: `สวัสดีคนเก่ง ✨\n\nเขียนข้อความความในใจของคุณที่นี่ได้เลย...\nอยู่ด้วยกันไปนานๆ นะคับ 💖`,
  
  // Texts for the playful "No" button
  noButtonTexts: [
    'คิดดูก่อน 🥺',
    'แน่ใจเหรอ? 😢',
    'อย่าใจร้ายน้าา 🥺',
    'ให้โอกาสอีกทีนะ!',
    'ปุ่มนี้กดไม่ได้แล้วว 😜',
    'ตกลง (เขินๆ) 😳'
  ]
};
```

---

## 🌐 Free Hosting Options

| Platform | Difficulty | Setup Time | Steps |
|---|---|---|---|
| **GitHub Pages** | ⭐ Very Easy | 1 min | Push `index.html` → Settings → Pages → Select `main` branch. |
| **Vercel** | ⭐ Easy | 1 min | Connect GitHub repository → Click Deploy. |
| **Netlify** | ⭐ Easy | 1 min | Drag & Drop your folder containing `index.html` into Netlify Drop. |

Enjoy creating your special love letter website, OzonZ! 💖
