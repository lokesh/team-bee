export const visible = {
  mounted(el, binding) {
    el.style.visibility = binding.value ? 'visible' : 'hidden'
  },
  updated(el, binding) {
    el.style.visibility = binding.value ? 'visible' : 'hidden'
  }
} 