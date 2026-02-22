<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const sectionRef = ref(null)
const activeCard = ref(null)
const mouseX = ref(0)
const mouseY = ref(0)
const cardRefs = ref([])

const experiences = [
  {
    id: 1,
    title: 'INTEGRATED I-II Project',
    year: '2022 – 2023',
    role: 'Frontend Developer',
    accent: '#4FC08D',
    descriptions: [
      'Designed and developed a website for posting announcements as part of a course project.',
      'Responsible for the full frontend implementation.',
    ],
    link: 'https://github.com/INT221-NW1-SaksiOnChowder/NW1-SaksiOnChowder',
    linkLabel: 'View on GitHub',
    tech: ['Vue.js', 'Frontend'],
  },
  {
    id: 2,
    title: 'Pamala Korea',
    year: '2024',
    role: 'Full Stack Developer — Internship',
    accent: '#06B6D4',
    descriptions: [
      'Built a web application for selling online Korean language learning courses.',
      'Developed during internship at Night Bears Technology.',
      'Worked on both backend (Node.js) and frontend (Next.js, Tailwind CSS).',
    ],
    link: 'https://www.pamalakorea.com',
    linkLabel: 'Visit Live Site',
    tech: ['Next.js', 'Tailwind CSS', 'Node.js'],
  },
  {
    id: 3,
    title: 'Nightbearstech Website',
    year: '2024',
    role: 'Frontend Developer',
    accent: '#00DC82',
    descriptions: [
      'Designed and built the official website of Night Bears Technology.',
      'Implemented with Nuxt and Tailwind CSS for a modern, responsive experience.',
    ],
    link: 'https://www.nightbearstech.com',
    linkLabel: 'Visit Live Site',
    tech: ['Nuxt', 'Tailwind CSS'],
  },
  {
    id: 4,
    title: 'Capstone Project — MBEA',
    year: '2024 – 2025',
    role: 'Lead Frontend Developer',
    accent: '#A78BFA',
    descriptions: [
      'The Mystery Box Exchange Application — a platform for communication and exchange of mystery boxes.',
      'Developed using Flutter, Vue, Go, MySQL, Google Maps, and Omise.',
      'Responsible for end-to-end frontend across web and mobile platforms.',
    ],
    link: 'https://github.com/SSI3-Capstone-Project/frontend',
    linkLabel: 'View on GitHub',
    tech: ['Flutter', 'Vue', 'Go', 'MySQL'],
  },
]

function toggleCard(id) {
  activeCard.value = activeCard.value === id ? null : id
}

function onCardMouse(e, index) {
  const card = cardRefs.value[index]
  if (!card) return
  const rect = card.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  card.style.setProperty('--mx', `${x}px`)
  card.style.setProperty('--my', `${y}px`)
}

function onGlobalMouse(e) {
  mouseX.value = (e.clientX / window.innerWidth - 0.5) * 20
  mouseY.value = (e.clientY / window.innerHeight - 0.5) * 20
}

onMounted(() => {
  const el = sectionRef.value
  if (!el) return
  window.addEventListener('mousemove', onGlobalMouse)

  gsap.from(el.querySelectorAll('.exp-reveal'), {
    y: 60, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out',
    scrollTrigger: { trigger: el, start: 'top 75%' },
  })

  el.querySelectorAll('.exp-card').forEach((card, i) => {
    gsap.from(card, {
      y: 80, opacity: 0, duration: 0.9, delay: i * 0.12, ease: 'power3.out',
      scrollTrigger: { trigger: card, start: 'top 88%' },
    })
  })

  // Animate timeline dots
  el.querySelectorAll('.timeline-dot').forEach((dot, i) => {
    gsap.from(dot, {
      scale: 0, duration: 0.5, delay: i * 0.15 + 0.3, ease: 'back.out(2)',
      scrollTrigger: { trigger: dot, start: 'top 88%' },
    })
  })

  // Animate timeline line grow
  gsap.from(el.querySelector('.timeline-line'), {
    scaleY: 0, duration: 1.5, ease: 'power3.inOut', transformOrigin: 'top',
    scrollTrigger: { trigger: el.querySelector('.timeline-line'), start: 'top 85%' },
  })
})

onUnmounted(() => {
  window.removeEventListener('mousemove', onGlobalMouse)
})
</script>

