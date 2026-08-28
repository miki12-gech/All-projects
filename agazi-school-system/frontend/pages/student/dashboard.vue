<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <header class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <NuxtLink to="/" class="text-xl font-bold text-gray-900 dark:text-white">
              🏫 Agazi School
            </NuxtLink>
            <span class="ml-4 text-gray-600 dark:text-gray-400">/ Student Dashboard</span>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-600 dark:text-gray-400">
              Welcome, {{ user?.fullName || 'Student' }}
            </span>
            <button
              @click="logout"
              class="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Status Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <div class="flex items-center">
            <div class="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
              <span class="text-2xl">📋</span>
            </div>
            <div class="ml-4">
              <p class="text-sm text-gray-600 dark:text-gray-400">Registration Status</p>
              <p class="text-lg font-bold text-gray-900 dark:text-white">{{ registrationStatus }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <div class="flex items-center">
            <div class="p-3 bg-green-100 dark:bg-green-900 rounded-full">
              <span class="text-2xl">📧</span>
            </div>
            <div class="ml-4">
              <p class="text-sm text-gray-600 dark:text-gray-400">School Email</p>
              <p class="text-sm font-medium text-gray-900 dark:text-white">{{ studentEmail || 'Pending' }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <div class="flex items-center">
            <div class="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
              <span class="text-2xl">🔐</span>
            </div>
            <div class="ml-4">
              <p class="text-sm text-gray-600 dark:text-gray-400">Default Password</p>
              <p class="text-sm font-medium text-gray-900 dark:text-white">{{ studentPassword || 'Pending' }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <div class="flex items-center">
            <div class="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-full">
              <span class="text-2xl">📚</span>
            </div>
            <div class="ml-4">
              <p class="text-sm text-gray-600 dark:text-gray-400">Grade Level</p>
              <p class="text-lg font-bold text-gray-900 dark:text-white">{{ userGrade || 'Not Assigned' }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Registration Information -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Registration Progress -->
        <div class="bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700">
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white">Registration Progress</h3>
          </div>
          <div class="p-6">
            <div class="space-y-4">
              <div class="flex items-center">
                <div :class="getStepClass(1)" class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                  <span v-if="currentStep >= 1">✓</span>
                  <span v-else>1</span>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-900 dark:text-white">Account Created</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">Your student account has been created</p>
                </div>
              </div>
              
              <div class="flex items-center">
                <div :class="getStepClass(2)" class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                  <span v-if="currentStep >= 2">✓</span>
                  <span v-else>2</span>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-900 dark:text-white">Registration Submitted</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">Your registration form has been received</p>
                </div>
              </div>
              
              <div class="flex items-center">
                <div :class="getStepClass(3)" class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                  <span v-if="currentStep >= 3">✓</span>
                  <span v-else>3</span>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-900 dark:text-white">Admin Review</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">Administrator is reviewing your application</p>
                </div>
              </div>
              
              <div class="flex items-center">
                <div :class="getStepClass(4)" class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                  <span v-if="currentStep >= 4">✓</span>
                  <span v-else>4</span>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-900 dark:text-white">Approved</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">Registration approved and ready to access</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700">
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white">Quick Actions</h3>
          </div>
          <div class="p-6 space-y-4">
            <button
              @click="completeRegistration"
              :disabled="registrationCompleted"
              class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ registrationCompleted ? 'Registration Completed' : 'Complete Registration' }}
            </button>
            
            <button
              @click="viewRegistrationDetails"
              class="w-full flex justify-center py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              View Registration Details
            </button>
            
            <button
              @click="checkStatus"
              class="w-full flex justify-center py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Check Approval Status
            </button>
            
            <div class="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p class="text-sm text-yellow-800 dark:text-yellow-200">
                <strong>📞 Need Help?</strong><br>
                Contact the school administration if you have any questions about your registration.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { get } from '~/composables/useApi'

// State
const user = ref(null)
const studentData = ref(null)
const loading = ref(false)

// Computed
const registrationStatus = computed(() => {
  if (!studentData.value) return 'Not Started'
  if (studentData.value.status === 'PENDING') return 'Pending Approval'
  if (studentData.value.status === 'APPROVED') return 'Approved'
  if (studentData.value.status === 'REJECTED') return 'Rejected'
  return 'Unknown'
})

const currentStep = computed(() => {
  if (!studentData.value) return 1
  if (studentData.value.status === 'PENDING') return 2
  if (studentData.value.status === 'APPROVED') return 4
  if (studentData.value.status === 'REJECTED') return 3
  return 1
})

const registrationCompleted = computed(() => {
  return studentData.value && studentData.value.status === 'APPROVED'
})

const studentEmail = computed(() => {
  return studentData.value?.email || null
})

const studentPassword = computed(() => {
  return studentData.value?.password || null
})

const userGrade = computed(() => {
  return studentData.value?.gradeLevel ? `Grade ${studentData.value.gradeLevel}` : null
})

// Methods
const getStepClass = (step) => {
  if (currentStep.value >= step) {
    return 'bg-green-500 text-white'
  }
  return 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
}

const completeRegistration = () => {
  navigateTo('/students/register')
}

const viewRegistrationDetails = () => {
  if (studentData.value) {
    alert(`Registration Details:\n\nName: ${studentData.value.firstName} ${studentData.value.lastName}\nStatus: ${registrationStatus.value}\nSubmitted: ${new Date(studentData.value.submittedAt).toLocaleDateString()}`)
  }
}

const checkStatus = async () => {
  loading.value = true
  try {
    // Check registration status
    const response = await get('http://localhost:3001/api/students/me/status')
    studentData.value = response
  } catch (error) {
    console.error('Failed to check status:', error)
  } finally {
    loading.value = false
  }
}

const logout = () => {
  localStorage.removeItem('user')
  localStorage.removeItem('token')
  navigateTo('/login')
}

// Load user data on mount
onMounted(async () => {
  const userData = localStorage.getItem('user')
  if (userData) {
    user.value = JSON.parse(userData)
    await checkStatus()
  }
})
</script>

<style scoped>
.step-completed {
  @apply bg-green-500 text-white;
}

.step-pending {
  @apply bg-blue-500 text-white;
}

.step-future {
  @apply bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400;
}
</style>
