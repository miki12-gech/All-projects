<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <!-- Top Navigation Bar -->
    <nav class="glass-card sticky top-0 z-40 border-b border-gray-100 dark:border-gray-700 shadow-lg">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center gap-4">
            <NuxtLink to="/dashboard" class="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
              <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
            </NuxtLink>
            <div>
              <h1 class="text-xl font-bold text-gray-800 dark:text-white">Student Management</h1>
              <p class="text-xs text-gray-500 dark:text-gray-400">Register, update and manage students</p>
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
      <!-- Actions & Filters -->
      <div class="glass-card p-6 mb-6 dark:bg-gray-800">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h2 class="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <svg class="w-6 h-6 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clip-rule="evenodd" />
            </svg>
            Filters
          </h2>
          <button @click="openModal" class="btn-primary flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Register Student
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Grade Filter -->
          <div>
            <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Grade Level</label>
            <select v-model="filters.grade" @change="onGradeChange" class="input-field">
              <option value="">All Grades</option>
              <option value="9">Grade 9</option>
              <option value="10">Grade 10</option>
              <option value="11">Grade 11</option>
              <option value="12">Grade 12</option>
            </select>
          </div>

          <!-- Section Filter (Cascades from Grade) -->
          <div>
            <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Section</label>
            <select 
              v-model="filters.section" 
              @change="fetchStudents"
              :disabled="!filters.grade"
              class="input-field"
              :class="{ 'opacity-50 cursor-not-allowed': !filters.grade }"
            >
              <option value="">All Sections</option>
              <option v-for="sec in availableSections" :key="sec" :value="sec">Section {{ sec }}</option>
            </select>
          </div>

          <!-- Stream Filter -->
          <div>
            <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Stream</label>
            <select v-model="filters.stream" @change="fetchStudents" class="input-field">
              <option value="">All Streams</option>
              <option value="NATURAL">Natural Science</option>
              <option value="SOCIAL">Social Science</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Students List -->
      <div class="glass-card overflow-hidden dark:bg-gray-800">
        <div v-if="loading" class="p-12 text-center">
          <svg class="animate-spin h-12 w-12 mx-auto text-amber-600 mb-4" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p class="text-gray-600 dark:text-gray-300">Loading students...</p>
        </div>

        <div v-else-if="students.length === 0" class="p-12 text-center text-gray-400 dark:text-gray-500">
           <svg class="w-24 h-24 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
           </svg>
           <p class="text-lg font-semibold dark:text-white">No students found</p>
           <p class="dark:text-gray-400">Try adjusting your filters or add a new student.</p>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="data-table w-full">
            <thead>
              <tr>
                <th class="px-6 py-4">Student Name</th>
                <th class="px-6 py-4">ID / Email</th>
                <th class="px-6 py-4">Grade & Section</th>
                <th class="px-6 py-4">Phone</th>
                <th class="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
              <tr v-for="student in students" :key="student.id" class="hover:bg-amber-50 dark:hover:bg-gray-700 transition-colors">
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold">
                      {{ student.firstName[0] }}{{ student.lastName[0] }}
                    </div>
                    <div>
                      <p class="font-semibold text-gray-800 dark:text-white">{{ student.firstName }} {{ student.lastName }}</p>
                      <p class="text-xs text-gray-500 dark:text-gray-400">Gender: {{ student.gender || 'N/A' }}</p>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm">
                    <p class="text-gray-800 dark:text-white font-medium">{{ student.user?.email || 'N/A' }}</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">ID: {{ student.id.substring(0, 8) }}...</p>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <span class="px-3 py-1 bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 rounded-full text-sm font-semibold">
                    Grade {{ student.gradeLevel }} - {{ student.section || 'N/A' }}
                  </span>
                  <p v-if="student.stream" class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ student.stream }} Science</p>
                </td>
                <td class="px-6 py-4 text-gray-600 dark:text-gray-300">
                  {{ student.phoneNumber || 'N/A' }}
                </td>
                <td class="px-6 py-4">
                  <div class="flex gap-2">
                    <button @click="editStudent(student)" class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button @click="deleteStudent(student.id)" class="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Registration/Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto transform transition-all">
        <div class="p-6 bg-gradient-to-r from-amber-500 to-yellow-600 text-white flex justify-between items-center sticky top-0 z-10">
          <h3 class="text-2xl font-bold">{{ isEditing ? 'Edit Student' : 'Register New Student' }}</h3>
          <button @click="closeModal" class="text-white hover:text-gray-200">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="submitForm" class="p-6 space-y-6">
          <!-- Personal Info -->
          <div>
            <h4 class="text-lg font-bold text-gray-800 dark:text-white mb-4 border-b pb-2">Personal Information</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">First Name *</label>
                <input v-model="form.firstName" type="text" class="input-field" required />
              </div>
              <div>
                <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Last Name *</label>
                <input v-model="form.lastName" type="text" class="input-field" required />
              </div>
              <div v-if="isEditing">
                <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Email (Read-only)</label>
                <input :value="form.email" type="email" class="input-field bg-gray-100" disabled />
              </div>
              <div v-else class="md:col-span-2">
                <div class="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <p class="text-sm text-blue-800 dark:text-blue-200">
                    <strong>📧 Email:</strong> Will be auto-generated as firstname.lastname@agazi.edu
                  </p>
                </div>
              </div>
              <div>
                <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Date of Birth *</label>
                <input v-model="form.dateOfBirth" type="date" class="input-field" required />
              </div>
              <div>
                <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Gender *</label>
                <select v-model="form.gender" class="input-field" required>
                  <option value="">Select Gender</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Phone Number (10 digits) *</label>
                <input v-model="form.phoneNumber" type="tel" placeholder="0911000000" pattern="0[0-9]{9}" class="input-field" required />
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Must start with 0 and be 10 digits.</p>
              </div>
              <div>
                <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Address</label>
                <input v-model="form.address" type="text" class="input-field" />
              </div>
            </div>
          </div>

          <!-- Academic Info -->
          <div>
            <h4 class="text-lg font-bold text-gray-800 dark:text-white mb-4 border-b pb-2">Academic Information</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Grade Level *</label>
                <select v-model.number="form.gradeLevel" class="input-field" required>
                  <option value="9">Grade 9</option>
                  <option value="10">Grade 10</option>
                  <option value="11">Grade 11</option>
                  <option value="12">Grade 12</option>
                </select>
              </div>
              <div v-if="form.gradeLevel >= 11">
                <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Stream *</label>
                <select v-model="form.stream" class="input-field" required>
                  <option value="NATURAL">Natural Science</option>
                  <option value="SOCIAL">Social Science</option>
                </select>
              </div>
              <!-- Section is auto-assigned by system -->
              <div class="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p class="text-sm text-blue-800 dark:text-blue-200">
                  <strong>📋 Section:</strong> Will be auto-assigned based on class capacity
                </p>
              </div>
            </div>
          </div>

          <!-- Family Info -->
          <div>
            <h4 class="text-lg font-bold text-gray-800 dark:text-white mb-4 border-b pb-2">Family & Emergency Contact</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Father's Name</label>
                <input v-model="form.fatherName" type="text" class="input-field" />
              </div>
              <div>
                <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Mother's Name</label>
                <input v-model="form.motherName" type="text" class="input-field" />
              </div>
              <div>
                <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Guardian Name</label>
                <input v-model="form.guardianName" type="text" class="input-field" />
              </div>
              <div>
                <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Guardian Phone (10 digits)</label>
                <input v-model="form.guardianPhone" type="tel" pattern="0[0-9]{9}" class="input-field" placeholder="0911000000" />
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Emergency Contact Name</label>
                <input v-model="form.emergencyContact" type="text" class="input-field" />
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex justify-end gap-4 mt-6 pt-4 border-t">
             <button type="button" @click="closeModal" class="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 font-semibold transition-colors">
               Cancel
             </button>
             <button type="submit" :disabled="submitting" class="btn-primary flex items-center gap-2">
               <svg v-if="submitting" class="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
               </svg>
               {{ submitting ? 'Saving...' : (isEditing ? 'Update Student' : 'Register Student') }}
             </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { get, post, del, patch } = useApi()

