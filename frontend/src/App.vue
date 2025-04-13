<script setup>
import { ref, onBeforeMount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from '@/stores'
import PageSpinner from '@/components/PageSpinner.vue'

const router = useRouter()
const route = useRoute()
const store = useStore()

const isLoaded = ref(false)

onBeforeMount(async () => {
  await store.loadUsers()
  await store.loadPuzzles()

  // Check if user is already set, then skip login screen
  const storedUserId = localStorage.getItem('teamBeeUserId')
  console.log('1 storedUserId', storedUserId)
  let userId = null
  
  if (storedUserId) {
    try {
      // Try to parse as JSON first
      userId = JSON.parse(storedUserId)
    } catch (e) {
      // If it's not JSON, use the string value directly
      userId = storedUserId
    }
    console.log('2 userId', userId)
    if (userId) {
      store.setUserId(userId)
      if (route.name !== 'Game') {
        router.push({ name: 'Game' })
      }
    }
  }

  isLoaded.value = true
})
</script>

<template>
  <div class="app">
    <router-view v-if="isLoaded" />
    <page-spinner v-else />
  </div>
</template>

<style>
@import "./styles/base.css";
</style>

<style scoped>
.app {
  max-width: 1024px;
  margin: 0 auto;
}
</style>
