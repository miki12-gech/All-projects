<template>
  <div class="min-h-screen bg-gray-50 p-4 md:p-10">
    <!-- Back Button -->
    <div class="max-w-4xl mx-auto mb-4">
      <NuxtLink to="/reports" class="inline-flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-blue-600 font-semibold transition-all">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Reports
      </NuxtLink>
    </div>

    <!-- Report Card -->
    <div class="max-w-4xl mx-auto glass-card overflow-hidden fade-in-up">
      <!-- Header -->
      <div class="p-8 text-center bg-gradient-to-br from-amber-500 to-yellow-600 text-white">
        <div class="w-20 h-20 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl">
          <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <h1 class="text-4xl font-bold mb-2">አጋዚ መሰናዶ ትምህርት ቤት</h1>
        <p class="text-blue-100 font-semibold uppercase tracking-widest">Student Report Card</p>
        
        <!-- Term Selector -->
        <div class="mt-6 flex justify-center">
          <select 
            v-model="selectedTerm" 
            @change="fetchReport" 
            class="px-6 py-3 bg-white/20 backdrop-blur-lg border-2 border-white/30 rounded-xl text-white font-semibold outline-none focus:ring-4 focus:ring-white/30 transition-all cursor-pointer"
          >
            <option value="1" class="text-gray-800">Term 1</option>
            <option value="2" class="text-gray-800">Term 2</option>
          </select>
        </div>
      </div>

      <!-- Student Info (if available) -->
      <div v-if="studentInfo" class="p-8 bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-100">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              {{ (studentInfo.firstName || 'S')[0] }}{{ (studentInfo.lastName || 'T')[0] }}
            </div>
            <div>
              <h2 class="text-2xl font-bold text-gray-800">{{ studentInfo.firstName }} {{ studentInfo.lastName }}</h2>
              <p class="text-gray-600">Grade {{ studentInfo.gradeLevel }} • {{ studentInfo.stream || 'General' }}</p>
            </div>
          </div>
          <div class="text-right">
            <p class="text-sm text-gray-500 font-semibold">Student ID</p>
            <p class="text-lg font-bold text-gray-800">{{ route.params.id.slice(0, 8) }}</p>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="p-20 text-center">
        <svg class="animate-spin h-16 w-16 mx-auto text-blue-600 mb-4" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="text-gray-600 font-semibold">Loading report card...</p>
      </div>

      <!-- No Data State -->
      <div v-else-if="!report" class="p-20 text-center text-gray-400">
        <svg class="w-24 h-24 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p class="text-xl font-bold mb-2">No Report Available</p>
        <p class="text-sm">No grades have been recorded for this term yet.</p>
      </div>

      <!-- Report Content -->
      <div v-else>
        <!-- Summary Statistics -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 p-8 bg-gray-50">
          <div class="stat-card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <div class="text-center">
              <p class="text-blue-100 text-sm font-medium mb-2">Average Score</p>
              <p class="text-5xl font-bold">{{ report.average }}%</p>
              <div class="mt-3">
                <div :class="[
                  'inline-block px-4 py-1 rounded-full font-semibold text-sm',
                  report.average >= 90 ? 'bg-green-400' : 
                  report.average >= 80 ? 'bg-blue-400' : 
                  report.average >= 70 ? 'bg-yellow-400' : 
                  report.average >= 60 ? 'bg-orange-400' : 'bg-red-400'
                ]">
                  {{ getLetterGrade(report.average) }}
                </div>
              </div>
            </div>
          </div>

          <div class="stat-card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <div class="text-center">
              <p class="text-purple-100 text-sm font-medium mb-2">Total Score</p>
              <p class="text-5xl font-bold">{{ report.totalScore }}</p>
              <p class="text-purple-100 text-sm mt-3">Out of {{ report.totalPossible || (report.details?.length || 0) * 100 }}</p>
            </div>
          </div>

          <div class="stat-card bg-gradient-to-br from-green-500 to-emerald-600 text-white">
            <div class="text-center">
              <p class="text-green-100 text-sm font-medium mb-2">Status</p>
              <div class="my-3">
                <svg v-if="report.status === 'PASSED'" class="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                <svg v-else class="w-16 h-16 mx-auto text-red-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
              </div>
              <p class="text-2xl font-bold">{{ report.status === 'PASSED' ? 'PASSED' : 'FAILED' }}</p>
            </div>
          </div>
        </div>

        <!-- Detailed Grades Table -->
        <div class="p-8">
          <h3 class="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <svg class="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            Subject Grades
          </h3>
          
          <table class="data-table">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Score</th>
                <th>Letter Grade</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in report.details" :key="item.subject">
                <td>
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold">
                      {{ item.subject.charAt(0) }}
                    </div>
                    <span class="font-semibold text-gray-800">{{ item.subject }}</span>
                  </div>
                </td>
                <td><span class="text-xl font-bold text-blue-600">{{ item.score }}%</span></td>
                <td>
                  <div :class="[
                    'badge',
                    getLetterGrade(item.score) === 'A' ? 'badge-success' : '',
                    getLetterGrade(item.score) === 'B' ? 'badge-info' : '',
                    getLetterGrade(item.score) === 'C' ? 'badge-warning' : '',
                    ['D', 'F'].includes(getLetterGrade(item.score)) ? 'badge-error' : ''
                  ]">
                    {{ getLetterGrade(item.score) }}
                  </div>
                </td>
                <td>
                  <div v-if="item.score >= 50" class="badge badge-success">Passed</div>
                  <div v-else class="badge badge-error">Failed</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Performance Chart -->
        <div class="p-8 bg-gray-50">
          <h3 class="text-xl font-bold text-gray-800 mb-4">Performance Distribution</h3>
          <div class="space-y-3">
            <div v-for="item in report.details" :key="item.subject">
              <div class="flex justify-between mb-1">
                <span class="text-sm font-semibold text-gray-700">{{ item.subject }}</span>
                <span class="text-sm font-bold text-blue-600">{{ item.score }}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-3">
                <div 
                  :class="[
                    'h-3 rounded-full transition-all duration-500',
                    item.score >= 90 ? 'bg-gradient-to-r from-green-400 to-green-600' :
                    item.score >= 80 ? 'bg-gradient-to-r from-blue-400 to-blue-600' :
                    item.score >= 70 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                    item.score >= 60 ? 'bg-gradient-to-r from-orange-400 to-orange-600' :
                    'bg-gradient-to-r from-red-400 to-red-600'
                  ]"
                  :style="{ width: item.score + '%' }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer with Actions -->
        <div class="p-6 bg-white border-t border-gray-100 flex justify-between items-center">
          <div class="text-sm text-gray-500">
            <p class="font-semibold">Report Generated: {{ new Date().toLocaleDateString() }}</p>
            <p>Term {{ selectedTerm }} • Academic Year 2025/2026</p>
          </div>
          <div class="flex gap-3">
            <button @click="exportCSV" class="btn-secondary flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export CSV
            </button>
            <button @click="printReport" class="btn-primary flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print Report
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { get } = useApi()
const report = ref<any>(null)
const studentInfo = ref<any>(null)
const loading = ref(false)
const selectedTerm = ref(1)

