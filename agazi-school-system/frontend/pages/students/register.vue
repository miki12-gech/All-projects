<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
    <!-- Header -->
    <header class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 mb-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <NuxtLink to="/" class="text-xl font-bold text-gray-900 dark:text-white">
              🏫 Agazi School
            </NuxtLink>
            <span class="ml-4 text-gray-600 dark:text-gray-400">/ Student Registration</span>
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
    <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Progress Steps -->
      <div class="mb-8">
        <div class="flex items-center justify-center space-x-4">
          <div class="flex items-center">
            <div class="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
            <span class="ml-2 text-sm font-medium text-gray-900 dark:text-white">Account Created</span>
          </div>
          <div class="w-16 h-1 bg-blue-600"></div>
          <div class="flex items-center">
            <div class="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
            <span class="ml-2 text-sm font-medium text-gray-900 dark:text-white">Complete Registration</span>
          </div>
          <div class="w-16 h-1 bg-gray-300 dark:bg-gray-600"></div>
          <div class="flex items-center">
            <div class="w-8 h-8 bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400 rounded-full flex items-center justify-center text-sm font-bold">3</div>
            <span class="ml-2 text-sm font-medium text-gray-500 dark:text-gray-400">Admin Approval</span>
          </div>
        </div>
      </div>

      <!-- Registration Form -->
      <div class="bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">Complete Your Registration</h2>
          <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Please provide your academic and family information to complete your registration.
          </p>
        </div>

        <form @submit.prevent="submitForm" class="p-6 space-y-6">
          <!-- Personal Information -->
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 border-b pb-2">Personal Information</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">First Name *</label>
                <input v-model="form.firstName" type="text" class="input-field" required />
              </div>
              <div>
                <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Last Name *</label>
                <input v-model="form.lastName" type="text" class="input-field" required />
              </div>
              <div>
                <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Date of Birth *</label>
                <input v-model="form.dateOfBirth" type="date" class="input-field" required />
              </div>
              <div>
                <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Gender</label>
                <select v-model="form.gender" class="input-field">
                  <option value="">Select Gender</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Phone Number *</label>
                <input v-model="form.phoneNumber" type="tel" class="input-field" required />
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Address</label>
                <input v-model="form.address" type="text" class="input-field" />
              </div>
            </div>
          </div>

          <!-- Academic Information -->
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 border-b pb-2">Academic Information</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Grade Level *</label>
                <select v-model.number="form.gradeLevel" class="input-field" required>
                  <option value="">Select Grade</option>
                  <option value="9">Grade 9</option>
                  <option value="10">Grade 10</option>
                  <option value="11">Grade 11</option>
                  <option value="12">Grade 12</option>
                </select>
              </div>
              <div v-if="form.gradeLevel >= 11">
                <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Stream *</label>
                <select v-model="form.stream" class="input-field" required>
                  <option value="">Select Stream</option>
                  <option value="NATURAL">Natural Science</option>
                  <option value="SOCIAL">Social Science</option>
                </select>
              </div>
            </div>
            
            <!-- Section is auto-assigned -->
            <div class="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p class="text-sm text-blue-800 dark:text-blue-200">
                <strong>📋 Section:</strong> Will be auto-assigned based on class capacity
              </p>
            </div>
          </div>

          <!-- Family Information -->
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 border-b pb-2">Family & Emergency Contact</h3>
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
                <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Guardian's Name</label>
                <input v-model="form.guardianName" type="text" class="input-field" />
              </div>
              <div>
                <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Guardian's Phone</label>
                <input v-model="form.guardianPhone" type="tel" class="input-field" />
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Emergency Contact</label>
                <input v-model="form.emergencyContact" type="text" class="input-field" />
              </div>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="flex justify-end space-x-3">
            <button
              type="button"
              @click="saveAsDraft"
              class="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Save as Draft
            </button>
            <button
              type="submit"
              :disabled="submitting"
              class="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="submitting" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </span>
              <span v-else>Submit Registration</span>
            </button>
          </div>
        </form>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { post } from '~/composables/useApi'

// Form data
const form = ref({
  firstName: '',
  lastName: '',
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

const submitting = ref(false)
const user = ref(null)

// Load user data on mount
onMounted(() => {
  // Get user from localStorage or auth state
  const userData = localStorage.getItem('user')
  if (userData) {
    user.value = JSON.parse(userData)
    // Pre-fill some fields from user account
    form.value.phoneNumber = user.value.phoneNumber || ''
    form.value.dateOfBirth = user.value.dateOfBirth || ''
    form.value.gender = user.value.gender || ''
  }
})

// Save as draft
const saveAsDraft = () => {
  localStorage.setItem('registrationDraft', JSON.stringify(form.value))
  alert('Registration saved as draft!')
}

// Load draft
const loadDraft = () => {
  const draft = localStorage.getItem('registrationDraft')
  if (draft) {
    form.value = JSON.parse(draft)
  }
}

// Submit form
const submitForm = async () => {
  submitting.value = true
  
  try {
    const payload = { ...form.value }
    
    // Submit registration
    await post('http://localhost:3001/api/students/self-register', payload)
    
    alert('Registration submitted successfully! Please wait for admin approval. You will receive an email once approved.')
    
    // Clear draft
    localStorage.removeItem('registrationDraft')
    
    // Redirect to dashboard
    navigateTo('/student/dashboard')
    
  } catch (err: any) {
    console.error('Registration error:', err)
    
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

// Logout
const logout = () => {
  localStorage.removeItem('user')
  localStorage.removeItem('token')
  navigateTo('/login')
}
</script>

<style scoped>
.input-field {
  @apply w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white;
}
</style>
