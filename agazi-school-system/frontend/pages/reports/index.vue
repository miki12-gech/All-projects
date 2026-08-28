<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Top Navigation Bar -->
    <nav class="glass-card sticky top-0 z-40 border-b border-gray-100 shadow-lg">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center gap-4">
            <NuxtLink to="/dashboard" class="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
              <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
              </svg>
            </NuxtLink>
            <div>
              <h1 class="text-xl font-bold text-gray-800">Reports & Analytics</h1>
              <p class="text-xs text-gray-500">View school performance metrics</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <ThemeToggle />
            <NuxtLink to="/dashboard" class="px-4 py-2 text-gray-600 hover:text-amber-600 font-semibold transition-all flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back
            </NuxtLink>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Report Type Selection -->
      <div class="glass-card p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">Report Type</label>
            <select v-model="reportType" class="input-field">
              <option value="attendance">Attendance Report</option>
              <option value="grades">Grades Report</option>
              <option value="performance">Performance Overview</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">Grade Level</label>
            <select v-model="filterGrade" class="input-field">
              <option value="">All Grades</option>
              <option value="9">Grade 9</option>
              <option value="10">Grade 10</option>
              <option value="11">Grade 11</option>
              <option value="12">Grade 12</option>
            </select>
          </div>
          <div class="flex items-end gap-2">
            <button @click="generateReport" class="btn-primary flex-1">
              Generate Report
            </button>
            <button @click="exportReport" class="btn-secondary">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Report Cards -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <!-- Overall Statistics -->
        <div class="glass-card p-6">
          <h3 class="text-xl font-bold text-gray-800 mb-4">Overall Statistics</h3>
          <div class="space-y-4">
            <div class="flex justify-between items-center p-4 bg-blue-50 rounded-xl">
              <div>
                <p class="text-sm text-gray-600">Total Students</p>
                <p class="text-2xl font-bold text-blue-600">{{ overall.totalStudents || '—' }}</p>
              </div>
              <div class="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
              </div>
            </div>

            <div class="flex justify-between items-center p-4 bg-green-50 rounded-xl">
              <div>
                <p class="text-sm text-gray-600">Average Attendance</p>
                <p class="text-2xl font-bold text-green-600">94.5%</p>
              </div>
              <div class="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
              </div>
            </div>

            <div class="flex justify-between items-center p-4 bg-amber-50 rounded-xl">
              <div>
                <p class="text-sm text-gray-600">Average Grade</p>
                <p class="text-2xl font-bold text-amber-700">82.3%</p>
              </div>
              <div class="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Grade Distribution -->
        <div class="glass-card p-6">
          <h3 class="text-xl font-bold text-gray-800 mb-4">Grade Distribution</h3>
          <div class="space-y-3">
            <div>
              <div class="flex justify-between mb-1">
                <span class="text-sm font-semibold text-gray-700">Grade A (90-100)</span>
                <span class="text-sm font-semibold text-green-600">25%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-3">
                <div class="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full" style="width: 25%"></div>
              </div>
            </div>

            <div>
              <div class="flex justify-between mb-1">
                <span class="text-sm font-semibold text-gray-700">Grade B (80-89)</span>
                <span class="text-sm font-semibold text-blue-600">35%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-3">
                <div class="bg-gradient-to-r from-blue-400 to-blue-600 h-3 rounded-full" style="width: 35%"></div>
              </div>
            </div>

            <div>
              <div class="flex justify-between mb-1">
                <span class="text-sm font-semibold text-gray-700">Grade C (70-79)</span>
                <span class="text-sm font-semibold text-yellow-600">25%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-3">
                <div class="bg-gradient-to-r from-yellow-400 to-yellow-600 h-3 rounded-full" style="width: 25%"></div>
              </div>
            </div>

            <div>
              <div class="flex justify-between mb-1">
                <span class="text-sm font-semibold text-gray-700">Grade D (60-69)</span>
                <span class="text-sm font-semibold text-orange-600">10%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-3">
                <div class="bg-gradient-to-r from-orange-400 to-orange-600 h-3 rounded-full" style="width: 10%"></div>
              </div>
            </div>

            <div>
              <div class="flex justify-between mb-1">
                <span class="text-sm font-semibold text-gray-700">Grade F (<60)</span>
                <span class="text-sm font-semibold text-red-600">5%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-3">
                <div class="bg-gradient-to-r from-red-400 to-red-600 h-3 rounded-full" style="width: 5%"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Detailed Reports Table -->
      <div class="glass-card overflow-hidden">
        <div class="p-6 border-b border-gray-100">
          <h3 class="text-xl font-bold text-gray-800">Top Performing Students</h3>
          <p class="text-sm text-gray-500 mt-1">Students with highest academic performance</p>
        </div>

        <table class="data-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Student Name</th>
              <th>Grade</th>
              <th>Average Score</th>
              <th>Attendance</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(student, index) in topStudents" :key="index">
              <td>
                <div class="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                  {{ index + 1 }}
                </div>
              </td>
              <td>
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                    {{ student.name.split(' ').map(n => n[0]).join('') }}
                  </div>
                  <p class="font-semibold text-gray-800">{{ student.name }}</p>
                </div>
              </td>
              <td><div class="badge badge-info">Grade {{ student.grade }}</div></td>
              <td><span class="font-bold text-green-600">{{ student.average }}%</span></td>
              <td><span class="font-semibold text-blue-600">{{ student.attendance }}%</span></td>
              <td><div class="badge badge-success">Excellent</div></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { get } = useApi()

const reportType = ref('performance')
const filterGrade = ref('')

const overall = ref({
  totalStudents: 0,
  averageAttendance: 0,
  averageGrade: 0,
})

const topStudents = ref([
  { name: 'Abebe Kebede', grade: 12, average: 95.5, attendance: 98 },
  { name: 'Meron Tadesse', grade: 11, average: 94.2, attendance: 97 },
  { name: 'Dawit Alemu', grade: 12, average: 93.8, attendance: 99 },
  { name: 'Sara Mohammed', grade: 10, average: 92.5, attendance: 96 },
  { name: 'Yonas Haile', grade: 11, average: 91.3, attendance: 95 },
])

const generateReport = async () => {
  // Start with real data we already have in backend: student stats
  try {
    const stats = await get('http://localhost:3001/api/students/stats/overview')
    overall.value.totalStudents = stats.total || 0
  } catch (e) {
    console.error(e)
    alert('Failed to load report data (check permissions/login).')
  }
}

const exportReport = () => {
  // Export current table as CSV (works now)
  const rows = [
    ['Rank', 'Student Name', 'Grade', 'Average Score', 'Attendance'],
    ...topStudents.value.map((s, idx) => [String(idx + 1), s.name, String(s.grade), String(s.average), String(s.attendance)]),
  ]

  const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `report-${reportType.value || 'performance'}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

onMounted(() => {
  // best-effort init
  generateReport()
})
</script>
