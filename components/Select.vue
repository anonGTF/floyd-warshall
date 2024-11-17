<template>
  <div :class="containerStyle" class="cursor-pointer text-center" @click="$emit('click')">
    <Text :typography="Typography.Label" :class="textStyle" class="text-nowrap">
      <slot/>
      {{ props.text }}
    </Text>
  </div>
</template>

<script setup lang="ts">
  import { Typography } from './attr/TextAttr';

  const props = defineProps({
    text: {
      type: String,
      default: ''
    },
    selected: {
      type: Boolean,
      default: false
    },
    fullRound: {
      type: Boolean,
      default: false
    }
  })

  defineEmits(['click'])

  const textStyle = computed(() => {
    if (props.selected) {
      return 'text-white'
    } else if (props.fullRound) {
      return 'text-content-secondary'
    } else {
      return 'text-content-primary'
    }
  })

  const containerStyle = computed(() => {
    if (props.fullRound) {
      return (props.selected) ? 'px-4 py-2 bg-primary rounded-full' : 'px-4 py-2 bg-background-secondary rounded-full border border-border-primary'
    } else {
      return (props.selected) ? 'px-4 py-3 bg-primary rounded-lg' : 'px-4 py-3 rounded-lg border border-border-primary'
    }
  })

</script>