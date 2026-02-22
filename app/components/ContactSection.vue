<script setup>
import { ref, onMounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const sectionRef = ref(null)

const contactLinks = [
  { label: 'Email', value: 'pupha.apply@gmail.com', href: 'mailto:pupha.apply@gmail.com', icon: 'mail' },
  { label: 'Phone', value: '098-271-2374', href: 'tel:0982712374', icon: 'phone' },
  { label: 'Location', value: 'Nakhonsawan, Thailand', href: null, icon: 'pin' },
]

// ── Form state ──
const form = ref({ name: '', email: '', message: '' })
const errors = ref({ name: '', email: '', message: '' })
const touched = ref({ name: false, email: false, message: false })
const isLoading = ref(false)
const toast = ref(null) // null | { type: 'success'|'error', text: string }

// ── Validation rules ──
function validateField(field) {
  const v = form.value[field]?.trim()
  if (field === 'name') {
    errors.value.name = v.length >= 2 ? '' : 'Name is required'
  }
  if (field === 'email') {
    errors.value.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Enter a valid email address'
  }
  if (field === 'message') {
    errors.value.message = v.length >= 10 ? '' : 'Message must be at least 10 characters'
  }
}

function onBlur(field) {
  touched.value[field] = true
  validateField(field)
}

function validateAll() {
  ;['name', 'email', 'message'].forEach(f => {
    touched.value[f] = true
    validateField(f)
  })
  return !errors.value.name && !errors.value.email && !errors.value.message
}

// ── Submit ──
async function onSubmit() {
  if (!validateAll()) return
  isLoading.value = true
  toast.value = null
  try {
    await $fetch('/api/send-contact', {
      method: 'POST',
      body: {
        name: form.value.name.trim(),
        email: form.value.email.trim(),
        message: form.value.message.trim(),
      },
    })
    toast.value = { type: 'success', text: 'Message sent! I\'ll get back to you soon.' }
    form.value = { name: '', email: '', message: '' }
    touched.value = { name: false, email: false, message: false }
    errors.value = { name: '', email: '', message: '' }
  } catch (err) {
    const serverErrors = err?.data?.data
    if (serverErrors) {
      errors.value = { ...errors.value, ...serverErrors }
    } else {
      toast.value = { type: 'error', text: 'Failed to send. Please try again later.' }
    }
  } finally {
    isLoading.value = false
    setTimeout(() => { toast.value = null }, 6000)
  }
}

onMounted(() => {
  const el = sectionRef.value
  if (!el) return

  gsap.from(el.querySelectorAll('.contact-reveal'), {
    y: 60, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out',
    scrollTrigger: { trigger: el, start: 'top 75%' },
  })

  gsap.to(el.querySelector('.big-cta-text'), {
    x: -100, ease: 'none',
    scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 1 },
  })
})
</script>

