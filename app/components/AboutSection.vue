<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const sectionRef = ref(null)
const statRefs = ref([])

// Images for the card stack
const images = ref([
  '/images/pupha-image-1.jpg',
  '/images/pupha-image-2.jpg',
  '/images/pupha-image-3.jpg',
  '/images/pupha-image-4.jpg',
  '/images/pupha-image-5.jpg'
])

const isAnimating = ref(false)
const autoPlayInterval = ref(null)

const startAutoPlay = () => {
  stopAutoPlay()
  autoPlayInterval.value = setInterval(() => {
    shuffleCards()
  }, 3000)
}

const stopAutoPlay = () => {
  if (autoPlayInterval.value) {
    clearInterval(autoPlayInterval.value)
    autoPlayInterval.value = null
  }
}

const shuffleCards = () => {
  if (isAnimating.value) return
  isAnimating.value = true

  const cards = sectionRef.value.querySelectorAll('.card')
  const topCard = cards[0]

  const tl = gsap.timeline({
    onComplete: () => {
      // Move the first image to the end of the array to update the DOM order
      const firstImage = images.value.shift()
      images.value.push(firstImage)

      gsap.set(topCard, { clearProps: 'x,rotation,opacity,transform,rotationX,rotationY' })
      isAnimating.value = false
    }
  })

  // Animate top card to the right and rotate
  tl.to(topCard, {
    x: 200,
    rotation: 20,
    opacity: 0,
    duration: 0.4,
    ease: 'power2.in'
  })
}

const cardStackRef = ref(null)

const handleMouseMove = (e) => {
  stopAutoPlay() // Pause on hover
  if (isAnimating.value) return
  const el = cardStackRef.value
  if (!el) return

  const rect = el.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top

  const centerX = rect.width / 2
  const centerY = rect.height / 2

  const rotateX = ((y - centerY) / centerY) * -10 // Max 10deg
  const rotateY = ((x - centerX) / centerX) * 10 // Max 10deg

  gsap.to(el.querySelectorAll('.card'), {
    rotationX: rotateX,
    rotationY: rotateY,
    duration: 0.5,
    ease: 'power2.out',
    stagger: 0.05 // Parallax effect
  })
}

const handleMouseLeave = () => {
  startAutoPlay() // Resume on leave
  if (isAnimating.value) return
  const el = cardStackRef.value
  if (!el) return

  gsap.to(el.querySelectorAll('.card'), {
    rotationX: 0,
    rotationY: 0,
    duration: 0.5,
    ease: 'power2.out'
  })
}

const stats = [
  { number: '3.32', label: 'GPAX' },
  { number: '4+', label: 'Projects' },
  { number: '8+', label: 'Technologies' },
  { number: '2+', label: 'Years Exp.' },
]

onMounted(() => {
  startAutoPlay()

  const el = sectionRef.value
  if (!el) return

  gsap.from(el.querySelectorAll('.about-reveal'), {
    y: 80,
    opacity: 0,
    duration: 1,
    stagger: 0.12,
    ease: 'power3.out',
    scrollTrigger: { trigger: el, start: 'top 75%' },
  })

  gsap.from(el.querySelector('.stretch-line'), {
    scaleX: 0,
    duration: 1.5,
    ease: 'power3.inOut',
    transformOrigin: 'left',
    scrollTrigger: { trigger: el, start: 'top 70%' },
  })

  // Continuous Scramble Animation for Stats
  if (statRefs.value && statRefs.value.length) {
    const chars = "0123456789+."
    const scrambleIntervals = []
    const revealTimeouts = []

    statRefs.value.forEach((statEl, index) => {
      const originalText = stats[index].number
      let revealedCount = 0
      let isRevealing = false

      const startScramble = () => {
        if (scrambleIntervals[index]) clearInterval(scrambleIntervals[index])
        if (revealTimeouts[index]) clearTimeout(revealTimeouts[index])

        revealedCount = 0
        isRevealing = false

        scrambleIntervals[index] = setInterval(() => {
          let scrambled = ""

          if (isRevealing) {
            if (revealedCount >= originalText.length) {
              clearInterval(scrambleIntervals[index])
              statEl.innerText = originalText
              return
            }

            scrambled = originalText.substring(0, revealedCount)
            for (let i = revealedCount; i < originalText.length; i++) {
              scrambled += chars[Math.floor(Math.random() * chars.length)]
            }
          } else {
            for (let i = 0; i < originalText.length; i++) {
              scrambled += chars[Math.floor(Math.random() * chars.length)]
            }
          }
          statEl.innerText = scrambled
        }, 50)
      }

      const reveal = () => {
        isRevealing = true
        let revealStep = 0

        const step = () => {
          revealedCount = revealStep
          revealStep++

          if (revealStep <= originalText.length) {
            revealTimeouts[index] = setTimeout(step, 100)
          }
        }
        step()
      }

      // Initial state: start scrambling immediately
      startScramble()

      ScrollTrigger.create({
        trigger: statEl,
        start: "top 85%", // Revealing point
        onEnter: () => reveal(),
        onLeaveBack: () => startScramble(), // Resume scrambling if scrolled back up
      })
    })

    // Store intervals for cleanup
    onUnmounted(() => {
      scrambleIntervals.forEach(interval => clearInterval(interval))
      revealTimeouts.forEach(timeout => clearTimeout(timeout))
    })
  }
})

