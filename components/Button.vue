<template>
  <button
    type="button"
    :class="constructedClass"
    @click="handleClick"
  >
    <span v-if="$props.loading" :class="props.loading ? 'loading loading-spinner' : ''"></span>
    <slot />
  </button>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';
import { ButtonType } from './attr/ButtonAttr';

const props = defineProps({
  type: {
    type: String as PropType<ButtonType>,
    default: ButtonType.Primary
  },
  dense: {
    type: Boolean,
    default: false
  },
  enabled: {
    type: Boolean,
    default: true
  },
  error: {
    type: Boolean,
    default: false
  },
  fullWidth: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  underlined: {
    type: Boolean,
    default: false
  },
  class: {
    type: String,
    default: ''
  },
  to: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['click'])

const buttonTypes = reactive<{
  [key: string]: string
}>({
  Primary: "btn-primary rounded-xl text-white",
  Secondary: "btn-white rounded-xl text-black font-bold",
  Outlined: "btn-outline rounded-xl border border-border-primary",
  Ghost: "btn-ghost"
})

const buttonSizes = reactive<{
  [key: string]: string
}>({
  Default: "px-4 py-4 ",
  Dense: "px-4 py-2 text-sm "
})

const constructedClass = computed(() => {
  let className = `btn flex-nowrap min-h-0 h-fit ${props.class} ${buttonTypes[props.type]} `
  className += props.dense ? buttonSizes.Dense : buttonSizes.Default
  className += props.enabled ? "" : "btn-disabled "
  className += props.fullWidth ? "w-full " : ""
  className += props.error ? "btn-error " : ""
  className += props.underlined ? "font-bold underline text-content-primary " : ""
  return className
})

const handleClick = () => {
  if (props.to != "") {
    navigateTo(props.to)
  } else {
    emit("click")
  }
}

</script>