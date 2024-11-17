<template>
  <div class="group" :class="{ show: props.isShow }">
    <div v-if="props.isShow" class="bg-black/[.5] w-full md:w-[448px] max-w-md h-screen absolute top-0"></div>
    <div class="group-[&.show]:translate-y-0 max-w-md bottom-0 fixed left-0 right-0 z-50 transition-transform translate-y-full duration-[400ms] flex flex-col items-center mx-auto rounded-t-[10px] h-[90%] bg-white shadow-xl">
      <div class="px-4 py-6 text-center flex flex-wrap justify-between items-center w-full border-b border-border-primary">
        <span class="basis-1/5 grid">
          <ic-close v-if="props.dismissible" class="mt-1 text-2xl cursor-pointer justify-self-start" @click="$emit('close')"/>
        </span>
        <Text :typography="Typography.Label" class="basis-3/5 font-bold text-content-primary">{{ props.title }}</Text>
        <span class="basis-1/5 grid">
          <Button 
            v-if="props.actionText !== ''" 
            :type="ButtonType.Ghost" 
            class="justify-self-end"
            @click="$emit('action')"
          >
            {{ props.actionText }}
          </Button>
        </span>
      </div>
      <div class="w-full h-full">
        <slot/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Typography } from './attr/TextAttr';
import { ButtonType } from './attr/ButtonAttr';

const props = defineProps({
  isShow: {
    type: Boolean,
    default: false,
    required: true
  },
  dismissible: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  actionText: {
    type: String,
    default: ''
  }
})

defineEmits(['close', 'action'])

</script>