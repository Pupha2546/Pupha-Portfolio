<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const sectionRef = ref(null)
const mouseX = ref(0)
const mouseY = ref(0)

const skills = [
  { name: 'Nuxt', color: '#00DC82', icon: 'logos:nuxt-icon' },
  { name: 'Vue.js', color: '#4FC08D', icon: 'logos:vue' },
  { name: 'Next.js', color: '#ffffff', icon: 'devicon:nextjs' },
  { name: 'React', color: '#61DAFB', icon: 'logos:react' },
  { name: 'Tailwind', color: '#06B6D4', icon: 'logos:tailwindcss-icon' },
  { name: 'Flutter', color: '#54C5F8', icon: 'logos:flutter' },
  { name: 'Node.js', color: '#539E43', icon: 'logos:nodejs-icon' },
  { name: 'Express', color: '#ffffff', icon: 'devicon:express', dark: true },
  { name: 'Prisma', color: '#5A67D8', icon: 'devicon:prisma', dark: true },
  { name: 'MySQL', color: '#4479A1', icon: 'logos:mysql-icon' },
  { name: 'Docker', color: '#2496ED', icon: 'logos:docker-icon' },
  { name: 'Git', color: '#F05032', icon: 'logos:git-icon' },
]

const marqueeItems = [...skills, ...skills]

const particles = ref([])

/* ── 3D tilt ── */
function onTilt(e) {
  const el = e.currentTarget
  const r = el.getBoundingClientRect()
  const x = e.clientX - r.left
  const y = e.clientY - r.top
  const rY = ((x - r.width / 2) / (r.width / 2)) * 12
  const rX = ((r.height / 2 - y) / (r.height / 2)) * 12

  gsap.to(el, {
    rotateX: rX, rotateY: rY, scale: 1.06,
    duration: 0.35, ease: 'power2.out',
    transformPerspective: 600,
  })

  el.style.setProperty('--mx', `${x}px`)
  el.style.setProperty('--my', `${y}px`)
}

function onTiltOut(e) {
  gsap.to(e.currentTarget, {
    rotateX: 0, rotateY: 0, scale: 1,
    duration: 0.5, ease: 'elastic.out(1, 0.5)',
  })
}

/* ── Parallax ── */
function onGlobalMouse(e) {
  mouseX.value = (e.clientX / window.innerWidth - 0.5) * 24
  mouseY.value = (e.clientY / window.innerHeight - 0.5) * 24
}

onMounted(() => {
  particles.value = Array.from({ length: 15 }, () => ({
    left: `${5 + Math.random() * 90}%`,
    top: `${5 + Math.random() * 90}%`,
    animationDelay: `${Math.random() * 12}s`,
    animationDuration: `${8 + Math.random() * 8}s`,
  }))

  const el = sectionRef.value
  if (!el) return
  window.addEventListener('mousemove', onGlobalMouse)

  gsap.from(el.querySelectorAll('.section-reveal'), {
    y: 35, opacity: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out',
    scrollTrigger: { trigger: el, start: 'top 78%' },
  })

  // Cards wave stagger
  el.querySelectorAll('.tile').forEach((card, i) => {
    const row = Math.floor(i / 6)
    const col = i % 6
    gsap.from(card, {
      y: 60, opacity: 0, rotateX: 20, scale: 0.85,
      duration: 0.7, delay: row * 0.1 + col * 0.06,
      ease: 'back.out(1.5)',
      scrollTrigger: { trigger: el.querySelector('.grid-wrap'), start: 'top 84%' },
    })
  })

  // Continuous floating for each tile icon
  el.querySelectorAll('.tile-icon-area').forEach((icon, i) => {
    gsap.to(icon, {
      y: -3, duration: 2 + Math.random(),
      ease: 'sine.inOut', repeat: -1, yoyo: true,
      delay: i * 0.2,
    })
  })
})

onUnmounted(() => {
  window.removeEventListener('mousemove', onGlobalMouse)
})
</script>