const fetchReport = async () => {
  loading.value = true
  report.value = null
  try {
    const data = await get(`http://localhost:3001/api/grade/report/${route.params.id}?term=${selectedTerm.value}`)
    report.value = data
    
    // Fetch student info
    try {
      studentInfo.value = await get(`http://localhost:3001/api/students/${route.params.id}`)
    } catch (e) {
      console.error('Failed to fetch student info')
    }
  } catch (e) {
    console.error('Report not found')
  } finally {
    loading.value = false
  }
}

const getLetterGrade = (score: number): string => {
  if (score >= 90) return 'A'
  if (score >= 80) return 'B'
  if (score >= 70) return 'C'
  if (score >= 60) return 'D'
  return 'F'
}

const printReport = () => {
  window.print()
}

const exportCSV = () => {
  if (!report.value) return
  const rows = [
    ['Subject', 'Score', 'LetterGrade', 'Status'],
    ...(report.value.subjects || report.value.details || []).map((s: any) => [
      s.subject || s.subjectName || '',
      String(s.totalScore ?? s.score ?? ''),
      String(s.letterGrade ?? getLetterGrade(s.totalScore ?? s.score ?? 0)),
      String(s.status ?? ((s.totalScore ?? s.score ?? 0) >= 50 ? 'PASSED' : 'FAILED')),
    ]),
  ]

  const csv = rows
    .map((r: any[]) => r.map((v: unknown) => `"${String(v).replace(/"/g, '""')}"`).join(','))
    .join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `report-${route.params.id}-term${selectedTerm.value}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

onMounted(fetchReport)
</script>

<style scoped>
@media print {
  button, select, a { 
    display: none !important; 
  }
  .bg-gray-50 { 
    background: white !important; 
  }
  .glass-card, .stat-card { 
    box-shadow: none !important; 
    border: 1px solid #eee !important;
  }
}
</style>