<template>
  <template v-if="props.title !== ''">
    <Text>{{ props.title }}</Text>
    <Spacer height="h-2" />
  </template>
  <div :class="`flex overflow-x-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] ${gap}`">
    <Spacer v-if="$props.fullRound" width="w-4" />
    <Select 
      v-for="option in props.options" 
      :key="option"
      :text="option"
      :selected="option == model"
      :full-round="props.fullRound"
      :class="minWidth"
      @click="select(option)"
    />
    <Spacer v-if="$props.fullRound" width="w-4" />
  </div>
  <Text
    v-if="errorMessage !== ''" 
    :typography="Typography.Label"
    color="text-error"
  >
    {{ errorMessage }}
  </Text>
</template>

<script setup lang="ts">
import { Typography } from './attr/TextAttr';

  const props = defineProps({
    title: {
      type: String,
      default: ''
    },
    options: {
      type: Array<string>,
      default: () => ([])
    },
    fullRound: {
      type: Boolean,
      default: false
    },
    errorMessage: {
      type: String,
      default: ''
    }
  })

  const model = defineModel({
    type: String,
    default: ''
  })

  const minWidth = computed(() => props.fullRound ? "" : "min-w-14")
  const gap = computed(() => props.fullRound ? "gap-3" : "gap-4")

  const select = (selected: string) => {
    model.value = selected
  }
</script>