<template>
  <section id="skills" ref="sectionRef" class="section-skills">
    <div class="divider-top" />

    <!-- Parallax ambient orbs -->
    <div class="orb orb-1" :style="{ transform: `translate(${mouseX * 0.5}px, ${mouseY * 0.5}px)` }" />
    <div class="orb orb-2" :style="{ transform: `translate(${mouseX * -0.4}px, ${mouseY * -0.4}px)` }" />
    <div class="orb orb-3" :style="{ transform: `translate(${mouseX * 0.3}px, ${mouseY * -0.5}px)` }" />

    <!-- Floating particles -->
    <div class="particles" aria-hidden="true">
      <span v-for="(p, n) in particles" :key="n" class="particle" :style="p" />
    </div>

    <div class="section-container relative z-10">
      <span class="section-reveal section-label">02 — Skills</span>
      <h2 class="section-reveal section-title">
        <span class="gradient-text">Technologies</span><br />
        <span class="sub-title">I work with</span>
      </h2>
      <p class="section-reveal section-desc">
        From frontend frameworks to backend services, here's the stack I use to bring ideas to life.
      </p>

      <!-- Grid -->
      <div class="grid-wrap">
        <div class="grid-dots" />
        <div class="skills-grid">
          <div v-for="(skill, i) in skills" :key="skill.name" class="tile"
            :style="{ '--accent': skill.color, '--accent20': skill.color + '33', '--accent08': skill.color + '14' }"
            @mousemove="onTilt" @mouseleave="onTiltOut">
            <div class="tile-body">
              <!-- Spotlight -->
              <div class="tile-spot" />

              <!-- Shimmer sweep -->
              <div class="tile-shimmer" />

              <!-- Glass layer -->
              <div class="tile-glass" />

              <!-- Content -->
              <div class="tile-content">
                <div class="tile-icon-area">
                  <!-- Glow behind icon -->
                  <div class="icon-glow" />
                  <Icon :name="skill.icon" size="32" class="tile-icon" :class="{ 'dark-icon': skill.dark }" />
                </div>
                <span class="tile-name">{{ skill.name }}</span>
              </div>

              <!-- Top accent -->
              <div class="accent-top" />
              <!-- Bottom glow bar -->
              <div class="accent-bottom" />
            </div>
          </div>
        </div>
      </div>

      <!-- Marquee -->
      <div class="marquee-wrap">
        <div class="mq-fade mq-fade-l" />
        <div class="mq-fade mq-fade-r" />
        <div class="marquee-belt">
          <span v-for="(s, i) in marqueeItems" :key="i" class="mq-item">
            <Icon :name="s.icon" size="12" class="mq-icon" :class="{ 'dark-mq': s.dark }" />
            {{ s.name }}
            <span class="mq-sep">✦</span>
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* ═══════════ SECTION ═══════════ */
.section-skills {
  position: relative;
  background: #000;
  overflow: hidden;
}

.divider-top {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.08), transparent);
}

/* ═══════════ PARALLAX ORBS ═══════════ */
.orb {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.orb-1 {
  top: 5%;
  left: -8%;
  width: 480px;
  height: 480px;
  background: radial-gradient(circle, rgba(0, 220, 130, 0.05) 0%, transparent 70%);
  filter: blur(100px);
}

.orb-2 {
  bottom: 10%;
  right: -6%;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(97, 218, 251, 0.04) 0%, transparent 70%);
  filter: blur(100px);
}

.orb-3 {
  top: 50%;
  left: 30%;
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(90, 103, 216, 0.04) 0%, transparent 70%);
  filter: blur(80px);
}

/* ═══════════ PARTICLES ═══════════ */
.particles {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 1;
}

.particle {
  position: absolute;
  width: 2px;
  height: 2px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.6);
  animation: drift linear infinite;
}

@keyframes drift {
  0% {
    transform: translateY(0) translateX(0);
    opacity: 0;
  }

  20% {
    opacity: 0.4;
  }

  50% {
    transform: translateY(-50px) translateX(20px);
    opacity: 0.15;
  }

  80% {
    opacity: 0.35;
  }

  100% {
    transform: translateY(10px) translateX(-10px);
    opacity: 0;
  }
}

/* ═══════════ GRID ═══════════ */
.grid-wrap {
  position: relative;
}

.grid-dots {
  position: absolute;
  inset: -48px;
  z-index: 0;
  opacity: 0.3;
  background-image: radial-gradient(circle, rgba(255, 255, 255, 0.07) 1px, transparent 1px);
  background-size: 28px 28px;
  mask-image: radial-gradient(ellipse 60% 55% at 50% 50%, black 20%, transparent 65%);
  -webkit-mask-image: radial-gradient(ellipse 60% 55% at 50% 50%, black 20%, transparent 65%);
}

.skills-grid {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 14px;
}

@media (max-width: 1024px) {
  .skills-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 640px) {
  .skills-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
  }
}

/* ═══════════ TILE CARD ═══════════ */
.tile {
  --mx: 50%;
  --my: 50%;
  position: relative;
  transform-style: preserve-3d;
  will-change: transform;
  cursor: default;
  z-index: 1;
}

.tile:hover {
  z-index: 10;
}

.tile-body {
  position: relative;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  background: rgba(255, 255, 255, 0.02);
  overflow: hidden;
  transition: all 0.45s cubic-bezier(0.16, 1, 0.3, 1);
}

.tile:hover .tile-body {
  border-color: rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.045);
  box-shadow:
    0 20px 50px -10px rgba(0, 0, 0, 0.6),
    0 0 0 1px rgba(255, 255, 255, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.06);
}

/* ── Spotlight ── */
.tile-spot {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.4s;
  background: radial-gradient(120px circle at var(--mx) var(--my), rgba(255, 255, 255, 0.08), transparent);
}

.tile:hover .tile-spot {
  opacity: 1;
}

