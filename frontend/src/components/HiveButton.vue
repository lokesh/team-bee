<template>
  <button
    type="button"
    @pointerdown="$emit('click')"
  >
    <slot />
  </button>
</template>

<script setup>
// No props or logic needed for this component
</script>

<style scoped>
button {
  user-select: none;
}
</style> 