// State
const students = ref<any[]>([])
const loading = ref(true)
const submitting = ref(false)
const showModal = ref(false)
const isEditing = ref(false)
const editId = ref<string | null>(null)

// Filters
const filters = ref({
  grade: '',
  section: '',
  stream: ''
})

// Available Sections (dynamic)
const availableSections = ref<string[]>([])

// Form Data
const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  dateOfBirth: '',
  gender: '',
  phoneNumber: '',
  address: '',
  gradeLevel: 9,
  stream: '',
  fatherName: '',
  motherName: '',
  guardianName: '',
  guardianPhone: '',
  emergencyContact: ''
})

// Handlers
const onGradeChange = async () => {
    filters.value.section = ''
    await loadAvailableSections()
    await fetchStudents()
}

const loadAvailableSections = async () => {
  if (!filters.value.grade) {
    availableSections.value = []
    return
  }
  try {
    // We can fetch a summary or just use the student list to extract unique sections
    // For efficiency, we assume A-G if nothing returned, or parse from students
    // Here we'll just set common sections for now, or you could implement an API endpoint
    availableSections.value = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
  } catch (e) {
    console.error(e)
  }
}

const fetchStudents = async () => {
  loading.value = true
  try {
    let url = 'http://localhost:3001/api/students?'
    if (filters.value.grade) url += `grade=${filters.value.grade}&`
    if (filters.value.section) url += `section=${filters.value.section}&`
    if (filters.value.stream) url += `stream=${filters.value.stream}`
    
    students.value = await get(url)
  } catch (err) {
    console.error('Failed to fetch students', err)
    students.value = []
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
    email: '',
    dateOfBirth: '',
    gender: '',
    phoneNumber: '',
    address: '',
    gradeLevel: 9,
    stream: '',
    fatherName: '',
    motherName: '',
    guardianName: '',
    guardianPhone: '',
    emergencyContact: ''
  }
  showModal.value = true
}

