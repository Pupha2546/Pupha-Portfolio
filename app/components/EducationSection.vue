<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const sectionRef    = ref(null)
const gpaxRef       = ref(null)
const gpaxNumberRef = ref(null)
const mouseX        = ref(0)
const mouseY        = ref(0)

/* ─── Parallax orbs ─── */
function onGlobalMouse(e) {
  mouseX.value = (e.clientX / window.innerWidth  - 0.5) * 30
  mouseY.value = (e.clientY / window.innerHeight - 0.5) * 30
}

/* ─── Card 3-D tilt ─── */
function onTilt(e) {
  const el   = e.currentTarget
  const rect = el.getBoundingClientRect()
  const x    = e.clientX - rect.left
  const y    = e.clientY - rect.top
  const rY   = ((x - rect.width  / 2) / (rect.width  / 2)) * 8
  const rX   = ((rect.height / 2 - y) / (rect.height / 2)) * 8
  el.style.setProperty('--mx', `${x}px`)
  el.style.setProperty('--my', `${y}px`)
  gsap.to(el, { rotateX: rX, rotateY: rY, scale: 1.03, duration: 0.35, ease: 'power2.out', transformPerspective: 800 })
}

function onTiltOut(e) {
  gsap.to(e.currentTarget, { rotateX: 0, rotateY: 0, scale: 1, duration: 0.6, ease: 'elastic.out(1, 0.5)' })
}

/* ─── GPAX ring sweep ─── */
function animateGpax() {
  if (!gpaxNumberRef.value) return
  const target = { val: 0 }
  const circle = gpaxRef.value?.querySelector('.ring-progress')

  if (circle) {
    const r      = parseFloat(circle.getAttribute('r'))
    const circum = 2 * Math.PI * r
    circle.style.strokeDasharray  = `${circum}`
    circle.style.strokeDashoffset = `${circum}`
    gsap.to(circle, {
      strokeDashoffset: circum - circum * (3.32 / 4.0),
      duration: 2.2, ease: 'power3.out', delay: 0.3,
    })
  }

  gsap.to(target, {
    val: 3.32, duration: 2, ease: 'power2.out', delay: 0.3,
    onUpdate: () => { gpaxNumberRef.value.textContent = target.val.toFixed(2) },
  })
}

onMounted(() => {
  window.addEventListener('mousemove', onGlobalMouse)

  const el = sectionRef.value
  if (!el) return

  gsap.from(el.querySelectorAll('.edu-reveal'), {
    y: 60, opacity: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out',
    scrollTrigger: { trigger: el, start: 'top 76%' },
  })

  ScrollTrigger.create({
    trigger: gpaxRef.value,
    start: 'top 85%',
    onEnter: animateGpax,
  })
})

onUnmounted(() => {
  window.removeEventListener('mousemove', onGlobalMouse)
})
</script>

<template>
  <section id="education" ref="sectionRef" class="edu-wrap">
    <div class="h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

    <!-- Parallax ambient orbs -->
    <div class="orb orb-a" :style="{ transform: `translate(${mouseX * 0.5}px, ${mouseY * 0.4}px)` }" />
    <div class="orb orb-b" :style="{ transform: `translate(${mouseX * -0.35}px, ${mouseY * -0.45}px)` }" />
    <div class="orb orb-c" :style="{ transform: `translate(${mouseX * 0.25}px, ${mouseY * -0.3}px)` }" />

    <div class="section-container relative z-10">
      <!-- Header -->
      <span class="edu-reveal section-label">04 — Education</span>
      <h2 class="section-reveal section-title">
        <span class="gradient-text">Academic</span><br />
        <span class="sub-title">background</span>
      </h2>

      <!-- 3D Card -->
      <div
        class="hero-card edu-reveal"
        @mousemove="onTilt"
        @mouseleave="onTiltOut"
      >
        <div class="hc-spot" />
        <div class="hc-shimmer" />
        <div class="hc-line-top" />

        <div class="hc-inner">

          <!-- GPAX ring -->
          <div ref="gpaxRef" class="gpax-wrap">
            <svg class="gpax-svg" viewBox="0 0 120 120">
              <defs>
                <linearGradient id="gpaxGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%"   stop-color="#FFC72C" />
                  <stop offset="100%" stop-color="#FA4616" />
                </linearGradient>
              </defs>
              <circle class="ring-track"    cx="60" cy="60" r="50" />
              <circle class="ring-progress" cx="60" cy="60" r="50" />
              <g class="ring-ticks">
                <line v-for="n in 20" :key="n"
                  :transform="`rotate(${n * 18} 60 60)`"
                  x1="60" y1="6" x2="60" y2="12"
                />
              </g>
            </svg>
            <div class="gpax-center">
              <span ref="gpaxNumberRef" class="gpax-num">0.00</span>
              <span class="gpax-lbl">GPAX</span>
            </div>
          </div>

          <!-- Uni info -->
          <div class="uni-info">
            <div class="uni-logos">
              <div class="uni-logo-frame">
                <img src="/icons/kmutt-icon.png" alt="KMUTT" class="uni-logo" />
              </div>
              <div class="uni-logo-frame">
                <img src="/icons/sit-icon.png" alt="SIT" class="uni-logo" />
              </div>
            </div>

            <div class="uni-badge">KMUTT</div>

            <h3 class="uni-name">
              King Mongkut's University<br class="hidden sm:block" />
              of Technology Thonburi
            </h3>

            <div class="uni-pills">
              <span class="pill pill-cyan">B.Sc. Information Technology</span>
              <span class="pill pill-gray">School of IT (SIT)</span>
            </div>
          </div>

          <!-- Year & status -->
          <div class="year-col">
            <div class="year-bubble">
              <span class="year-pulse" />
              <div class="year-inner">
                <p class="year-label">Duration</p>
                <p class="year-range">2021 – 2025</p>
              </div>
            </div>
            <div class="status-badge">
              <span class="status-dot" />
              <span class="status-text">Graduated</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* ══ SECTION ══ */
