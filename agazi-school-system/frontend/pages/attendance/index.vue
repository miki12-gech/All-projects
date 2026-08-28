<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <!-- Top Navigation Bar -->
    <nav class="glass-card sticky top-0 z-40 border-b border-gray-100 dark:border-gray-700 shadow-lg">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center gap-4">
            <NuxtLink to="/dashboard" class="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
              <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
            </NuxtLink>
            <div>
              <h1 class="text-xl font-bold text-gray-800 dark:text-white">Attendance Management</h1>
              <p class="text-xs text-gray-500 dark:text-gray-400">Mark daily attendance for students</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <ThemeToggle />
            <NuxtLink to="/dashboard" class="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 font-semibold transition-all flex items-center gap-2">
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
      <!-- Date and Grade/Section Selection -->
      <div class="glass-card p-6 mb-6 dark:bg-gray-800">
        <h2 class="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
          <svg class="w-6 h-6 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
          </svg>
          Attendance Filters
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Select Date</label>
            <input v-model="selectedDate" type="date" class="input-field" />
          </div>
          <div>
            <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Select Grade *</label>
            <select v-model="selectedGrade" @change="onGradeChange" class="input-field">
              <option value="">Choose Grade</option>
              <option value="9">Grade 9</option>
              <option value="10">Grade 10</option>
              <option value="11">Grade 11</option>
              <option value="12">Grade 12</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Select Section *</label>
            <select 
              v-model="selectedSection" 
              @change="loadStudents" 
              :disabled="!selectedGrade"
              class="input-field"
              :class="{ 'opacity-50 cursor-not-allowed': !selectedGrade }"
            >
              <option value="">All Sections</option>
              <option v-for="section in availableSections" :key="section" :value="section">
                Section {{ section }}
              </option>
            </select>
            <p v-if="!selectedGrade" class="text-xs text-amber-600 dark:text-amber-400 mt-1">Select a grade first</p>
          </div>
          <div class="flex items-end">
            <button 
              @click="saveAttendance" 
              :disabled="!selectedGrade || saving" 
              class="btn-primary w-full flex items-center justify-center gap-2"
            >
              <svg v-if="saving" class="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span v-if="saving">Saving...</span>
              <span v-else>💾 Save Attendance</span>
            </button>
          </div>
        </div>
        
        <!-- Current Selection Display -->
        <div v-if="selectedGrade" class="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 dark:border-amber-600 rounded-r-lg">
          <p class="text-sm font-semibold text-gray-700 dark:text-gray-300">
            📚 Viewing: <span class="text-amber-700 dark:text-amber-400">Grade {{ selectedGrade }}</span>
            <span v-if="selectedSection" class="text-amber-700 dark:text-amber-400"> - Section {{ selectedSection }}</span>
            <span v-else class="text-gray-500 dark:text-gray-400"> (All Sections)</span>
          </p>
          <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">
            Showing {{ students.length }} student(s) | Date: {{ formatDate(selectedDate) }}
          </p>
        </div>
      </div>

      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div class="glass-card p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-800/20 border-l-4 border-green-500 dark:border-green-600">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400 font-medium">Present</p>
              <p class="text-3xl font-bold text-green-600 dark:text-green-400">{{ stats.present }}</p>
            </div>
            <div class="w-12 h-12 bg-green-500 dark:bg-green-600 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        <div class="glass-card p-4 bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-800/20 border-l-4 border-red-500 dark:border-red-600">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400 font-medium">Absent</p>
              <p class="text-3xl font-bold text-red-600 dark:text-red-400">{{ stats.absent }}</p>
            </div>
            <div class="w-12 h-12 bg-red-500 dark:bg-red-600 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        <div class="glass-card p-4 bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-800/20 border-l-4 border-yellow-500 dark:border-yellow-600">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400 font-medium">Late</p>
              <p class="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{{ stats.late }}</p>
            </div>
            <div class="w-12 h-12 bg-yellow-500 dark:bg-yellow-600 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        <div class="glass-card p-4 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-amber-800/20 border-l-4 border-amber-500 dark:border-amber-600">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400 font-medium">Total</p>
              <p class="text-3xl font-bold text-amber-700 dark:text-amber-400">{{ students.length }}</p>
            </div>
            <div class="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Students Attendance List -->
      <div class="glass-card overflow-hidden dark:bg-gray-800">
        <div class="p-6 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20">
          <h3 class="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <svg class="w-6 h-6 text-amber-600 dark:text-amber-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
            Mark Attendance
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Click on status buttons to mark attendance for each student</p>
        </div>

        <div v-if="loading" class="p-12 text-center">
          <svg class="animate-spin h-12 w-12 mx-auto text-amber-600 dark:text-amber-400 mb-4" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p class="text-gray-600 dark:text-gray-400 font-medium">Loading students...</p>
        </div>

        <div v-else-if="!selectedGrade" class="p-12 text-center">
          <svg class="w-24 h-24 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          <p class="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Select a grade to start</p>
          <p class="text-sm text-gray-600 dark:text-gray-400">Choose a grade level from the dropdown above to view students</p>
        </div>

        <div v-else-if="students.length === 0" class="p-12 text-center">
          <svg class="w-24 h-24 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <p class="text-lg font-semibold mb-2 text-gray-800 dark:text-white">No students found</p>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            No students found in Grade {{ selectedGrade }}
            <span v-if="selectedSection" class="text-amber-600 dark:text-amber-400"> - Section {{ selectedSection }}</span>
          </p>
        </div>

        <div v-else class="divide-y divide-gray-100 dark:divide-gray-700">
          <div v-for="(student, index) in students" :key="student.id" 
               class="p-4 hover:bg-amber-50 dark:hover:bg-gray-700 transition-colors"
               :class="{ 'bg-gray-50 dark:bg-gray-700': index % 2 === 0 }">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <div class="flex-shrink-0">
                  <div class="w-12 h-12 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                    {{ student.firstName[0] }}{{ student.lastName[0] }}
                  </div>
                </div>
                <div>
                  <p class="font-semibold text-gray-800 dark:text-white">{{ student.firstName }} {{ student.lastName }}</p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    Grade {{ student.gradeLevel }}
                    <span v-if="student.section" class="text-amber-600 dark:text-amber-400 font-medium"> - Section {{ student.section }}</span>
                  </p>
                </div>
              </div>

              <div class="flex gap-2">
                <button
                  @click="markAttendance(student.id, 'PRESENT')"
                  :class="[
                    'px-4 py-2 rounded-lg font-semibold transition-all transform hover:scale-105',
                    attendance[student.id] === 'PRESENT'
                      ? 'bg-green-500 text-white shadow-lg ring-2 ring-green-300'
                      : 'bg-gray-100 text-gray-600 hover:bg-green-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-green-900/20'
                  ]"
                >
                  ✓ Present
                </button>
                <button
                  @click="markAttendance(student.id, 'ABSENT')"
                  :class="[
                    'px-4 py-2 rounded-lg font-semibold transition-all transform hover:scale-105',
                    attendance[student.id] === 'ABSENT'
                      ? 'bg-red-500 text-white shadow-lg ring-2 ring-red-300'
                      : 'bg-gray-100 text-gray-600 hover:bg-red-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-red-900/20'
                  ]"
                >
                  ✗ Absent
                </button>
                <button
                  @click="markAttendance(student.id, 'LATE')"
                  :class="[
                    'px-4 py-2 rounded-lg font-semibold transition-all transform hover:scale-105',
                    attendance[student.id] === 'LATE'
                      ? 'bg-yellow-500 text-white shadow-lg ring-2 ring-yellow-300'
                      : 'bg-gray-100 text-gray-600 hover:bg-yellow-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-yellow-900/20'
                  ]"
                >
                  ⏰ Late
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { get, post } = useApi()