onUnmounted(() => {
  stopAutoPlay()
})
</script>

<template>
  <section id="about" ref="sectionRef" class="relative bg-black overflow-hidden">
    <div class="stretch-line h-[1px] bg-gradient-to-r from-white/20 via-white/10 to-transparent" />

    <div class="section-container">
      <div class="grid lg:grid-cols-12 gap-16 items-start">
        <div class="lg:col-span-5">
          <span class="about-reveal section-label">01 — About</span>
          <h2 class="section-reveal section-title">
            <span class="gradient-text">Crafting digital</span><br />
            <span class="sub-title">experiences</span>
          </h2>

          <div class="about-reveal mt-10 relative h-[400px] w-full max-w-xs [perspective:1000px] group cursor-pointer"
            ref="cardStackRef" @click="shuffleCards" @mousemove="handleMouseMove" @mouseleave="handleMouseLeave">
            <div v-for="(image, index) in images" :key="image"
              class="card absolute inset-0 w-full h-full rounded-2xl overflow-hidden shadow-2xl transition-transform duration-500 ease-out border border-white/10"
              :style="{
                zIndex: images.length - index,
                transform: `
                  translateY(${index * 4}px) 
                  translateX(${index % 2 === 0 ? index * 1 : -index * 1}px) 
                  rotate(${index % 2 === 0 ? index * 1.5 : -index * 1.5}deg) 
                  scale(${1 - index * 0.04})
                `,
                backgroundImage: `url(${image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                transformOrigin: 'center bottom'
              }">
              <div class="absolute inset-0 bg-black/20" />
            </div>
          </div>

          <div class="mt-8 text-left about-reveal">
            <p class="text-[10px] tracking-[0.3em] uppercase text-white/60">Developer</p>
            <p class="text-sm font-heading font-semibold text-white mt-1">Pupha Pomngern</p>
          </div>
        </div>



        <div class="lg:col-span-7 lg:pt-20">
          <p class="about-reveal text-white/80 text-lg leading-[1.8] mb-8">
            Hi, I'm <span class="text-white font-medium">Pupha Pomngern</span> — a Full Stack Developer
            based in Nakhonsawan, Thailand. I graduated from
            <span class="text-white">King Mongkut's University of Technology Thonburi (KMUTT)</span>
            with a degree in Information Technology.
          </p>
          <p class="about-reveal text-white/65 leading-[1.8] mb-8">
            I'm passionate about building web applications that are not only functional but also beautiful
            and intuitive. My experience spans frontend frameworks like Nuxt and Next.js to backend
            technologies like Node.js, Express, and databases.
          </p>
          <p class="about-reveal text-white/65 leading-[1.8] mb-12">
            When I'm not coding, you'll find me playing guitar 🎸 or exploring new technologies
            to stay ahead of the curve.
          </p>

          <div class="about-reveal grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div v-for="stat in stats" :key="stat.label" class="py-6 border-t border-white/10 group">
              <div ref="statRefs" class="text-2xl md:text-3xl font-heading font-bold text-white mb-2">
                {{ stat.number }}
              </div>
              <div class="text-[10px] tracking-[0.2em] uppercase text-white/50">
                {{ stat.label }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

