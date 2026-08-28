<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Top Navigation -->
    <nav class="glass-card sticky top-0 z-40 border-b border-gray-100 shadow-lg">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center gap-4">
            <NuxtLink to="/dashboard" class="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
              <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
            </NuxtLink>
            <div>
              <h1 class="text-xl font-bold text-gray-800">Grade Entry</h1>
              <p class="text-xs text-gray-500">Record and manage student assessments</p>
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
      <!-- Filters (Context Selection) -->
      <div class="glass-card p-6 mb-6">
        <h2 class="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <svg class="w-6 h-6 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clip-rule="evenodd" />
          </svg>
          Select Class & Subject
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <!-- Grade -->
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">Grade Level *</label>
            <select v-model="selection.grade" @change="onGradeChange" class="input-field">
              <option value="">Select Grade</option>
              <option value="9">Grade 9</option>
              <option value="10">Grade 10</option>
              <option value="11">Grade 11</option>
              <option value="12">Grade 12</option>
            </select>
          </div>

          <!-- Section -->
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">Section *</label>
            <select 
              v-model="selection.section" 
              :disabled="!selection.grade"
              class="input-field"
              :class="{ 'opacity-50': !selection.grade }"
            >
              <option value="">Select Section</option>
              <option v-for="sec in availableSections" :key="sec" :value="sec">Section {{ sec }}</option>
            </select>
          </div>

          <!-- Subject -->
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">Subject *</label>
            <select 
              v-model="selection.subjectId"
              :disabled="!selection.grade"
              class="input-field"
            >
               <option value="">Select Subject</option>
               <option v-for="sub in subjects" :key="sub.id" :value="sub.id">{{ sub.name }} ({{ sub.code }})</option>
            </select>
          </div>

          <!-- Term -->
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">Term *</label>
            <select v-model="selection.term" class="input-field">
              <option value="1">Term 1</option>
              <option value="2">Term 2</option>
            </select>
          </div>
        </div>

        <div class="mt-4 flex justify-end">
          <button 
            @click="loadClassData"
            :disabled="!isValidSelection"
            class="btn-primary w-full md:w-auto flex items-center justify-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Load Students
          </button>
        </div>
      </div>

      <!-- Grading Table -->
      <div v-if="loaded" class="glass-card overflow-hidden">
        <div class="p-4 bg-amber-50 border-b border-amber-100 flex justify-between items-center">
          <div>
             <h3 class="font-bold text-gray-800">Grade {{ selection.grade }}{{ selection.section }} - {{ getSubjectName(selection.subjectId) }}</h3>
             <p class="text-xs text-gray-500">Academic Year: 2025/2026</p>
          </div>
          <button 
            @click="saveGrades" 
            :disabled="saving"
            class="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-bold shadow-lg transition-all flex items-center gap-2"
          >
            <svg v-if="saving" class="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ saving ? 'Saving...' : '💾 Save All Grades' }}
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="bg-gray-50 text-gray-600 text-sm border-b">
                <th class="px-4 py-3 text-left w-64 sticky left-0 bg-gray-50 z-10">Student Name</th>
                <th class="px-2 py-3 text-center">Final (50%)</th>
                <th class="px-2 py-3 text-center">Mid (30%)</th>
                <th class="px-2 py-3 text-center">Quiz (10%)</th>
                <th class="px-2 py-3 text-center">Activity (10%)</th>
                <th class="px-4 py-3 text-center font-bold text-gray-800">Total (100%)</th>
                <th class="px-4 py-3 text-center">Grade</th>
                <th class="px-4 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="student in students" :key="student.id" class="hover:bg-amber-50">
                <td class="px-4 py-3 sticky left-0 bg-white z-10 font-medium text-gray-800 border-r">
                   {{ student.name }}
                </td>
                <td class="px-2 py-3">
                  <input 
                    type="number" 
                    v-model.number="student.finalExam"
                    min="0" max="50"
                    class="w-full px-2 py-1 border rounded text-center focus:ring-2 focus:ring-amber-300 outline-none" 
                    placeholder="0-50"
                  />
                </td>
                <td class="px-2 py-3">
                  <input 
                    type="number" 
                    v-model.number="student.midExam"
                    min="0" max="30"
                    class="w-full px-2 py-1 border rounded text-center focus:ring-2 focus:ring-amber-300 outline-none"
                    placeholder="0-30" 
                  />
                </td>
                <td class="px-2 py-3">
                  <input 
                    type="number" 
                    v-model.number="student.quiz"
                    min="0" max="10"
                    class="w-full px-2 py-1 border rounded text-center focus:ring-2 focus:ring-amber-300 outline-none"
                    placeholder="0-10" 
                  />
                </td>
                <td class="px-2 py-3">
                  <input 
                    type="number" 
                    v-model.number="student.classActivity"
                    min="0" max="10"
                    class="w-full px-2 py-1 border rounded text-center focus:ring-2 focus:ring-amber-300 outline-none"
                    placeholder="0-10" 
                  />
                </td>
                
                <!-- Calculated Result -->
                <td class="px-4 py-3 text-center font-bold text-lg text-gray-800">
                  {{ calculateTotal(student) }}
                </td>
                <td class="px-4 py-3 text-center">
                  <span 
                    class="px-3 py-1 rounded-full font-bold text-sm"
                    :class="getGradeColor(calculateTotal(student))"
                  >
                    {{ calculateLetter(calculateTotal(student)) }}
                  </span>
                </td>
                <td class="px-4 py-3 text-center">
                   <span 
                     class="text-xs font-bold uppercase"
                     :class="calculateTotal(student) >= 50 ? 'text-green-600' : 'text-red-600'"
                   >
                     {{ calculateTotal(student) >= 50 ? 'PASS' : 'FAIL' }}
                   </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div v-if="students.length === 0" class="p-12 text-center text-gray-500">
          No students found in this class.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { get, post } = useApi()

