<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <header class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-bold text-gray-900 dark:text-white">📋 Student Approvals</h1>
          </div>
          <div class="flex items-center space-x-4">
            <button
              @click="refreshPendingStudents"
              class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              :disabled="loading"
            >
              {{ loading ? 'Loading...' : '🔄 Refresh' }}
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <div class="flex items-center">
            <div class="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-full">
              <span class="text-2xl">⏳</span>
            </div>
            <div class="ml-4">
              <p class="text-sm text-gray-600 dark:text-gray-400">Pending Approval</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ pendingStudents.length }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <div class="flex items-center">
            <div class="p-3 bg-green-100 dark:bg-green-900 rounded-full">
              <span class="text-2xl">✅</span>
            </div>
            <div class="ml-4">
              <p class="text-sm text-gray-600 dark:text-gray-400">Approved Today</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ approvedToday }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <div class="flex items-center">
            <div class="p-3 bg-red-100 dark:bg-red-900 rounded-full">
              <span class="text-2xl">❌</span>
            </div>
            <div class="ml-4">
              <p class="text-sm text-gray-600 dark:text-gray-400">Rejected Today</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ rejectedToday }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Pending Students Table -->
      <div class="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-lg font-bold text-gray-900 dark:text-white">Pending Student Registrations</h2>
        </div>
        
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Student</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Contact</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Academic</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Submitted</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-if="loading">
                <td colspan="5" class="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                  Loading pending students...
                </td>
              </tr>
              <tr v-else-if="pendingStudents.length === 0">
                <td colspan="5" class="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                  No pending student registrations
                </td>
              </tr>
              <tr v-else v-for="student in pendingStudents" :key="student.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ student.firstName }} {{ student.lastName }}
                    </div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">
                      {{ student.gender || 'Not specified' }}
                    </div>
                    <div class="text-xs text-gray-400">
                      DOB: {{ formatDate(student.dateOfBirth) }}
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900 dark:text-white">{{ student.phoneNumber }}</div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">{{ student.address || 'No address' }}</div>
                  <div class="text-xs text-gray-400">
                    Guardian: {{ student.guardianName || 'Not specified' }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900 dark:text-white">Grade {{ student.gradeLevel }}</div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">
                    {{ student.stream || 'No stream' }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {{ formatDate(student.submittedAt) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    @click="viewStudentDetails(student)"
                    class="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 mr-3"
                  >
                    View
                  </button>
                  <button
                    @click="approveStudent(student.id)"
                    class="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300 mr-3"
                    :disabled="processing"
                  >
                    {{ processing ? 'Processing...' : 'Approve' }}
                  </button>
                  <button
                    @click="rejectStudent(student.id)"
                    class="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                    :disabled="processing"
                  >
                    {{ processing ? 'Processing...' : 'Reject' }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>

    <!-- Student Details Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 shadow-lg rounded-md bg-white dark:bg-gray-800">
        <div class="mt-3">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white">Student Registration Details</h3>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              ✕
            </button>
          </div>
          
          <div v-if="selectedStudent" class="space-y-4">
            <!-- Personal Information -->
            <div>
              <h4 class="font-semibold text-gray-900 dark:text-white mb-2">Personal Information</h4>
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div><strong>Name:</strong> {{ selectedStudent.firstName }} {{ selectedStudent.lastName }}</div>
                <div><strong>Gender:</strong> {{ selectedStudent.gender || 'Not specified' }}</div>
                <div><strong>Date of Birth:</strong> {{ formatDate(selectedStudent.dateOfBirth) }}</div>
                <div><strong>Phone:</strong> {{ selectedStudent.phoneNumber }}</div>
                <div class="col-span-2"><strong>Address:</strong> {{ selectedStudent.address || 'Not specified' }}</div>
              </div>
            </div>
            
            <!-- Academic Information -->
            <div>
              <h4 class="font-semibold text-gray-900 dark:text-white mb-2">Academic Information</h4>
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div><strong>Grade Level:</strong> {{ selectedStudent.gradeLevel }}</div>
                <div><strong>Stream:</strong> {{ selectedStudent.stream || 'Not specified' }}</div>
              </div>
            </div>
            
            <!-- Family Information -->
            <div>
              <h4 class="font-semibold text-gray-900 dark:text-white mb-2">Family Information</h4>
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div><strong>Father's Name:</strong> {{ selectedStudent.fatherName || 'Not specified' }}</div>
                <div><strong>Mother's Name:</strong> {{ selectedStudent.motherName || 'Not specified' }}</div>
                <div><strong>Guardian's Name:</strong> {{ selectedStudent.guardianName || 'Not specified' }}</div>
                <div><strong>Guardian's Phone:</strong> {{ selectedStudent.guardianPhone || 'Not specified' }}</div>
                <div class="col-span-2"><strong>Emergency Contact:</strong> {{ selectedStudent.emergencyContact || 'Not specified' }}</div>
              </div>
            </div>
            
            <!-- Submission Info -->
            <div>
              <h4 class="font-semibold text-gray-900 dark:text-white mb-2">Submission Information</h4>
              <div class="text-sm">
                <div><strong>Submitted:</strong> {{ formatDate(selectedStudent.submittedAt) }}</div>
                <div><strong>Status:</strong> 
                  <span class="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                    {{ selectedStudent.status }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="flex justify-end space-x-3 mt-6">
            <button
              @click="closeModal"
              class="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
            >
              Close
            </button>
            <button
              @click="approveStudent(selectedStudent?.id)"
              class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              :disabled="processing"
            >
              {{ processing ? 'Processing...' : '✅ Approve' }}
            </button>
            <button
              @click="rejectStudent(selectedStudent?.id)"
              class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              :disabled="processing"
            >
              {{ processing ? 'Processing...' : '❌ Reject' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { get, post } from '~/composables/useApi'

// State
const pendingStudents = ref([])
const loading = ref(false)
const processing = ref(false)
const showModal = ref(false)
const selectedStudent = ref(null)
const approvedToday = ref(0)
const rejectedToday = ref(0)

// Methods
const fetchPendingStudents = async () => {
  loading.value = true
  try {
    pendingStudents.value = await get('http://localhost:3001/api/students/pending')
  } catch (error) {
    console.error('Failed to fetch pending students:', error)
  } finally {
    loading.value = false
  }
}

const refreshPendingStudents = () => {
  fetchPendingStudents()
}

const viewStudentDetails = (student) => {
  selectedStudent.value = student
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedStudent.value = null
}

const approveStudent = async (studentId) => {
  if (!confirm('Are you sure you want to approve this student registration?')) return
  
  processing.value = true
  try {
    const result = await post(`http://localhost:3001/api/students/approve/${studentId}`)
    alert(`Student approved successfully!\n\nEmail: ${result.email}\nPassword: ${result.password}`)
    closeModal()
    fetchPendingStudents()
  } catch (error) {
    console.error('Failed to approve student:', error)
    alert('Failed to approve student: ' + (error.response?.data?.message || error.message))
  } finally {
    processing.value = false
  }
}

const rejectStudent = async (studentId) => {
  const reason = prompt('Please provide a reason for rejection:')
  if (!reason) return
  
  if (!confirm('Are you sure you want to reject this student registration?')) return
  
  processing.value = true
  try {
    await post(`http://localhost:3001/api/students/reject/${studentId}`, { reason })
    alert('Student registration rejected successfully')
    closeModal()
    fetchPendingStudents()
  } catch (error) {
    console.error('Failed to reject student:', error)
    alert('Failed to reject student: ' + (error.response?.data?.message || error.message))
  } finally {
    processing.value = false
  }
}

const formatDate = (dateString) => {
  if (!dateString) return 'Not specified'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Lifecycle
onMounted(() => {
  fetchPendingStudents()
})
</script>