const editStudent = (student: any) => {
  isEditing.value = true
  editId.value = student.id
  form.value = {
    firstName: student.firstName,
    lastName: student.lastName,
    email: student.user?.email || '',
    dateOfBirth: student.dateOfBirth?.split('T')[0] || '',
    gender: student.gender || '',
    phoneNumber: student.phoneNumber || '',
    address: student.address || '',
    gradeLevel: student.gradeLevel,
    stream: student.stream || '',
    fatherName: student.fatherName || '',
    motherName: student.motherName || '',
    guardianName: student.guardianName || '',
    guardianPhone: student.guardianPhone || '',
    emergencyContact: student.emergencyContact || ''
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const deleteStudent = async (id: string) => {
  if (!confirm('Are you sure you want to delete this student? This action cannot be undone.')) return;
  
  try {
    await del(`http://localhost:3001/api/students/${id}`)
    // Remove from local list
    students.value = students.value.filter(s => s.id !== id)
    alert('Student deleted successfully')
  } catch (err: any) {
    alert('Failed to delete: ' + (err.response?._data?.message || err.message))
  }
}

const submitForm = async () => {
  submitting.value = true
  try {
    const payload: any = { ...form.value }
    
    if (isEditing.value && editId.value) {
      // For editing, remove only email as it's not updatable
      delete payload.email
      
      await patch(`http://localhost:3001/api/students/${editId.value}`, payload)
      alert('Student updated successfully!')
    } else {
      // For new registration, remove email as it's auto-generated
      delete payload.email
      
      // Clean up empty optional fields
      if (!payload.stream && payload.gradeLevel < 11) delete payload.stream
      
      await post('http://localhost:3001/api/students/self-register', payload)
      alert('Student registered successfully! Email: firstname.lastname@agazi.edu, Password: agazi123')
    }
    
    closeModal()
    fetchStudents()
  } catch (err: any) {
    console.error('Student registration error:', err)
    
    // Provide specific error messages
    let errorMessage = 'Operation failed'
    
    if (err.response?.data?.message) {
      errorMessage = err.response.data.message
    } else if (err.response?.status === 400) {
      errorMessage = 'Invalid data provided. Please check all fields and try again.'
    } else if (err.response?.status === 409) {
      errorMessage = 'Student already exists with this information.'
    } else if (err.response?.status === 500) {
      errorMessage = 'Server error. Please try again later.'
    } else if (err.message) {
      errorMessage = err.message
    }
    
    alert(`Registration failed: ${errorMessage}`)
  } finally {
    submitting.value = false
  }
}
</script>