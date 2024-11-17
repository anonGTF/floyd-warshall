<template>
  <div class="flex justify-between rounded-lg bg-background-secondary p-3 cursor-pointer" @click="toggle">
    <Text 
      :typography="Typography.Label"
      color="text-content-secondary" 
      class="font-normal"
    >
      {{ props.label }}
    </Text>
    <input 
      type="checkbox" 
      :class="`toggle ${backgroundColor} bg-white hover:bg-white ${borderColor}`" 
      :checked="modelValue"
    />
  </div>
</template>

<script setup lang="ts">
  import { Typography } from './attr/TextAttr';

  const props = defineProps({
    label: {
      type: String,
      default: ''
    }
  })

  const model = defineModel({
    type: Boolean,
    default: false
  })

  const backgroundColor = computed(() => model.value ? "[--tglbg:#415BE7]" : "[--tglbg:#D2D2D2]")
  const borderColor = computed(() => model.value ? "border-primary" : "border-[#D2D2D2]")

  const toggle = () => {
    model.value = !model.value
  }
</script>