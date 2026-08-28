<template>
  <div>
    <!-- NuxtPage ማለት በ pages ፎልደር ውስጥ ያሉትን ገጾች እዚህ አሳይ ማለት ነው -->
    <!-- ይህ ለሁሉም ገጾች እንደ "መተላለፊያ" ያገለግላል -->
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
const { initTheme } = useTheme()

onMounted(() => {
  initTheme()
})
</script>