<template>
  <button
    type="button"
    @pointerdown="$emit('click')"
  >
    <slot />
  </button>
</template>

<script>
export default {
  name: 'HiveButton',
}
</script>

<style scoped>
button {
  user-select: none;
}
</style>
