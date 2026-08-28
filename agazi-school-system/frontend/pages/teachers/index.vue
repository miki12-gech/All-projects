<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <!-- Navigation -->
    <nav class="glass-card sticky top-0 z-40 border-b border-gray-100 dark:border-gray-700 shadow-lg">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <h1 class="text-2xl font-bold text-amber-600 dark:text-amber-400">👨‍🏫 Teachers</h1>
          </div>
          <div class="flex items-center space-x-4">
            <ThemeToggle />
            <NuxtLink to="/dashboard" class="px-4 py-2 text-gray-600 hover:text-amber-600 font-semibold transition-all flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Dashboard
            </NuxtLink>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white">Teacher Management</h2>
          <p class="text-gray-600 dark:text-gray-400 mt-2">Register and manage teaching staff</p>
        </div>
        <div class="mt-4 md:mt-0">
          <button
            @click="openModal"
            class="btn-primary"
          >
            ➕ Add Teacher
          </button>
        </div>
      </div>

      <!-- Filters -->
      <div class="glass-card p-6 mb-8 dark:bg-gray-800">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Search by Name</label>
            <input
              v-model="filters.search"
              type="text"
              placeholder="Search teachers..."
              class="input-field"
              @input="fetchTeachers"
            />
          </div>
          <div>
            <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Specialization</label>
            <select v-model="filters.specialization" class="input-field" @change="fetchTeachers">
              <option value="">All Specializations</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Biology">Biology</option>
              <option value="English">English</option>
              <option value="History">History</option>
              <option value="Geography">Geography</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
        <p class="mt-4 text-gray-600 dark:text-gray-400">Loading teachers...</p>
      </div>

      <!-- Teachers List -->
      <div v-else-if="teachers.length > 0" class="glass-card overflow-hidden dark:bg-gray-800">
        <div class="overflow-x-auto">
          <table class="data-table w-full">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Specialization</th>
                <th>Subjects</th>
                <th>Grades</th>
                <th>Sections</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
              <tr v-for="teacher in teachers" :key="teacher.id" 
               class="hover:bg-amber-50 dark:hover:bg-gray-700 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="w-10 h-10 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                      {{ teacher.firstName?.charAt(0) }}{{ teacher.lastName?.charAt(0) }}
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900 dark:text-white">{{ teacher.firstName }} {{ teacher.lastName }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {{ teacher.email }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {{ teacher.phoneNumber }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                    {{ teacher.specialization || 'Not specified' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div v-if="teacher.subjects && teacher.subjects.length > 0" class="flex flex-wrap gap-1">
                    <span v-for="subject in teacher.subjects" :key="subject" 
                          class="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs rounded-full">
                      {{ getSubjectName(subject) }}
                    </span>
                  </div>
                  <span v-else class="text-gray-400 text-xs">No subjects</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div v-if="teacher.grades && teacher.grades.length > 0" class="flex flex-wrap gap-1">
                    <span v-for="grade in teacher.grades" :key="grade" 
                          class="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full">
                      Grade {{ grade }}
                    </span>
                  </div>
                  <span v-else class="text-gray-400 text-xs">No grades</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div v-if="teacher.sections && teacher.sections.length > 0" class="flex flex-wrap gap-1">
                    <span v-for="section in teacher.sections" :key="section" 
                          class="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                      Section {{ section }}
                    </span>
                  </div>
                  <span v-else class="text-gray-400 text-xs">No sections</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    @click="editTeacher(teacher)"
                    class="text-amber-600 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-300 mr-3"
                  >
                    Edit
                  </button>
                  <button
                    @click="deleteTeacher(teacher.id)"
                    class="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="glass-card p-12 text-center dark:bg-gray-800">
        <div class="text-gray-400">
          <svg class="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0110-7h2a6 6 0 0110 7v1m0 0h6a2 2 0 002-2v-1a6 6 0 00-10-7H6a6 6 0 00-10 7v1a2 2 0 002 2h6a2 2 0 002-2v-1a6 6 0 00-10-7H6a6 6 0 00-10 7v1a2 2 0 002 2h6z" />
          </svg>
          <p class="text-xl font-semibold mb-2">No teachers found</p>
          <p class="text-sm">Get started by adding your first teacher</p>
        </div>
      </div>
    </div>

    <!-- Teacher Registration/Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all">
        <div class="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-xl font-bold text-gray-900 dark:text-white">
            {{ isEditing ? 'Edit Teacher' : 'Register New Teacher' }}
          </h3>
        </div>

        <form @submit.prevent="submitForm" class="p-6 space-y-6">
          <!-- Personal Information -->
          <div>
            <h4 class="text-lg font-bold text-gray-800 dark:text-white mb-4 border-b pb-2">Personal Information</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">First Name *</label>
                <input
                  v-model="form.firstName"
                  type="text"
                  required
                  class="input-field"
                  placeholder="Enter first name"
                />
              </div>
              <div>
                <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Last Name *</label>
                <input
                  v-model="form.lastName"
                  type="text"
                  required
                  class="input-field"
                  placeholder="Enter last name"
                />
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
                <input
                  v-model="form.phoneNumber"
                  type="tel"
                  class="input-field"
                  placeholder="+251 9X XXX XXX"
                />
              </div>
              <div>
                <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Specialization</label>
                <select v-model="form.specialization" class="input-field">
                  <option value="">Select Specialization</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Biology">Biology</option>
                  <option value="English">English</option>
                  <option value="History">History</option>
                  <option value="Geography">Geography</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Subject Assignments -->
          <div>
            <h4 class="text-lg font-bold text-gray-800 dark:text-white mb-4 border-b pb-2">Subject Assignments</h4>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">Select the subjects, grades, and sections this teacher will be assigned to.</p>
            
            <!-- Subjects -->
            <div class="mb-6">
              <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Subjects *</label>
              <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div v-for="subject in availableSubjects" :key="subject.id">
                  <label class="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded">
                    <input
                      type="checkbox"
                      :value="subject.id"
                      v-model="form.subjects"
                      class="rounded text-amber-600 focus:ring-amber-500"
                    />
                    <span class="text-sm text-gray-700 dark:text-gray-300">{{ subject.name }} ({{ subject.code }})</span>
                  </label>
                </div>
              </div>
            </div>

            <!-- Grades -->
            <div class="mb-6">
              <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Grade Levels *</label>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div v-for="grade in [9, 10, 11, 12]" :key="grade">
                  <label class="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded">
                    <input
                      type="checkbox"
                      :value="grade"
                      v-model="form.grades"
                      class="rounded text-amber-600 focus:ring-amber-500"
                    />
                    <span class="text-sm text-gray-700 dark:text-gray-300">Grade {{ grade }}</span>
                  </label>
                </div>
              </div>
            </div>

            <!-- Sections -->
            <div class="mb-6">
              <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Sections *</label>
              <div class="grid grid-cols-3 md:grid-cols-6 gap-3">
                <div v-for="section in ['A', 'B', 'C', 'D', 'E', 'F', 'G']" :key="section">
                  <label class="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded">
                    <input
                      type="checkbox"
                      :value="section"
                      v-model="form.sections"
                      class="rounded text-amber-600 focus:ring-amber-500"
                    />
                    <span class="text-sm text-gray-700 dark:text-gray-300">Section {{ section }}</span>
                  </label>
                </div>
              </div>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Select all sections this teacher will teach</p>
            </div>
          </div>

          <!-- Email Display -->
          <div v-if="isEditing" class="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p class="text-sm text-blue-800 dark:text-blue-200">
              <strong>📧 Email:</strong> {{ form.email }}
            </p>
          </div>
          <div v-else class="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p class="text-sm text-blue-800 dark:text-blue-200">
              <strong>📧 Email:</strong> Will be auto-generated as firstname.lastname@agazi.edu
            </p>
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
              {{ isEditing ? 'Update Teacher' : 'Register Teacher' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// State
const teachers = ref<any[]>([])
const loading = ref(true)
const submitting = ref(false)
const showModal = ref(false)
const isEditing = ref(false)
const editId = ref<string | null>(null)

// Filters
const filters = ref({
  search: '',
  specialization: ''
})

// Available subjects (would come from API)
const availableSubjects = ref([
  { id: '1', name: 'Mathematics', code: 'MATH' },
  { id: '2', name: 'Physics', code: 'PHY' },
  { id: '3', name: 'Chemistry', code: 'CHEM' },
  { id: '4', name: 'Biology', code: 'BIO' },
  { id: '5', name: 'English', code: 'ENG' },
  { id: '6', name: 'History', code: 'HIST' },
  { id: '7', name: 'Geography', code: 'GEOG' }
])

// Form data
const form = ref({
  firstName: '',
  lastName: '',
  phoneNumber: '',
  specialization: '',
  email: '',
  subjects: [], // Array of subject IDs
  grades: [], // Array of grade levels
  sections: [] // Array of sections
})

// Composables
const { get, post, patch, del } = useApi()

// Helper function to get subject name by ID
const getSubjectName = (subjectId: string) => {
  const subject = availableSubjects.value.find(s => s.id === subjectId)
  return subject ? subject.name : 'Unknown'
}

// Handlers
const fetchTeachers = async () => {
  loading.value = true
  try {
    const response = await get('http://localhost:3001/api/teachers')
    teachers.value = response.map((teacher: any) => ({
      ...teacher,
      // Extract subjects, grades, and sections from assignments
      subjects: teacher.subjectAssignments?.map((assignment: any) => assignment.subject) || [],
      grades: teacher.subjectAssignments?.map((assignment: any) => assignment.gradeLevel) || [],
      sections: teacher.subjectAssignments?.map((assignment: any) => assignment.section) || []
    }))
  } catch (err) {
    console.error('Failed to fetch teachers', err)
    teachers.value = []
  } finally {
    loading.value = false
  }
}

const openModal = () => {
  isEditing.value = false
  editId.value = null
  form.value = {
    firstName: '',
    lastName: '',
    phoneNumber: '',
    specialization: '',
    email: '',
    subjects: [], // Array of subject IDs
    grades: [], // Array of grade levels
    sections: [] // Array of sections
  }
  showModal.value = true
}

const editTeacher = (teacher: any) => {
  isEditing.value = true
  editId.value = teacher.id
  form.value = {
    firstName: teacher.firstName,
    lastName: teacher.lastName,
    phoneNumber: teacher.phoneNumber || '',
    specialization: teacher.specialization || '',
    email: teacher.user?.email || '',
    subjects: teacher.subjectAssignments?.map((assignment: any) => assignment.subjectId) || [], // Extract subject IDs
    grades: teacher.subjectAssignments?.map((assignment: any) => assignment.gradeLevel) || [],
    sections: teacher.subjectAssignments?.map((assignment: any) => assignment.section) || []
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  isEditing.value = false
  editId.value = null
}

const submitForm = async () => {
  submitting.value = true
  try {
    if (isEditing.value && editId.value) {
      await patch(`http://localhost:3001/api/teachers/${editId.value}`, {
        firstName: form.value.firstName,
        lastName: form.value.lastName,
        phoneNumber: form.value.phoneNumber,
        specialization: form.value.specialization
      })
    } else {
      await post('http://localhost:3001/api/teachers', form.value)
    }
    
    closeModal()
    fetchTeachers()
  } catch (err: any) {
    console.error(err)
    alert('Operation failed: ' + (err.response?._data?.message || err.message))
  } finally {
    submitting.value = false
  }
}

const deleteTeacher = async (id: string) => {
  if (!confirm('Are you sure you want to delete this teacher?')) return
  
  try {
    await del(`http://localhost:3001/api/teachers/${id}`)
    fetchTeachers()
  } catch (err: any) {
    console.error(err)
    alert('Failed to delete teacher: ' + (err.response?._data?.message || err.message))
  }
}

const logout = () => {
  localStorage.removeItem('agazi_token')
  window.location.href = '/login'
}

onMounted(() => {
  fetchTeachers()
})
</script>
