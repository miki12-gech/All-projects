<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Top Navigation -->
    <nav class="glass-card sticky top-0 z-40 border-b border-gray-100 shadow-lg">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center gap-4">
            <NuxtLink to="/dashboard" class="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
              <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
              </svg>
            </NuxtLink>
            <div>
              <h1 class="text-xl font-bold text-gray-800">Notifications</h1>
              <p class="text-xs text-gray-500">Stay updated with school alerts</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <ThemeToggle />
            <NuxtLink to="/dashboard" class="px-4 py-2 text-gray-600 hover:text-amber-600 font-semibold transition-all flex items-center gap-2">
              Back
            </NuxtLink>
          </div>
        </div>
      </div>
    </nav>

    <!-- Content -->
    <div class="max-w-3xl mx-auto px-4 py-8">
      <div class="glass-card p-6 min-h-[500px]">
        <h2 class="text-lg font-bold text-gray-800 mb-6">Recent Activity</h2>
        
        <div v-if="loading" class="text-center py-12 text-gray-500">
          Loading notifications...
        </div>

        <div v-else-if="notifications.length === 0" class="text-center py-12 text-gray-500">
           <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
           </svg>
           No new notifications
        </div>

        <div v-else class="space-y-4">
          <div v-for="notif in notifications" :key="notif.id" 
               class="p-4 rounded-xl border-l-4 transition-all hover:bg-gray-50"
               :class="{
                 'border-amber-500 bg-amber-50': notif.type === 'ANNOUNCEMENT',
                 'border-blue-500 bg-blue-50': notif.type === 'SYSTEM',
                 'border-green-500 bg-green-50': notif.type === 'GRADE_POSTED',
                 'border-red-500 bg-red-50': notif.type === 'ATTENDANCE_ALERT'
               }"
          >
            <div class="flex justify-between items-start">
               <div>
                  <h3 class="font-bold text-gray-800 flex items-center gap-2">
                    <span v-if="!notif.isRead" class="inline-block w-2 h-2 rounded-full bg-amber-500"></span>
                    {{ notif.title }}
                  </h3>
                  <p class="text-sm text-gray-600 mt-1">{{ notif.message }}</p>
               </div>
               <div class="flex items-center gap-3">
                 <span class="text-xs text-gray-500">{{ formatDate(notif.createdAt) }}</span>
                 <button
                   v-if="!notif.isRead"
                   class="text-xs font-bold text-amber-700 hover:text-amber-800"
                   @click="markRead(notif.id)"
                 >
                   Mark read
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
const { get, patch } = useApi()

const notifications = ref<any[]>([])
const loading = ref(false)

const formatDate = (date: any) => {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

const loadNotifications = async () => {
  loading.value = true
  try {
    notifications.value = await get('http://localhost:3001/api/notifications')
  } catch (e) {
    console.error(e)
    notifications.value = []
  } finally {
    loading.value = false
  }
}

const markRead = async (id: string) => {
  try {
    await patch(`http://localhost:3001/api/notifications/${id}/read`, {})
    const n = notifications.value.find(n => n.id === id)
    if (n) n.isRead = true
  } catch (e) {
    console.error(e)
  }
}

onMounted(() => {
  loadNotifications()
})
</script>