<template>
  <section id="contact" ref="sectionRef" class="relative bg-black overflow-hidden">
    <div class="h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

    <div class="section-container">
      <div class="grid lg:grid-cols-2 gap-20">

        <!-- ── Left: info ── -->
        <div>
          <span class="contact-reveal section-label">05 — Contact</span>
          <h2 class="section-reveal section-title">
            <span class="gradient-text">Let's work</span><br />
            <span class="sub-title">together</span>
          </h2>
          <p class="contact-reveal section-desc">
            Have a project in mind or just want to say hello? I'd love to hear from you.
          </p>

          <div class="space-y-6 mt-12">
            <div v-for="link in contactLinks" :key="link.label" class="contact-reveal group flex items-center gap-5">
              <div class="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center group-hover:border-white/30 transition-all duration-500">
                <svg v-if="link.icon === 'mail'" class="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <svg v-else-if="link.icon === 'phone'" class="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <svg v-else class="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p class="text-[10px] text-white/50 tracking-[0.2em] uppercase mb-1">{{ link.label }}</p>
                <component
                  :is="link.href ? 'a' : 'span'"
                  :href="link.href"
                  class="text-white/80 text-sm hover:text-white transition-colors duration-500"
                  :class="link.href ? 'hover-line' : 'cursor-default'"
                >
                  {{ link.value }}
                </component>
              </div>
            </div>
          </div>

          <div class="contact-reveal flex gap-3 mt-12">
            <a
              href="https://github.com"
              target="_blank" rel="noopener noreferrer"
              class="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-white/50 hover:text-white hover:border-white/30 hover:bg-white/[0.04] transition-all duration-500"
              aria-label="GitHub"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
            <a
              href="mailto:pupha.apply@gmail.com"
              class="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-white/50 hover:text-white hover:border-white/30 hover:bg-white/[0.04] transition-all duration-500"
              aria-label="Email"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </a>
          </div>
        </div>

        <!-- ── Right: form ── -->
        <div class="contact-reveal">
          <!-- Toast -->
          <Transition name="toast">
            <div
              v-if="toast"
              class="mb-6 flex items-start gap-3 px-5 py-4 rounded-xl border text-sm"
              :class="toast.type === 'success'
                ? 'bg-green-500/10 border-green-500/25 text-green-400'
                : 'bg-red-500/10 border-red-500/25 text-red-400'"
            >
              <span v-if="toast.type === 'success'">✓</span>
              <span v-else>✕</span>
              {{ toast.text }}
            </div>
          </Transition>

          <form class="space-y-6" @submit.prevent="onSubmit" novalidate>
            <!-- Name -->
            <div>
              <label for="name" class="block text-[10px] tracking-[0.2em] uppercase text-white/50 mb-3">Name</label>
              <input
                id="name" type="text" placeholder="Your name"
                v-model="form.name"
                @blur="onBlur('name')"
                class="w-full px-0 py-4 bg-transparent border-0 border-b text-white text-sm placeholder-white/35 focus:outline-none transition-colors"
                :class="touched.name && errors.name ? 'border-red-500/60' : 'border-white/15 focus:border-white/40'"
              />
              <p v-if="touched.name && errors.name" class="mt-2 text-xs text-red-400">{{ errors.name }}</p>
            </div>

            <!-- Email -->
            <div>
              <label for="email" class="block text-[10px] tracking-[0.2em] uppercase text-white/50 mb-3">Email</label>
              <input
                id="email" type="email" placeholder="your@email.com"
                v-model="form.email"
                @blur="onBlur('email')"
                class="w-full px-0 py-4 bg-transparent border-0 border-b text-white text-sm placeholder-white/35 focus:outline-none transition-colors"
                :class="touched.email && errors.email ? 'border-red-500/60' : 'border-white/15 focus:border-white/40'"
              />
              <p v-if="touched.email && errors.email" class="mt-2 text-xs text-red-400">{{ errors.email }}</p>
            </div>

            <!-- Message -->
            <div>
              <label for="message" class="block text-[10px] tracking-[0.2em] uppercase text-white/50 mb-3">Message</label>
              <textarea
                id="message" rows="4" placeholder="Your message..."
                v-model="form.message"
                @blur="onBlur('message')"
                class="w-full px-0 py-4 bg-transparent border-0 border-b text-white text-sm placeholder-white/35 focus:outline-none transition-colors resize-none"
                :class="touched.message && errors.message ? 'border-red-500/60' : 'border-white/15 focus:border-white/40'"
              />
              <p v-if="touched.message && errors.message" class="mt-2 text-xs text-red-400">{{ errors.message }}</p>
            </div>

            <!-- Submit -->
            <button
              type="submit"
              :disabled="isLoading"
              class="group mt-4 w-full sm:w-auto px-10 py-4 rounded-full bg-white text-black text-sm font-medium tracking-wide hover:bg-white/90 hover:shadow-[0_10px_40px_rgba(255,255,255,0.1)] transition-all duration-500 hover:scale-105 disabled:opacity-60 disabled:scale-100 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <svg v-if="isLoading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              <span>{{ isLoading ? 'Sending…' : 'Send Message' }}</span>
              <span v-if="!isLoading" class="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
            </button>
          </form>
        </div>
      </div>

      <div class="mt-32 overflow-hidden">
        <div class="big-cta-text whitespace-nowrap">
          <span class="text-[6rem] md:text-[10rem] font-heading font-bold text-white/[0.04] leading-none select-none">
            LET'S CREATE SOMETHING AMAZING TOGETHER ✦
          </span>
        </div>
      </div>
    </div>

    <div class="border-t border-white/10">
      <div class="max-w-7xl mx-auto px-6 md:px-12 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p class="text-white/40 text-[11px] tracking-wider">© 2025 Pupha Pomngern</p>
        <p class="text-white/25 text-[10px] tracking-wider">Built with Nuxt · Tailwind CSS · Three.js · GSAP</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.toast-enter-active, .toast-leave-active { transition: all 0.4s cubic-bezier(0.16,1,0.3,1); }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(-8px); }
</style>
