<template>
  <component :is="selectedTag" :class="twMerge(selectedTypography, props.color, props.class)">
    <slot/>
  </component>
</template>

<script lang="ts" setup>
import { twMerge } from 'tailwind-merge';
import { Typography } from './attr/TextAttr';

const props = defineProps({
  typography: {
    type: String as PropType<Typography>,
    default: Typography.Body2,
  },
  color: {
    type: String,
    default: undefined
  },
  class: {
    type: String,
    default: ''
  }
})

const typographies = reactive<{
  [key: string]: string
}>({
  H1: "text-2xl font-bold text-content-primary",
  H2: "text-xl font-bold text-content-primary",
  H3: "text-lg text-content-primary",
  Body1: "text-sm text-content-secondary",
  Body2: "text-sm/[16px] text-content-primary",
  Body3: "text-xs text-content-primary",
  Label: "text-base text-content-secondary"
})

const selectedTag = computed(() => props.typography === typographies.H1 ? "h1" : "p")
const selectedTypography = computed(() => 
  props.typography in typographies ? typographies[props.typography] : typographies.Body2
)

</script>