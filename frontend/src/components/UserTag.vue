<template>
  <div
    class="tag"
    :style="`background: ${user?.color}`"
  >
    {{ user?.name.slice(0, 1) }}
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useUserStore } from '@/stores/user'

const props = defineProps({
  userId: {
    type: Number,
    required: true,
  },
})

const userStore = useUserStore()
const user = computed(() => userStore.getUserById(props.userId))
</script>

<style scoped>
.tag {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 18px;
  height: 18px;
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;
  color: white;
  background-color: var(--color-muted);
}
</style> 