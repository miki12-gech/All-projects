<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
    <div class="max-w-md w-full space-y-8">
      <!-- Header -->
      <div class="text-center">
        <div class="mx-auto h-16 w-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
          <span class="text-2xl font-bold text-white">🎓</span>
        </div>
        <h2 class="mt-6 text-3xl font-bold text-gray-900 dark:text-white">Student Sign Up</h2>
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Create your account to register for Agazi School
        </p>
      </div>

      <!-- Sign Up Form -->
      <form @submit.prevent="handleSignUp" class="mt-8 space-y-6">
        <div class="bg-white dark:bg-gray-800 py-8 px-6 shadow-xl rounded-lg border border-gray-200 dark:border-gray-700">
          <!-- Basic Info -->
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Full Name *</label>
              <input
                v-model="form.fullName"
                type="text"
                required
                class="input-field"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Email Address *</label>
              <input
                v-model="form.email"
                type="email"
                required
                class="input-field"
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Password *</label>
              <input
                v-model="form.password"
                type="password"
                required
                minlength="6"
                class="input-field"
                placeholder="Create a strong password"
              />
            </div>

            <div>
              <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Confirm Password *</label>
              <input
                v-model="form.confirmPassword"
                type="password"
                required
                minlength="6"
                class="input-field"
                placeholder="Confirm your password"
              />
            </div>

            <div>
              <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Phone Number *</label>
              <input
                v-model="form.phoneNumber"
                type="tel"
                required
                class="input-field"
                placeholder="+251 9X XXX XXXX"
              />
            </div>

            <div>
              <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Date of Birth *</label>
              <input
                v-model="form.dateOfBirth"
                type="date"
                required
                class="input-field"
              />
            </div>

            <div>
              <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Gender</label>
              <select v-model="form.gender" class="input-field">
                <option value="">Select Gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="mt-6">
            <button
              type="submit"
              :disabled="loading"
              class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <span v-if="loading" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Account...
              </span>
              <span v-else>Create Account</span>
            </button>
          </div>
        </div>
      </form>

      <!-- Login Link -->
      <div class="text-center">
        <p class="text-sm text-gray-600 dark:text-gray-400">
          Already have an account?
          <NuxtLink to="/login" class="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300">
            Sign in here
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { post } from '~/composables/useApi'

// Form data
const form = ref({
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
  phoneNumber: '',
  dateOfBirth: '',
  gender: ''
})

const loading = ref(false)

// Form validation
const validateForm = () => {
  if (!form.value.fullName.trim()) {
    alert('Please enter your full name')
    return false
  }
  
  if (!form.value.email.trim()) {
    alert('Please enter your email address')
    return false
  }
  
  if (!form.value.password || form.value.password.length < 6) {
    alert('Password must be at least 6 characters long')
    return false
  }
  
  if (form.value.password !== form.value.confirmPassword) {
    alert('Passwords do not match')
    return false
  }
  
  if (!form.value.phoneNumber.trim()) {
    alert('Please enter your phone number')
    return false
  }
  
  if (!form.value.dateOfBirth) {
    alert('Please enter your date of birth')
    return false
  }
  
  return true
}

// Handle sign up
const handleSignUp = async () => {
  if (!validateForm()) return
  
  loading.value = true
  
  try {
    // Create student user account
    const response = await post('http://localhost:3001/api/auth/register', {
      email: form.value.email,
      password: form.value.password,
      fullName: form.value.fullName,
      phoneNumber: form.value.phoneNumber,
      dateOfBirth: form.value.dateOfBirth,
      gender: form.value.gender,
      role: 'STUDENT'
    })
    
    alert('Account created successfully! You can now complete your registration.')
    
    // Redirect to registration form
    navigateTo('/students/register')
    
  } catch (error) {
    console.error('Sign up failed:', error)
    alert('Sign up failed: ' + (error.response?.data?.message || error.message))
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.input-field {
  @apply w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white;
}
</style>