<template>
  <section id="experience" ref="sectionRef" class="exp-section">
    <div class="h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

    <!-- Parallax ambient orbs -->
    <div class="exp-orb exp-orb-1" :style="{ transform: `translate(${mouseX * 0.4}px, ${mouseY * 0.4}px)` }" />
    <div class="exp-orb exp-orb-2" :style="{ transform: `translate(${mouseX * -0.3}px, ${mouseY * -0.3}px)` }" />

    <div class="section-container relative z-10">
      <span class="exp-reveal section-label">03 — Experience</span>
      <h2 class="section-reveal section-title">
        <span class="gradient-text">Selected</span><br />
        <span class="sub-title">projects</span>
      </h2>
      <p class="exp-reveal section-desc">
        A collection of work that showcases my growth as a developer.
      </p>

      <div class="relative">
        <!-- Vertical timeline line -->
        <div class="timeline-line" />

        <div class="space-y-5">
          <div
            v-for="(exp, index) in experiences"
            :key="exp.id"
            ref="cardRefs"
            class="exp-card group cursor-pointer relative"
            :style="{ '--accent': exp.accent, '--accent20': exp.accent + '33', '--accent08': exp.accent + '14' }"
            @click="toggleCard(exp.id)"
            @mousemove="(e) => onCardMouse(e, index)"
          >
            <!-- Timeline dot -->
            <div class="timeline-dot" :style="{ background: exp.accent }" />

            <div
              class="exp-card-body"
              :class="activeCard === exp.id ? 'is-active' : ''"
            >
              <!-- Mouse spotlight -->
              <div class="card-spotlight" />

              <!-- Top accent bar -->
              <div class="card-accent-top" />

              <!-- Shimmer sweep on hover -->
              <div class="card-shimmer" />

              <div class="relative z-10 flex items-center justify-between px-6 md:px-10 py-7">
                <div class="flex items-center gap-4 md:gap-8">
                  <span class="exp-number select-none">
                    {{ String(index + 1).padStart(2, '0') }}
                  </span>
                  <div>
                    <h3 class="exp-title">
                      {{ exp.title }}
                    </h3>
                    <p class="exp-role">
                      {{ exp.role }}
                    </p>
                  </div>
                </div>

                <div class="flex items-center gap-4 md:gap-8">
                  <span class="hidden sm:block exp-year">
                    {{ exp.year }}
                  </span>
                  <div class="exp-toggle-btn" :class="activeCard === exp.id ? 'is-open' : ''">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <Transition
                enter-active-class="transition-all duration-500 ease-out"
                leave-active-class="transition-all duration-300 ease-in"
                enter-from-class="max-h-0 opacity-0"
                enter-to-class="max-h-[500px] opacity-100"
                leave-from-class="max-h-[500px] opacity-100"
                leave-to-class="max-h-0 opacity-0"
              >
                <div v-show="activeCard === exp.id" class="overflow-hidden">
                  <div class="px-6 md:px-10 pb-8 pt-2 relative z-10">
                    <div class="h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6" />
                    <div class="grid md:grid-cols-2 gap-8">
                      <div class="space-y-3">
                        <p
                          v-for="(desc, i) in exp.descriptions"
                          :key="i"
                          class="text-white/70 text-sm leading-relaxed flex items-start gap-3"
                        >
                          <span class="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" :style="{ background: exp.accent + '80' }" />
                          {{ desc }}
                        </p>
                      </div>

                      <div class="flex flex-col justify-between">
                        <div class="flex flex-wrap gap-2 mb-6">
                          <span
                            v-for="t in exp.tech"
                            :key="t"
                            class="exp-tech-tag"
                          >
                            {{ t }}
                          </span>
                        </div>

                        <a
                          :href="exp.link"
                          target="_blank"
                          rel="noopener noreferrer"
                          class="exp-link"
                          @click.stop
                        >
                          {{ exp.linkLabel }}
                          <svg class="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 17L17 7M17 7H7M17 7v10" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </Transition>

              <!-- Bottom glow bar -->
              <div class="card-accent-bottom" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* ═══════════ SECTION ═══════════ */
.exp-section {
  position: relative;
  background: #000;
  overflow: hidden;
}

/* ═══════════ AMBIENT ORBS ═══════════ */
.exp-orb {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
.exp-orb-1 {
  top: 10%;
  right: -10%;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(0, 220, 130, 0.04) 0%, transparent 70%);
  filter: blur(100px);
}
.exp-orb-2 {
  bottom: 15%;
  left: -8%;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(167, 139, 250, 0.04) 0%, transparent 70%);
  filter: blur(80px);
}

/* ═══════════ TIMELINE ═══════════ */
.timeline-line {
  position: absolute;
  left: 20px;
  top: 0;
  bottom: 0;
  width: 1px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%);
  z-index: 1;
}
@media (max-width: 768px) {
  .timeline-line {
    display: none;
  }
}

.timeline-dot {
  display: none;
}
@media (min-width: 769px) {
  .timeline-dot {
    display: block;
    position: absolute;
    left: 14px;
    top: 32px;
    width: 13px;
    height: 13px;
    border-radius: 50%;
    z-index: 2;
    box-shadow: 0 0 12px var(--accent20), 0 0 4px var(--accent08);
    border: 2px solid rgba(0, 0, 0, 0.6);
    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s;
  }
  .exp-card:hover .timeline-dot {
    transform: scale(1.4);
    box-shadow: 0 0 20px var(--accent20), 0 0 8px var(--accent);
  }
  .exp-card {
    padding-left: 48px;
  }
}

