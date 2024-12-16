<template>
    <div>
      <div v-if="props.label !== ''">
        <Text :typography="Typography.Body2">{{ props.label }}</Text>
        <Spacer height="h-1" />
      </div>
      <div class="relative w-full">
          <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <Icon v-if="props.leadingIcon != ''" :name="props.leadingIcon" class="text-2xl" />
          </div>
          <label :class="`input input-bordered bg-white w-full flex items-center focus:outline-transparent focus:border-black ${leadingSpacing} ${clickableClass}`" >
            <input 
              :value="text"
              readonly
              class="grow"
              :class="{'cursor-pointer': props.clickable}"
            />
            <Icon 
              v-if="trailingIcon != ''" 
              :name="trailingIcon" 
              class="txet-2xl" 
              @click="$emit('trailingIconClick')"
             />
          </label>
      </div>
    </div>
  </template>

<script lang="ts" setup>
import { Typography } from '~/components/attr/TextAttr';

const props = defineProps({
  label: {
    type: String,
    default: ''
  },
  text: {
    type: String,
    default: ''
  },
  leadingIcon: {
    type: String,
    default: ''
  },
  trailingIcon: {
    type: String,
    default: ''
  },
  clickable: {
    type: Boolean,
    default: false
  },
})

defineEmits([
  'trailingIconClick'
])

const leadingSpacing = computed(() => props.leadingIcon !== '' ? 'ps-11' : '')
const clickableClass = computed(() => props.clickable ? "cursor-pointer" : "")

</script>