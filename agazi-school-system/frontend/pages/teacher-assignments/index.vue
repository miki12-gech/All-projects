<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <!-- Navigation -->
    <nav class="glass-card sticky top-0 z-40 border-b border-gray-100 dark:border-gray-700 shadow-lg">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center gap-4">
            <NuxtLink to="/dashboard" class="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
              <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
            </NuxtLink>
            <div>
              <h1 class="text-xl font-bold text-gray-800 dark:text-white">📚 Teacher Assignments</h1>
              <p class="text-xs text-gray-500 dark:text-gray-400">Manage teacher-subject assignments</p>
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

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header with Actions -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white">Teacher Subject Assignments</h2>
          <p class="text-gray-600 dark:text-gray-400 mt-2">Assign teachers to specific subjects, grades, and sections</p>
        </div>
        <div class="mt-4 md:mt-0">
          <button
            @click="openModal"
            class="btn-primary"
          >
            ➕ Create Assignment
          </button>
        </div>
      </div>

      <!-- Filters -->
      <div class="glass-card p-6 mb-8 dark:bg-gray-800">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Filter by Grade</label>
            <select v-model="filters.grade" @change="fetchAssignments" class="input-field">
              <option value="">All Grades</option>
              <option value="9">Grade 9</option>
              <option value="10">Grade 10</option>
              <option value="11">Grade 11</option>
              <option value="12">Grade 12</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Filter by Section</label>
            <select v-model="filters.section" @change="fetchAssignments" class="input-field">
              <option value="">All Sections</option>
              <option v-for="section in ['A', 'B', 'C', 'D', 'E', 'F', 'G']" :key="section" :value="section">
                Section {{ section }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Filter by Subject</label>
            <select v-model="filters.subject" @change="fetchAssignments" class="input-field">
              <option value="">All Subjects</option>
              <option v-for="subject in availableSubjects" :key="subject.id" :value="subject.id">
                {{ subject.name }} ({{ subject.code }})
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Assignments List -->
      <div class="glass-card overflow-hidden dark:bg-gray-800">
        <div v-if="loading" class="p-12 text-center">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
          <p class="text-gray-600 dark:text-gray-400 font-medium">Loading assignments...</p>
        </div>

        <div v-else-if="!assignments.length" class="p-12 text-center">
          <svg class="w-24 h-24 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <p class="text-lg font-semibold mb-2 text-gray-800 dark:text-white">No assignments found</p>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            {{ filters.grade || filters.section || filters.subject ? 'Try adjusting your filters' : 'Create your first assignment' }}
          </p>
        </div>

        <div v-else class="divide-y divide-gray-100 dark:divide-gray-700">
          <div class="p-6 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20">
            <h3 class="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <svg class="w-6 h-6 text-amber-600 dark:text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
              All Assignments
            </h3>
          </div>

          <div v-for="assignment in assignments" :key="assignment.id" 
               class="p-4 hover:bg-amber-50 dark:hover:bg-gray-700 transition-colors">
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                    {{ assignment.teacher.firstName[0] }}{{ assignment.teacher.lastName[0] }}
                  </div>
                  <div>
                    <p class="font-semibold text-gray-800 dark:text-white">
                      {{ assignment.teacher.firstName }} {{ assignment.teacher.lastName }}
                    </p>
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                      {{ assignment.teacher.user?.email }}
                    </p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    Grade {{ assignment.gradeLevel }} - Section {{ assignment.section }}
                  </p>
                  <p class="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                    {{ assignment.subject.name }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    {{ assignment.subject.code }}
                  </p>
                </div>
              </div>
              <div class="flex gap-2">
                <button
                  @click="editAssignment(assignment)"
                  class="px-4 py-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 font-medium transition-colors"
                >
                  Edit
                </button>
                <button
                  @click="deleteAssignment(assignment.id)"
                  class="px-4 py-2 text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 font-medium transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Assignment Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all">
        <div class="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-xl font-bold text-gray-900 dark:text-white">
            {{ isEditing ? 'Edit Assignment' : 'Create New Assignment' }}
          </h3>
        </div>

        <form @submit.prevent="submitForm" class="p-6 space-y-6">
          <!-- Teacher Selection -->
          <div>
            <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Select Teacher *</label>
            <select v-model="form.teacherId" class="input-field" required>
              <option value="">Choose Teacher</option>
              <option v-for="teacher in availableTeachers" :key="teacher.id" :value="teacher.id">
                {{ teacher.firstName }} {{ teacher.lastName }} ({{ teacher.user?.email }})
              </option>
            </select>
          </div>

          <!-- Subject Selection -->
          <div>
            <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Select Subject *</label>
            <select v-model="form.subjectId" class="input-field" required>
              <option value="">Choose Subject</option>
              <option v-for="subject in availableSubjects" :key="subject.id" :value="subject.id">
                {{ subject.name }} ({{ subject.code }})
              </option>
            </select>
          </div>

          <!-- Grade and Section -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Grade Level *</label>
              <select v-model.number="form.gradeLevel" class="input-field" required>
                <option value="">Choose Grade</option>
                <option value="9">Grade 9</option>
                <option value="10">Grade 10</option>
                <option value="11">Grade 11</option>
                <option value="12">Grade 12</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Section *</label>
              <select v-model="form.section" class="input-field" required>
                <option value="">Choose Section</option>
                <option v-for="section in ['A', 'B', 'C', 'D', 'E', 'F', 'G']" :key="section" :value="section">
                  Section {{ section }}
                </option>
              </select>
            </div>
          </div>

          <!-- Form Actions -->
          <div class="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              @click="closeModal"
              class="px-6 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="submitting"
              class="btn-primary"
            >
              <span v-if="submitting" class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
              {{ isEditing ? 'Update Assignment' : 'Create Assignment' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// State
const assignments = ref<any[]>([])
const availableSubjects = ref<any[]>([])
const availableTeachers = ref<any[]>([])
const loading = ref(true)
const submitting = ref(false)
const showModal = ref(false)
const isEditing = ref(false)
const editId = ref<string | null>(null)

// Filters
const filters = ref({
  grade: '',
  section: '',
  subject: ''
})

// Form Data
const form = ref({
  teacherId: '',
  subjectId: '',
  gradeLevel: 9,
  section: 'A'
})

// Composables
const { get, post, patch, del } = useApi()

// Handlers
const fetchAssignments = async () => {
  loading.value = true
  try {
    const params = new URLSearchParams()
    if (filters.value.grade) params.append('grade', filters.value.grade)
    if (filters.value.section) params.append('section', filters.value.section)
    if (filters.value.subject) params.append('subject', filters.value.subject)
    
    const query = params.toString() ? `?${params.toString()}` : ''
    const response = await get(`http://localhost:3001/api/teacher-subject-assignments${query}`)
    assignments.value = response || []
  } catch (err) {
    console.error('Failed to fetch assignments', err)
    assignments.value = []
  } finally {
    loading.value = false
  }
}

const fetchAvailableData = async () => {
  try {
    const [subjectsResponse, teachersResponse] = await Promise.all([
      get('http://localhost:3001/api/teacher-subject-assignments/available-subjects'),
      get('http://localhost:3001/api/teacher-subject-assignments/available-teachers')
    ])
    
    availableSubjects.value = subjectsResponse || []
    availableTeachers.value = teachersResponse || []
  } catch (err) {
    console.error('Failed to fetch available data', err)
  }
}

const openModal = () => {
  isEditing.value = false
  editId.value = null
  form.value = {
    teacherId: '',
    subjectId: '',
    gradeLevel: 9,
    section: 'A'
  }
  showModal.value = true
}

const editAssignment = (assignment: any) => {
  isEditing.value = true
  editId.value = assignment.id
  form.value = {
    teacherId: assignment.teacherId,
    subjectId: assignment.subjectId,
    gradeLevel: assignment.gradeLevel,
    section: assignment.section
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const deleteAssignment = async (id: string) => {
  if (!confirm('Are you sure you want to delete this assignment? This action cannot be undone.')) return;
  
  try {
    await del(`http://localhost:3001/api/teacher-subject-assignments/${id}`)
    assignments.value = assignments.value.filter(a => a.id !== id)
    alert('Assignment deleted successfully')
  } catch (err: any) {
    alert('Failed to delete: ' + (err.response?._data?.message || err.message))
  }
}

const submitForm = async () => {
  submitting.value = true
  try {
    const payload: any = { ...form.value }
    
    if (isEditing.value && editId.value) {
      await patch(`http://localhost:3001/api/teacher-subject-assignments/${editId.value}`, payload)
      alert('Assignment updated successfully!')
    } else {
      await post('http://localhost:3001/api/teacher-subject-assignments', payload)
      alert('Assignment created successfully!')
    }
    
    closeModal()
    fetchAssignments()
  } catch (err: any) {
    console.error(err)
    alert('Operation failed: ' + (err.response?._data?.message || err.message))
  } finally {
    submitting.value = false
  }
}

const logout = () => {
  localStorage.removeItem('agazi_token')
  window.location.href = '/login'
}

onMounted(() => {
  fetchAssignments()
  fetchAvailableData()
})
</script>
