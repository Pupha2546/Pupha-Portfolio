<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import gsap from 'gsap'

const isOpen = ref(false)
const isScrolled = ref(false)
const navRef = ref(null)
const progressRef = ref(null)

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Work', href: '#experience' },
  { label: 'Education', href: '#education' },
  { label: 'Contact', href: '#contact' },
]

function handleScroll() {
  isScrolled.value = window.scrollY > 80
  if (progressRef.value) {
    const scrollTop = window.scrollY
    const docHeight = document.documentElement.scrollHeight - window.innerHeight
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
    progressRef.value.style.width = progress + '%'
  }
}

function closeMenu() {
  isOpen.value = false
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  gsap.to(navRef.value, {
    y: 0,
    opacity: 1,
    duration: 1.2,
    ease: 'power4.out',
    delay: 1.5,
  })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <nav
    ref="navRef"
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-700"
    style="opacity: 0; transform: translateY(-100px)"
    :class="isScrolled
      ? 'bg-black/80 backdrop-blur-2xl border-b border-white/10'
      : 'bg-transparent'"
  >
    <div class="absolute bottom-0 left-0 h-[1px] bg-white/50 transition-all duration-100" ref="progressRef" />

    <div class="max-w-7xl mx-auto px-6 md:px-12 py-5 flex items-center justify-between">
      <a href="#home" class="group flex items-center gap-3">
        <div class="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center text-xs font-heading font-bold text-white group-hover:border-white/80 group-hover:bg-white/5 transition-all duration-500">
          P
        </div>
        <span class="hidden sm:block text-xs tracking-[0.2em] uppercase text-white/60 group-hover:text-white transition-colors duration-500">
          Pupha
        </span>
      </a>

      <div class="hidden md:flex items-center gap-10">
        <a
          v-for="link in navLinks"
          :key="link.href"
          :href="link.href"
          class="hover-line text-[11px] tracking-[0.15em] uppercase text-white/60 hover:text-white transition-colors duration-500"
        >
          {{ link.label }}
        </a>
      </div>

      <a
        href="#contact"
        class="hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[11px] tracking-wider uppercase border border-white/20 text-white/80 hover:text-white hover:border-white/50 hover:bg-white/5 transition-all duration-500"
      >
        Let's Talk
      </a>

      <button
        class="md:hidden relative w-8 h-8 flex flex-col items-center justify-center gap-[5px]"
        @click="isOpen = !isOpen"
        aria-label="Toggle menu"
      >
        <span class="w-5 h-[1px] bg-white transition-all duration-500" :class="isOpen ? 'rotate-45 translate-y-[3px]' : ''" />
        <span class="w-5 h-[1px] bg-white transition-all duration-500" :class="isOpen ? '-rotate-45 -translate-y-[3px]' : ''" />
      </button>
    </div>

    <Transition
      enter-active-class="transition-all duration-500 ease-out"
      leave-active-class="transition-all duration-300 ease-in"
      enter-from-class="opacity-0 -translate-y-8"
      leave-to-class="opacity-0 -translate-y-8"
    >
      <div v-if="isOpen" class="md:hidden bg-black/95 backdrop-blur-3xl border-b border-white/10">
        <div class="px-6 py-10 flex flex-col gap-6">
          <a
            v-for="(link, i) in navLinks"
            :key="link.href"
            :href="link.href"
            class="text-white/70 hover:text-white transition-colors text-2xl font-heading font-light"
            @click="closeMenu"
          >
            <span class="text-[10px] text-white/40 mr-3">0{{ i + 1 }}</span>
            {{ link.label }}
          </a>
        </div>
      </div>
    </Transition>
  </nav>
</template>