/* ═══════════ CARD ═══════════ */
.exp-card-body {
  --mx: 50%;
  --my: 50%;
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 16px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.015);
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
.exp-card-body:hover,
.exp-card-body.is-active {
  border-color: rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.035);
  box-shadow: 0 20px 60px -15px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.04);
}

/* ── Mouse spotlight ── */
.card-spotlight {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.4s;
  background: radial-gradient(300px circle at var(--mx) var(--my), var(--accent08), transparent);
}
.exp-card-body:hover .card-spotlight {
  opacity: 1;
}

/* ── Top accent bar ── */
.card-accent-top {
  position: absolute;
  top: 0;
  left: 15%;
  right: 15%;
  height: 1px;
  z-index: 5;
  background: var(--accent);
  opacity: 0;
  transform: scaleX(0);
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
.exp-card-body:hover .card-accent-top,
.exp-card-body.is-active .card-accent-top {
  opacity: 0.5;
  transform: scaleX(1);
  left: 5%;
  right: 5%;
}

/* ── Shimmer sweep ── */
.card-shimmer {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  border-radius: 16px;
  overflow: hidden;
  opacity: 0;
  transition: opacity 0.3s;
}
.card-shimmer::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(105deg, transparent 42%, rgba(255, 255, 255, 0.03) 45%, rgba(255, 255, 255, 0.08) 50%, rgba(255, 255, 255, 0.03) 55%, transparent 58%);
  transform: translateX(-100%);
}
.exp-card-body:hover .card-shimmer {
  opacity: 1;
}
.exp-card-body:hover .card-shimmer::after {
  animation: exp-shimmer 1s cubic-bezier(0.4, 0, 0.2, 1) 0.1s;
}
@keyframes exp-shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

/* ── Bottom glow bar ── */
.card-accent-bottom {
  position: absolute;
  bottom: 0;
  left: 20%;
  right: 20%;
  height: 2px;
  z-index: 5;
  border-radius: 1px;
  background: linear-gradient(90deg, transparent, var(--accent), transparent);
  opacity: 0;
  transform: scaleX(0);
  transition: all 0.55s cubic-bezier(0.16, 1, 0.3, 1) 0.05s;
  box-shadow: 0 0 12px var(--accent20), 0 -4px 16px var(--accent08);
}
.exp-card-body:hover .card-accent-bottom,
.exp-card-body.is-active .card-accent-bottom {
  opacity: 0.5;
  transform: scaleX(1);
  left: 10%;
  right: 10%;
}

/* ═══════════ CONTENT STYLES ═══════════ */
.exp-number {
  font-family: var(--font-heading);
  font-size: clamp(1.8rem, 4vw, 3rem);
  font-weight: 700;
  color: rgba(255, 255, 255, 0.06);
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  line-height: 1;
}
.exp-card:hover .exp-number {
  color: var(--accent20);
  text-shadow: 0 0 30px var(--accent08);
}

.exp-title {
  font-family: var(--font-heading);
  font-size: clamp(1rem, 2.5vw, 1.5rem);
  font-weight: 600;
  color: rgba(255, 255, 255, 0.85);
  transition: all 0.5s;
}
.exp-card:hover .exp-title {
  color: #fff;
}

.exp-role {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 0.05em;
  margin-top: 4px;
  transition: color 0.5s;
}
.exp-card:hover .exp-role {
  color: rgba(255, 255, 255, 0.7);
}

.exp-year {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.4);
  letter-spacing: 0.05em;
  font-family: monospace;
  transition: color 0.5s;
}
.exp-card:hover .exp-year {
  color: rgba(255, 255, 255, 0.6);
}

.exp-toggle-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.5);
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
.exp-toggle-btn.is-open {
  transform: rotate(180deg);
  border-color: var(--accent);
  color: var(--accent);
  box-shadow: 0 0 12px var(--accent20);
}
.exp-card:hover .exp-toggle-btn:not(.is-open) {
  border-color: rgba(255, 255, 255, 0.3);
  color: rgba(255, 255, 255, 0.7);
}

.exp-tech-tag {
  padding: 5px 12px;
  border-radius: 9999px;
  font-size: 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-weight: 600;
  background: var(--accent08);
  color: var(--accent);
  border: 1px solid var(--accent20);
  opacity: 0.8;
  transition: all 0.3s;
}
.exp-tech-tag:hover {
  opacity: 1;
  box-shadow: 0 0 10px var(--accent08);
}

.exp-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.7);
  position: relative;
  width: fit-content;
  transition: color 0.3s;
}
.exp-link:hover {
  color: var(--accent);
}
.exp-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 1px;
  background: var(--accent);
  transition: width 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.exp-link:hover::after {
  width: 100%;
}
</style>
