<script lang="ts" setup>
const props = defineProps({
  width: {
    type: String,
    default: 'w-1'
  },
  height: {
    type: String,
    default: 'h-1'
  }
})
</script>
<template>
  <div :class="`${props.width} ${props.height}`" />
</template>