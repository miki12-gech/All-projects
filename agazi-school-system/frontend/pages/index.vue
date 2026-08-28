<template>
  <div class="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
    <!-- Navigation -->
    <nav class="bg-white dark:bg-gray-800 shadow-lg sticky top-0 z-50 transition-colors duration-300">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <h1 class="text-2xl font-bold text-amber-600 dark:text-amber-400">Agazi School System</h1>
          </div>
          <div class="flex items-center space-x-4">
            <ThemeToggle />
            <NuxtLink to="/login" class="bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-700 transition-colors">
              Login
            </NuxtLink>
          </div>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="relative py-20 px-4">
      <div class="max-w-7xl mx-auto text-center">
        <h2 class="text-5xl font-bold text-gray-900 dark:text-white mb-6">
          Welcome to Agazi School System
        </h2>
        <p class="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
          Empowering education through innovative technology. Connect with our network of educational institutions and resources.
        </p>
        <div class="flex justify-center space-x-4">
          <NuxtLink to="/login" class="bg-amber-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-amber-700 transition-colors">
            Get Started
          </NuxtLink>
          <a href="#links" class="border-2 border-amber-600 text-amber-600 dark:border-amber-400 dark:text-amber-400 px-8 py-3 rounded-lg text-lg hover:bg-amber-50 dark:hover:bg-gray-800 transition-colors">
            Explore Links
          </a>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-16 px-4 bg-white dark:bg-gray-800 transition-colors duration-300">
      <div class="max-w-7xl mx-auto">
        <h3 class="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">Our Features</h3>
        <div class="grid md:grid-cols-3 gap-8">
          <div class="text-center p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow bg-white dark:bg-gray-700">
            <div class="w-16 h-16 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
              </svg>
            </div>
            <h4 class="text-xl font-semibold mb-2 dark:text-white">Digital Learning</h4>
            <p class="text-gray-600 dark:text-gray-300">Access comprehensive digital learning resources and materials</p>
          </div>
          <div class="text-center p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow bg-white dark:bg-gray-700">
            <div class="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <h4 class="text-xl font-semibold mb-2 dark:text-white">Analytics</h4>
            <p class="text-gray-600 dark:text-gray-300">Track progress and performance with detailed analytics</p>
          </div>
          <div class="text-center p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow bg-white dark:bg-gray-700">
            <div class="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
            <h4 class="text-xl font-semibold mb-2 dark:text-white">Collaboration</h4>
            <p class="text-gray-600 dark:text-gray-300">Connect with students and educators in our community</p>
          </div>
        </div>
      </div>
    </section>

    <!-- External Links Section -->
    <section id="links" class="py-16 px-4 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div class="max-w-7xl mx-auto">
        <h3 class="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">Educational Partners & Resources</h3>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <a v-for="link in externalLinks" :key="link.name" 
             :href="link.url" 
             target="_blank" 
             rel="noopener noreferrer"
             class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 group">
            <div class="flex items-center space-x-4">
              <div class="w-12 h-12 bg-amber-100 dark:bg-amber-900 rounded-lg flex items-center justify-center group-hover:bg-amber-200 dark:group-hover:bg-amber-800 transition-colors">
                <svg class="w-6 h-6 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path>
                </svg>
              </div>
              <div>
                <h4 class="font-semibold text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">{{ link.name }}</h4>
                <p class="text-sm text-gray-600 dark:text-gray-300">{{ link.description }}</p>
              </div>
            </div>
          </a>
        </div>
      </div>
    </section>

    <!-- About Section -->
    <section class="py-16 px-4 bg-white dark:bg-gray-800 transition-colors duration-300">
      <div class="max-w-7xl mx-auto">
        <div class="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">About Agazi School System</h3>
            <p class="text-gray-600 dark:text-gray-300 mb-4">
              We are dedicated to providing comprehensive educational management solutions that empower schools, 
              teachers, and students to achieve their full potential through technology.
            </p>
            <p class="text-gray-600 dark:text-gray-300 mb-6">
              Our platform integrates modern educational practices with cutting-edge technology to create 
              an environment where learning flourishes and administrative tasks are streamlined.
            </p>
            <div class="flex space-x-4">
              <div class="text-center">
                <div class="text-3xl font-bold text-amber-600 dark:text-amber-400">500+</div>
                <div class="text-sm text-gray-600 dark:text-gray-300">Students</div>
              </div>
              <div class="text-center">
                <div class="text-3xl font-bold text-amber-600 dark:text-amber-400">50+</div>
                <div class="text-sm text-gray-600 dark:text-gray-300">Teachers</div>
              </div>
              <div class="text-center">
                <div class="text-3xl font-bold text-amber-600 dark:text-amber-400">10+</div>
                <div class="text-sm text-gray-600 dark:text-gray-300">Years</div>
              </div>
            </div>
          </div>
          <div class="bg-gradient-to-r from-amber-400 to-orange-500 rounded-lg p-8 text-white">
            <img src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                 alt="Education" 
                 class="rounded-lg shadow-xl w-full h-64 object-cover">
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-12">
      <div class="max-w-7xl mx-auto px-4">
        <div class="grid md:grid-cols-4 gap-8">
          <div>
            <h4 class="text-xl font-bold mb-4">Agazi School System</h4>
            <p class="text-gray-400">
              Empowering education through innovative technology and comprehensive management solutions.
            </p>
          </div>
          <div>
            <h5 class="text-lg font-semibold mb-4">Quick Links</h5>
            <ul class="space-y-2">
              <li><NuxtLink to="/login" class="text-gray-400 hover:text-white transition-colors">Login</NuxtLink></li>
              <li><a href="#features" class="text-gray-400 hover:text-white transition-colors">Features</a></li>
              <li><a href="#links" class="text-gray-400 hover:text-white transition-colors">Partners</a></li>
            </ul>
          </div>
          <div>
            <h5 class="text-lg font-semibold mb-4">Educational Links</h5>
            <ul class="space-y-2">
              <li v-for="link in externalLinks.slice(0, 5)" :key="link.name">
                <a :href="link.url" target="_blank" rel="noopener noreferrer" 
                   class="text-gray-400 hover:text-white transition-colors text-sm">
                  {{ link.name }}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h5 class="text-lg font-semibold mb-4">Contact</h5>
            <p class="text-gray-400">
              Email: info@agazischool.edu<br>
              Phone: +251 9882728015<br>
              Address: Adigrat, Ethiopia
            </p>
          </div>
        </div>
        <div class="border-t border-gray-800 mt-8 pt-8 text-center">
          <p class="text-gray-400">
            2024 Agazi School System. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