.edu-wrap {
  position: relative;
  background: #000;
  overflow: hidden;
}

/* ══ ORBS ══ */
.orb {
  position: absolute; border-radius: 50%;
  pointer-events: none;
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
.orb-a {
  top: -5%; left: -10%;
  width: 500px; height: 500px;
  background: radial-gradient(circle, rgba(255,199,44,0.07) 0%, transparent 70%);
  filter: blur(100px);
}
.orb-b {
  bottom: 10%; right: -8%;
  width: 420px; height: 420px;
  background: radial-gradient(circle, rgba(250,70,22,0.06) 0%, transparent 70%);
  filter: blur(100px);
}
.orb-c {
  top: 40%; left: 35%;
  width: 280px; height: 280px;
  background: radial-gradient(circle, rgba(123,129,137,0.04) 0%, transparent 70%);
  filter: blur(80px);
}

/* ══ 3D CARD ══ */
.hero-card {
  --mx: 50%; --my: 50%;
  position: relative;
  margin-top: 3rem;
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 20px;
  overflow: hidden;
  background: rgba(255,255,255,0.015);
  transform-style: preserve-3d;
  will-change: transform;
  cursor: default;
  transition: border-color 0.4s, background 0.4s, box-shadow 0.4s;
}
.hero-card:hover {
  border-color: rgba(255,199,44,0.15);
  background: rgba(255,255,255,0.03);
  box-shadow:
    0 30px 70px -20px rgba(0,0,0,0.5),
    0 0 0 1px rgba(255,199,44,0.06),
    0 0 60px -20px rgba(250,70,22,0.08);
}

/* spotlight */
.hc-spot {
  position: absolute; inset: 0; z-index: 1; pointer-events: none;
  opacity: 0; transition: opacity 0.4s;
  background: radial-gradient(300px circle at var(--mx) var(--my), rgba(255,199,44,0.07), transparent);
}
.hero-card:hover .hc-spot { opacity: 1; }

/* shimmer sweep */
.hc-shimmer {
  position: absolute; inset: 0; z-index: 2; pointer-events: none;
  overflow: hidden; border-radius: 20px; opacity: 0; transition: opacity 0.3s;
}
.hc-shimmer::after {
  content: '';
  position: absolute; top: -50%; left: -50%;
  width: 200%; height: 200%;
  background: linear-gradient(105deg,
    transparent 42%, rgba(255,255,255,0.03) 45%,
    rgba(255,255,255,0.07) 50%, rgba(255,255,255,0.03) 55%,
    transparent 58%);
  transform: translateX(-100%);
}
.hero-card:hover .hc-shimmer { opacity: 1; }
.hero-card:hover .hc-shimmer::after {
  animation: shimmer-pass 1.2s cubic-bezier(0.4,0,0.2,1) 0.1s;
}
@keyframes shimmer-pass {
  0%   { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

/* top accent line */
.hc-line-top {
  position: absolute; top: 0; left: 10%; right: 10%;
  height: 1px; z-index: 5;
  background: linear-gradient(90deg, #FFC72C, #FA4616);
  opacity: 0; transform: scaleX(0);
  transition: all 0.5s cubic-bezier(0.16,1,0.3,1);
}
.hero-card:hover .hc-line-top {
  opacity: 0.45; transform: scaleX(1); left: 4%; right: 4%;
}

.hc-inner {
  position: relative; z-index: 10;
  display: flex; flex-direction: column; gap: 2rem;
  padding: 2.5rem;
}
@media (min-width: 768px) {
  .hc-inner {
    flex-direction: row; align-items: center; gap: 3rem;
    padding: 3rem 3.5rem;
  }
}

/* ══ GPAX RING ══ */
.gpax-wrap {
  position: relative; flex-shrink: 0;
  width: 140px; height: 140px;
}
.gpax-svg {
  width: 100%; height: 100%;
  transform: rotate(-90deg);
}
.ring-track {
  fill: none; stroke: rgba(255,199,44,0.12); stroke-width: 4;
}
.ring-progress {
  fill: none; stroke: url(#gpaxGrad); stroke-width: 4;
  stroke-linecap: round;
  filter: drop-shadow(0 0 8px rgba(250,70,22,0.55));
}
.ring-ticks line {
  stroke: rgba(255,255,255,0.08); stroke-width: 1;
}
.gpax-center {
  position: absolute; inset: 0;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center; gap: 2px;
}
.gpax-num {
  font-family: var(--font-heading);
  font-size: 2.1rem; font-weight: 700; color: #fff; line-height: 1;
}
.gpax-lbl {
  font-size: 9px; letter-spacing: 0.28em; text-transform: uppercase;
  color: rgba(255,199,44,0.7); font-weight: 600;
}

/* ══ UNI INFO ══ */
.uni-info { flex: 1; min-width: 0; }

.uni-logos { display: flex; gap: 10px; margin-bottom: 1rem; }
.uni-logo-frame {
  width: 44px; height: 44px; border-radius: 10px; padding: 5px;
  background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
  display: flex; align-items: center; justify-content: center;
  transition: all 0.4s cubic-bezier(0.16,1,0.3,1);
}
.hero-card:hover .uni-logo-frame {
  background: rgba(255,255,255,0.07); border-color: rgba(255,255,255,0.12);
}
.uni-logo { width: 100%; height: 100%; object-fit: contain; }

.uni-badge {
  display: inline-block; padding: 3px 10px; border-radius: 4px; margin-bottom: 10px;
  font-size: 10px; font-weight: 700; letter-spacing: 0.14em;
  color: rgba(255,199,44,0.9); background: rgba(255,199,44,0.08);
  border: 1px solid rgba(255,199,44,0.2);
}

.uni-name {
  font-family: var(--font-heading);
  font-size: clamp(1.1rem, 2.5vw, 1.55rem);
  font-weight: 700; color: #fff; line-height: 1.3; margin-bottom: 1rem;
}

.uni-pills { display: flex; flex-wrap: wrap; gap: 8px; }
.pill {
  display: inline-flex; align-items: center;
  padding: 4px 12px; border-radius: 9999px;
  font-size: 11px; font-weight: 500; letter-spacing: 0.04em;
}
.pill-cyan {
  background: rgba(250,70,22,0.08); border: 1px solid rgba(250,70,22,0.22);
  color: rgba(250,120,80,0.95);
}
.pill-gray {
  background: rgba(123,129,137,0.08); border: 1px solid rgba(123,129,137,0.2);
  color: rgba(180,184,189,0.85);
}

/* ══ YEAR COL ══ */
.year-col {
  display: flex; flex-direction: column; align-items: flex-start; gap: 1rem; flex-shrink: 0;
}
@media (min-width: 768px) { .year-col { align-items: flex-end; } }

.year-bubble {
  display: flex; align-items: center; gap: 10px;
  padding: 14px 20px; border-radius: 14px;
  background: rgba(255,255,255,0.025); border: 1px solid rgba(255,255,255,0.07);
}
.year-pulse {
  width: 8px; height: 8px; border-radius: 50%; background: #FFC72C;
  box-shadow: 0 0 8px rgba(255,199,44,0.55);
  animation: blink 2.5s ease-in-out infinite; flex-shrink: 0;
}
@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.35} }
.year-inner { display: flex; flex-direction: column; gap: 1px; }
.year-label { font-size: 9px; letter-spacing: 0.25em; text-transform: uppercase; color: rgba(255,255,255,0.4); }
.year-range { font-family: var(--font-heading); font-size: 1.05rem; font-weight: 700; color: #fff; }

.status-badge {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 5px 12px; border-radius: 9999px;
  background: rgba(34,197,94,0.07); border: 1px solid rgba(34,197,94,0.2);
}
.status-dot {
  width: 6px; height: 6px; border-radius: 50%; background: #22C55E;
  box-shadow: 0 0 6px rgba(34,197,94,0.55);
  animation: blink 2s ease-in-out infinite;
}
.status-text {
  font-size: 10px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase;
  color: rgba(34,197,94,0.9);
}
</style>