const students = ref<any[]>([])
const subjects = ref<any[]>([])
const availableSections = ref<string[]>(['A', 'B', 'C', 'D', 'E', 'F', 'G'])
const loaded = ref(false)
const saving = ref(false)

const selection = ref({
  grade: '',
  section: '',
  subjectId: '',
  term: '1'
})

const isValidSelection = computed(() => {
  return selection.value.grade && selection.value.section && selection.value.subjectId
})

const onGradeChange = async () => {
  // Load subjects for this grade
  if (selection.value.grade) {
    try {
      subjects.value = await get(`http://localhost:3001/api/subjects?grade=${selection.value.grade}`)
    } catch (e) {
      console.error(e)
    }
  }
}

const getSubjectName = (id: string) => {
  const s = subjects.value.find(sub => sub.id === id)
  return s ? s.name : ''
}

// Load class list and existing grades
const loadClassData = async () => {
  if (!isValidSelection.value) return
  loaded.value = true // Show table immediately
  
  try {
    const data = (await get(`http://localhost:3001/api/grade/class?gradeLevel=${selection.value.grade}&section=${selection.value.section}&subjectId=${selection.value.subjectId}&term=${selection.value.term}&academicYear=2025/2026`)) as any[]
    
    // Transform data for UI
    students.value = data.map((item: any) => ({
      id: item.id, // Student ID
      name: item.name,
      // If grade exists, use it, else default 0
      finalExam: item.grade?.finalExam || 0,
      midExam: item.grade?.midExam || 0,
      quiz: item.grade?.quiz || 0,
      classActivity: item.grade?.classActivity || 0
    }))
  } catch (err) {
    console.error('Failed to load grades', err)
    students.value = []
  }
}

// Frontend Calculation Logic (Matches Backend)
const calculateTotal = (student: any) => {
  return (student.finalExam || 0) + 
         (student.midExam || 0) + 
         (student.quiz || 0) + 
         (student.classActivity || 0)
}

const calculateLetter = (score: number) => {
    if (score >= 90) return 'A+';
    if (score >= 85) return 'A';
    if (score >= 80) return 'A-';
    if (score >= 75) return 'B+';
    if (score >= 70) return 'B';
    if (score >= 65) return 'B-';
    if (score >= 60) return 'C+';
    if (score >= 55) return 'C';
    if (score >= 50) return 'C-';
    if (score >= 45) return 'D';
    return 'F';
}

const getGradeColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    if (score >= 50) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
}

const saveGrades = async () => {
    saving.value = true
    try {
        const payload = {
            records: students.value.map(s => ({
                studentId: s.id,
                subjectId: selection.value.subjectId,
                finalExam: s.finalExam,
                midExam: s.midExam,
                quiz: s.quiz,
                classActivity: s.classActivity,
                term: Number(selection.value.term),
                academicYear: '2025/2026'
            }))
        }
        
        await post('http://localhost:3001/api/grade/mark', payload)
        alert('Grades saved successfully! 🎉')
    } catch (err: any) {
        console.error(err)
        alert('Failed to save grades. ' + (err.response?._data?.message || err.message))
    } finally {
        saving.value = false
    }
}
</script>