/* ── Shimmer sweep ── */
.tile-shimmer {
  position: absolute;
  inset: 0;
  z-index: 3;
  pointer-events: none;
  border-radius: 16px;
  overflow: hidden;
  opacity: 0;
  transition: opacity 0.3s;
}

.tile-shimmer::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(105deg,
      transparent 42%,
      rgba(255, 255, 255, 0.04) 45%,
      rgba(255, 255, 255, 0.1) 50%,
      rgba(255, 255, 255, 0.04) 55%,
      transparent 58%);
  transform: translateX(-100%);
}

.tile:hover .tile-shimmer {
  opacity: 1;
}

.tile:hover .tile-shimmer::after {
  animation: shimmer-pass 1s cubic-bezier(0.4, 0, 0.2, 1) 0.15s;
}

@keyframes shimmer-pass {
  0% {
    transform: translateX(-100%);
  }

  100% {
    transform: translateX(100%);
  }
}

/* ── Glass ── */
.tile-glass {
  position: absolute;
  inset: 0;
  z-index: 1;
  backdrop-filter: blur(4px);
  background: linear-gradient(160deg, rgba(255, 255, 255, 0.035) 0%, transparent 50%);
}

/* ── Content ── */
.tile-content {
  position: relative;
  z-index: 5;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  padding: 28px 12px 24px;
}

/* ── Icon ── */
.tile-icon-area {
  position: relative;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-glow {
  position: absolute;
  inset: -6px;
  border-radius: 50%;
  background: var(--accent);
  opacity: 0;
  filter: blur(14px);
  transform: scale(0.5);
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.tile:hover .icon-glow {
  opacity: 0.25;
  transform: scale(1.2);
}

.tile-icon {
  position: relative;
  z-index: 2;
  filter: brightness(0.85);
  opacity: 0.75;
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.tile:hover .tile-icon {
  filter: brightness(1) drop-shadow(0 4px 12px rgba(0, 0, 0, 0.4));
  opacity: 1;
  transform: scale(1.18) translateY(-2px);
}

.dark-icon {
  filter: brightness(0) invert(0.75) !important;
}

.tile:hover .dark-icon {
  filter: brightness(0) invert(1) drop-shadow(0 4px 12px rgba(0, 0, 0, 0.4)) !important;
  opacity: 1;
}

/* ── Name ── */
.tile-name {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.28);
  text-align: center;
  white-space: nowrap;
  transition: all 0.45s cubic-bezier(0.16, 1, 0.3, 1);
}

.tile:hover .tile-name {
  color: rgba(255, 255, 255, 0.88);
  letter-spacing: 0.12em;
  text-shadow: 0 0 14px var(--accent20);
}

/* ── Accents ── */
.accent-top {
  position: absolute;
  top: 0;
  left: 20%;
  right: 20%;
  height: 1px;
  z-index: 6;
  background: var(--accent);
  opacity: 0;
  transform: scaleX(0);
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.tile:hover .accent-top {
  opacity: 0.65;
  transform: scaleX(1);
  left: 5%;
  right: 5%;
}

.accent-bottom {
  position: absolute;
  bottom: 0;
  left: 25%;
  right: 25%;
  height: 2px;
  z-index: 6;
  border-radius: 1px;
  background: linear-gradient(90deg, transparent, var(--accent), transparent);
  opacity: 0;
  transform: scaleX(0);
  transition: all 0.55s cubic-bezier(0.16, 1, 0.3, 1) 0.05s;
  box-shadow: 0 0 10px var(--accent20), 0 -3px 14px var(--accent08);
}

.tile:hover .accent-bottom {
  opacity: 0.6;
  transform: scaleX(1);
  left: 12%;
  right: 12%;
}

/* ═══════════ MARQUEE ═══════════ */
.marquee-wrap {
  position: relative;
  margin-top: 64px;
  margin-left: -24px;
  margin-right: -24px;
  overflow: hidden;
  border-top: 1px solid rgba(255, 255, 255, 0.04);
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
}

.mq-fade {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 80px;
  z-index: 2;
  pointer-events: none;
}

.mq-fade-l {
  left: 0;
  background: linear-gradient(90deg, #000, transparent);
}

.mq-fade-r {
  right: 0;
  background: linear-gradient(270deg, #000, transparent);
}

.marquee-belt {
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
  padding: 14px 0;
  animation: ticker 30s linear infinite;
}

.marquee-belt:hover {
  animation-play-state: paused;
}

.mq-item {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 0 18px;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.15);
  flex-shrink: 0;
  transition: color 0.3s;
}

.mq-item:hover {
  color: rgba(255, 255, 255, 0.4);
}

.mq-icon {
  opacity: 0.3;
  flex-shrink: 0;
}

.mq-sep {
  margin-left: 12px;
  font-size: 8px;
  color: rgba(255, 255, 255, 0.06);
}

.dark-mq {
  filter: brightness(0) invert(1);
  opacity: 0.2 !important;
}

@keyframes ticker {
  0% {
    transform: translateX(0);
  }

  100% {
    transform: translateX(-50%);
  }
}
</style>