// External links data
const externalLinks = [
  {
    name: "Agazi AA",
    url: "http://www.agaziaa.com/",
    description: "Agazi School Addis Ababa Campus"
  },
  {
    name: "Agazi UK",
    url: "https://www.agazi.org.uk/",
    description: "Agazi School United Kingdom"
  },
  {
    name: "Atse Yohannes",
    url: "http://www.atseyohannes.org/",
    description: "Atse Yohannes School"
  },
  {
    name: "Awlaelo",
    url: "http://www.awlaelo.org/",
    description: "Awlaelo Schools Association"
  },
  {
    name: "Queen Sheba",
    url: "http://www.queenshebainternational.org/",
    description: "Queen Sheba International School"
  },
  {
    name: "Addis Ababa University",
    url: "http://www.aau.edu.et/",
    description: "Premier Ethiopian University"
  },
  {
    name: "Mekelle University",
    url: "http://www.mu.edu.et/",
    description: "Leading Higher Education Institution"
  },
  {
    name: "Adama University",
    url: "http://www.adu.edu.et/",
    description: "Adama Science and Technology University"
  },
  {
    name: "ESAI",
    url: "http://esai.org/",
    description: "Ethiopian Students Association International"
  }
]

// SEO Meta
useHead({
  title: 'Agazi School System - Empowering Education',
  meta: [
    { name: 'description', content: 'Agazi School System provides comprehensive educational management solutions. Connect with our network of schools and educational resources.' }
  ]
})
</script>

<style scoped>
/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Custom animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

section {
  animation: fadeIn 0.6s ease-out;
}
</style>