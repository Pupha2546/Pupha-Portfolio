<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as THREE from 'three'
import gsap from 'gsap'

const canvasRef = ref(null)
let renderer, scene, camera, particleSystem, animationId, mouseX = 0, mouseY = 0

function initThree() {
  const canvas = canvasRef.value
  if (!canvas) return

  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.z = 4

  renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  const count = 800
  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(count * 3)

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 18
    positions[i * 3 + 1] = (Math.random() - 0.5) * 18
    positions[i * 3 + 2] = (Math.random() - 0.5) * 14
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

  const material = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.018,
    transparent: true,
    opacity: 0.6,
    sizeAttenuation: true,
  })

  particleSystem = new THREE.Points(geometry, material)
  scene.add(particleSystem)

  const ringGeo = new THREE.TorusGeometry(2.5, 0.005, 16, 100)
  const ringMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.1, wireframe: true })
  const ring = new THREE.Mesh(ringGeo, ringMat)
  ring.rotation.x = Math.PI * 0.4
  scene.add(ring)

  const ring2Geo = new THREE.TorusGeometry(3.2, 0.003, 16, 100)
  const ring2 = new THREE.Mesh(ring2Geo, ringMat.clone())
  ring2.material.opacity = 0.05
  ring2.rotation.x = Math.PI * 0.6
  ring2.rotation.y = Math.PI * 0.2
  scene.add(ring2)

  window.addEventListener('mousemove', onMouseMove)

  function animate() {
    animationId = requestAnimationFrame(animate)
    particleSystem.rotation.y += 0.0002
    particleSystem.rotation.x += 0.0001
    ring.rotation.z += 0.001
    ring2.rotation.z -= 0.0007
    camera.position.x += (mouseX * 0.3 - camera.position.x) * 0.015
    camera.position.y += (-mouseY * 0.3 - camera.position.y) * 0.015
    renderer.render(scene, camera)
  }
  animate()
  window.addEventListener('resize', onResize)
}

function onMouseMove(e) {
  mouseX = (e.clientX / window.innerWidth - 0.5) * 2
  mouseY = (e.clientY / window.innerHeight - 0.5) * 2
}

function onResize() {
  if (!camera || !renderer) return
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

onMounted(() => {
  initThree()
  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })
  tl.from('.hero-label', { y: 40, opacity: 0, duration: 1, delay: 0.3 })
    .from('.hero-firstname', { y: 120, opacity: 0, duration: 1.4, skewY: 5 }, '-=0.5')
    .from('.hero-lastname', { y: 120, opacity: 0, duration: 1.4, skewY: 5 }, '-=1.1')
    .from('.hero-tagline', { y: 30, opacity: 0, duration: 1 }, '-=0.6')
    .from('.hero-buttons', { y: 30, opacity: 0, duration: 0.8 }, '-=0.5')
    .from('.hero-scroll', { opacity: 0, duration: 1.5 }, '-=0.3')
    .from('.hero-side-text', { x: -20, opacity: 0, duration: 1 }, '-=1.5')
})

onBeforeUnmount(() => {
  if (animationId) cancelAnimationFrame(animationId)
  if (renderer) renderer.dispose()
  window.removeEventListener('resize', onResize)
  window.removeEventListener('mousemove', onMouseMove)
})
</script>

<template>
  <section id="home" class="relative min-h-screen flex items-center justify-center overflow-hidden">
    <canvas ref="canvasRef" class="absolute inset-0 w-full h-full" />
    <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#000_75%)] z-[1]" />
    <div class="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black to-transparent z-[1]" />

    <div class="hero-side-text hidden lg:flex absolute left-8 top-1/2 -translate-y-1/2 z-10">
      <span class="text-[10px] tracking-[0.4em] uppercase text-white/40 [writing-mode:vertical-lr] rotate-180">
        Full Stack Developer — Portfolio 2025
      </span>
    </div>

    <div class="relative z-10 text-center px-6 max-w-5xl">
      <div class="hero-label mb-8">
        <span
          class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-medium tracking-[0.25em] uppercase border border-green-500/40 text-green-400 bg-green-500/[0.07]">
          <span class="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          Available for work
        </span>
      </div>

      <div class="overflow-hidden mb-2">
        <h1
          class="hero-firstname font-heading text-6xl sm:text-7xl md:text-8xl lg:text-[9rem] font-bold text-white leading-[0.9] tracking-tight">
          PUPHA
        </h1>
      </div>
      <div class="overflow-hidden mb-10">
        <h1
          class="hero-lastname font-heading text-6xl sm:text-7xl md:text-8xl lg:text-[9rem] font-bold leading-[0.9] tracking-tight shimmer-text">
          POMNGERN
        </h1>
      </div>

      <p class="hero-tagline text-white/70 text-sm md:text-base max-w-lg mx-auto leading-relaxed mb-12 font-light">
        A developer eager to craft intuitive, user-focused digital experiences
        <br class="hidden md:block" />
        with modern technologies and clean code.
      </p>

      <div class="hero-buttons flex flex-col sm:flex-row gap-4 justify-center items-center">
        <a href="#experience" class="btn-primary">
          <span class="relative z-10">View Projects</span>
          <svg class="relative z-10 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </a>
        <a href="#contact" class="btn-outline">Get In Touch</a>
      </div>
    </div>

    <div class="hero-scroll absolute bottom-12 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3">
      <div class="w-[1px] h-12 relative overflow-hidden">
        <div
          class="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/60 to-transparent animate-[slideDown_2s_ease-in-out_infinite]" />
      </div>
    </div>

    <div class="hidden lg:block absolute top-8 right-8 z-10">
      <div class="w-16 h-16 border-t border-r border-white/15" />
    </div>
    <div class="hidden lg:block absolute bottom-8 left-8 z-10">
      <div class="w-16 h-16 border-b border-l border-white/15" />
    </div>
  </section>
</template>

<style scoped>
@keyframes slideDown {
  0% {
    transform: translateY(-100%);
  }

  100% {
    transform: translateY(100%);
  }
}
</style>
