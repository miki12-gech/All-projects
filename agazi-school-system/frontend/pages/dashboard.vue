<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <!-- Top Navigation Bar -->
    <nav class="glass-card sticky top-0 z-40 border-b border-gray-100 dark:border-gray-700 shadow-lg">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo & Title -->
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <h1 class="text-xl font-bold text-gray-800 dark:text-white">Agazi School</h1>
              <p class="text-xs text-gray-500 dark:text-gray-400">Management Dashboard</p>
            </div>
          </div>

          <!-- User Info & Actions -->
          <div class="flex items-center gap-4">
            <!-- Notifications -->
            <button class="relative p-2 text-gray-600 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-gray-700 rounded-lg transition-all">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <!-- Dark Mode Toggle -->
            <button @click="toggleTheme" class="p-2 text-gray-600 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-gray-700 rounded-lg transition-all">
              <!-- Sun Icon -->
              <svg v-if="isDark" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <!-- Moon Icon -->
              <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            </button>

            <!-- User Menu -->
            <div class="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-gray-600">
              <div class="text-right">
                <p class="text-sm font-semibold text-gray-800 dark:text-white">{{ userData?.email || 'User' }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400 capitalize">{{ userRole }}</p>
              </div>
              <div class="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                {{ (userData?.email || 'U')[0].toUpperCase() }}
              </div>
            </div>

            <!-- Logout Button -->
            <button 
              @click="logout" 
              class="px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg font-semibold transition-all flex items-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Welcome Section -->
      <div class="mb-8 fade-in-up">
        <h2 class="text-3xl font-bold text-gradient mb-2">
          Welcome back, {{ userData?.email?.split('@')[0] || 'User' }}! 👋
        </h2>
        <p class="text-gray-600 dark:text-gray-300">Here's what's happening with your school today.</p>
      </div>

      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Total Students -->
        <div class="stat-card bg-gradient-to-br from-amber-500 to-yellow-600 text-white dark:from-amber-600 dark:to-yellow-700">
          <div class="flex items-start justify-between">
            <div>
              <p class="text-yellow-100 text-sm font-medium mb-1">Total Students</p>
              <h3 class="text-3xl font-bold">{{ stats.totalStudents }}</h3>
              <p class="text-yellow-100 text-xs mt-2 flex items-center gap-1">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clip-rule="evenodd" />
                </svg>
                +12% from last month
              </p>
            </div>
            <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Teachers -->
        <div class="stat-card bg-gradient-to-br from-green-500 to-green-600 text-white dark:from-green-600 dark:to-green-700">
          <div class="flex items-start justify-between">
            <div>
              <p class="text-green-100 text-sm font-medium mb-1">Teachers</p>
              <h3 class="text-3xl font-bold">{{ stats.totalTeachers }}</h3>
              <p class="text-green-100 text-xs mt-2">Active staff members</p>
            </div>
            <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Classes -->
        <div class="stat-card bg-gradient-to-br from-blue-500 to-indigo-600 text-white dark:from-blue-600 dark:to-indigo-700">
          <div class="flex items-start justify-between">
            <div>
              <p class="text-blue-100 text-sm font-medium mb-1">Classes</p>
              <h3 class="text-3xl font-bold">{{ stats.totalClasses }}</h3>
              <p class="text-blue-100 text-xs mt-2">Across all grades</p>
            </div>
            <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Attendance Rate -->
        <div class="stat-card bg-gradient-to-br from-orange-500 to-orange-600 text-white dark:from-orange-600 dark:to-orange-700">
          <div class="flex items-start justify-between">
            <div>
              <p class="text-orange-100 text-sm font-medium mb-1">Attendance Rate</p>
              <h3 class="text-3xl font-bold">{{ stats.attendanceRate }}%</h3>
              <p class="text-orange-100 text-xs mt-2">This month average</p>
            </div>
            <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts & Tables -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <!-- Recent Students -->
        <div class="glass-card p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-bold text-gray-800 dark:text-white">Recent Students</h3>
            <NuxtLink to="/students" class="text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-semibold text-sm flex items-center gap-1">
              View All
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </NuxtLink>
          </div>
          <div class="space-y-4">
            <div v-for="student in recentStudents" :key="student.id" class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                  {{ student.firstName[0] }}{{ student.lastName[0] }}
                </div>
                <div>
                  <p class="font-semibold text-gray-800 dark:text-white">{{ student.firstName }} {{ student.lastName }}</p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">Grade {{ student.gradeLevel }}</p>
                </div>
              </div>
              <div class="badge bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300">
                {{ student.stream || 'General' }}
              </div>
            </div>
            <div v-if="!recentStudents.length" class="text-center py-8 text-gray-400">
              <svg class="w-16 h-16 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p>No students found</p>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="glass-card p-6 dark:bg-gray-800">
          <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-6">Quick Actions</h3>
          <div class="grid grid-cols-2 gap-4">
            <NuxtLink to="/students" class="p-6 bg-gradient-to-br from-amber-50 to-yellow-100 dark:from-amber-900/50 dark:to-amber-800/50 hover:from-amber-100 hover:to-yellow-200 dark:hover:from-amber-800/70 dark:hover:to-amber-700/70 rounded-xl cursor-pointer transition-all transform hover:-translate-y-1 shadow-md hover:shadow-xl border border-amber-200/50 dark:border-amber-700/50">
              <div class="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center mb-3 shadow-lg">
                <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                </svg>
              </div>
              <p class="font-bold text-gray-800 dark:text-white">Add Student</p>
              <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">Register new student</p>
            </NuxtLink>

            <NuxtLink to="/attendance" class="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/50 dark:to-green-800/50 hover:from-green-100 hover:to-green-200 dark:hover:from-green-800/70 dark:hover:to-green-700/70 rounded-xl cursor-pointer transition-all transform hover:-translate-y-1 shadow-md hover:shadow-xl border border-green-200/50 dark:border-green-700/50">
              <div class="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mb-3 shadow-lg">
                <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
              </div>
              <p class="font-bold text-gray-800 dark:text-white">Attendance</p>
              <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">Mark attendance</p>
            </NuxtLink>

            <NuxtLink to="/grades" class="p-6 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-800/50 hover:from-blue-100 hover:to-indigo-200 dark:hover:from-blue-800/70 dark:hover:to-indigo-700/70 rounded-xl cursor-pointer transition-all transform hover:-translate-y-1 shadow-md hover:shadow-xl border border-blue-200/50 dark:border-blue-700/50">
              <div class="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mb-3 shadow-lg">
                <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
              </div>
              <p class="font-bold text-gray-800 dark:text-white">Enter Grades</p>
              <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">Record student scores</p>
            </NuxtLink>

            <NuxtLink to="/reports" class="p-6 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/50 dark:to-orange-800/50 hover:from-orange-100 hover:to-orange-200 dark:hover:from-orange-800/70 dark:hover:to-orange-700/70 rounded-xl cursor-pointer transition-all transform hover:-translate-y-1 shadow-md hover:shadow-xl border border-orange-200/50 dark:border-orange-700/50">
              <div class="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mb-3 shadow-lg">
                <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <p class="font-bold text-gray-800 dark:text-white">View Reports</p>
              <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">Analytics & reports</p>
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Announcements -->
      <div class="glass-card p-6 dark:bg-gray-800">
        <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-6">📢 Latest Announcements</h3>
        <div class="space-y-4">
          <div v-for="announcement in announcements" :key="announcement.id" class="p-4 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-gray-700 dark:to-gray-600 border-l-4 border-amber-500 dark:border-amber-400 rounded-lg hover:shadow-md transition-shadow">
            <div class="flex items-start justify-between">
              <div>
                <h4 class="font-bold text-gray-800 dark:text-white">{{ announcement.title }}</h4>
                <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">{{ announcement.message }}</p>
              </div>
              <span class="text-xs text-gray-500 dark:text-gray-400">{{ announcement.date }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const userData = ref<any>(null)
const userRole = ref('')
const { get } = useApi()
const { isDark, toggleTheme, initTheme } = useTheme()

const stats = ref({
  totalStudents: 1250,
  totalTeachers: 45,
  totalClasses: 24,
  attendanceRate: 94.5
})

const recentStudents = ref<any[]>([])
const announcements = ref([
  {
    id: 1,
    title: 'Parent-Teacher Meeting',
    message: 'Scheduled for next Saturday at 2:00 PM in the school auditorium.',
    date: '2 days ago'
  },
  {
    id: 2,
    title: 'Exam Schedule Released',
    message: 'Second semester final exams will begin on March 15th, 2026.',
    date: '5 days ago'
  },
  {
    id: 3,
    title: 'New Canteen Menu',
    message: 'Updated canteen menu is now available. Check the notice board for details.',
    date: '1 week ago'
  }
])

const logout = () => {
  if (confirm('Are you sure you want to logout?')) {
    localStorage.removeItem('agazi_token')
    localStorage.removeItem('user_data')
    localStorage.removeItem('user_role')
    navigateTo('/login')
  }
}

onMounted(async () => {
  initTheme()
  
  // Load user data from localStorage
  const storedUser = localStorage.getItem('user_data')
  const storedRole = localStorage.getItem('user_role')
  
  if (storedUser) {
    try {
      userData.value = JSON.parse(storedUser)
    } catch (e) {
      console.error('Failed to parse user data:', e)
    }
  }
  if (storedRole) {
    userRole.value = storedRole
  }

  // Fetch recent students
  try {
    const students: any = await get('http://localhost:3001/api/students?limit=5')
    if (Array.isArray(students)) {
      recentStudents.value = students.slice(0, 5)
    }
  } catch (error) {
    console.warn('Failed to fetch students:', error)
  }
  
  // Try to fetch real stats if available
  try {
    const realStats: any = await get('http://localhost:3001/api/students/stats/overview')
    if (realStats) {
       stats.value.totalStudents = realStats.totalStudents || stats.value.totalStudents
       // Other stats would be updated here when backend endpoints exist
    }
  } catch (e) {
    // Keep mock stats if failed
  }
})
</script>
