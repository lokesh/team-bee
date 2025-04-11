<template>
    <div class="control">
        <div
          v-for="(option, index) in options"
          :key="index"
          class="option"
          :class="{ 'active': value === option.value }"
          @click="$emit('input', option.value)"
        >
          {{ option.label }}
        </div>
    </div>
</template>

<script>
export default {
    name: 'SegmentedControl',

    props: {
      value: {
        type: null,
        required: true,
      },
      options: {
        type: Array,
        required: true,
      },
    },
}
</script>

<style scoped>
.control {
  display: inline-flex;
  padding: 2px;
  background: var(--color-muted);
  border-radius: var(--radius-sm);
}

.option {
  flex: 0 0 auto;
  padding: 4px var(--gutter);
  border-radius: calc(var(--radius-sm) - 1px);
}

.option:hover {
  cursor: pointer;
}

.option.active {
  background: white;
}
</style>