const selectedDate = ref(new Date().toISOString().split('T')[0])
const selectedGrade = ref('')
const selectedSection = ref('')
const students = ref<any[]>([])
const attendance = ref<Record<string, string>>({})
const loading = ref(false)
const saving = ref(false)

// Available sections (will be dynamic based on students in grade)
const availableSections = ref<string[]>([])

const stats = computed(() => {
  const present = Object.values(attendance.value).filter(s => s === 'PRESENT').length
  const absent = Object.values(attendance.value).filter(s => s === 'ABSENT').length
  const late = Object.values(attendance.value).filter(s => s === 'LATE').length
  return { present, absent, late }
})

const onGradeChange = async () => {
  selectedSection.value = '' // Reset section when grade changes
  await loadAvailableSections()
  await loadStudents()
}

const loadAvailableSections = async () => {
  if (!selectedGrade.value) {
    availableSections.value = []
    return
  }

  try {
    // Get all students in this grade to determine available sections
    const allStudents = (await get(`http://localhost:3001/api/students?grade=${selectedGrade.value}`)) as any[]
    
    // Extract unique sections
    const sections = new Set(allStudents.map((s: any) => s.section).filter(Boolean))
    availableSections.value = Array.from(sections).sort() as string[]
    
    // If no sections found, provide default A-G
    if (availableSections.value.length === 0) {
      availableSections.value = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
    }
  } catch (error) {
    console.error('Failed to load sections:', error)
    availableSections.value = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
  }
}

const loadStudents = async () => {
  if (!selectedGrade.value) {
    students.value = []
    return
  }
  
  loading.value = true
  try {
    // Build query with grade and section filters
    let url = `http://localhost:3001/api/students?grade=${selectedGrade.value}`
    
    if (selectedSection.value) {
      url += `&section=${selectedSection.value}`
    }
    
    students.value = await get(url)
    
    // Initialize attendance as PRESENT for all students
    attendance.value = {}
    students.value.forEach(student => {
      attendance.value[student.id] = 'PRESENT'
    })
    
    // Save filter context in localStorage
    localStorage.setItem('attendance_filter', JSON.stringify({
      grade: selectedGrade.value,
      section: selectedSection.value
    }))
  } catch (error) {
    console. error('Failed to load students:', error)
    students.value = []
  } finally {
    loading.value = false
  }
}

const markAttendance = (studentId: string, status: string) => {
  attendance.value[studentId] = status
}

const saveAttendance = async () => {
  if (!selectedGrade.value) {
    alert('⚠️ Please select a grade first')
    return
  }

  if (students.value.length === 0) {
    alert('⚠️ No students to save attendance for')
    return
  }

  saving.value = true
  try {
    const records = Object.keys(attendance.value).map(studentId => ({
      studentId,
      status: attendance.value[studentId],
      date: selectedDate.value
    }))

    await post('http://localhost:3001/api/attendance', records)
    
    alert(`✅ Attendance saved successfully for ${records.length} students!`)
  } catch (error: any) {
    console.error('Save failed:', error)
    alert('❌ ' + (error.response?._data?.message || 'Failed to save attendance'))
  } finally {
    saving.value = false
  }
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}

// Restore previous filter selection on mount
onMounted(() => {
  const saved = localStorage.getItem('attendance_filter')
  if (saved) {
    try {
      const filter = JSON.parse(saved)
      selectedGrade.value = filter.grade || ''
      selectedSection.value = filter.section || ''
      
      if (selectedGrade.value) {
        loadAvailableSections()
        loadStudents()
      }
    } catch (e) {
      console.error('Failed to restore filter:', e)
    }
  }
})
</script>