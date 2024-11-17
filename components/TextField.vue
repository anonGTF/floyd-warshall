<script lang="ts" setup>
import { Typography } from '~/components/attr/TextAttr';

const props = defineProps({
  type: {
    type: String,
    default: 'text'
  },
  placeholder: {
    type: String,
    default: ''
  },
  errorMessage: {
    type: String,
    default: ''
  },
  label: {
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
  enabled: {
    type: Boolean,
    default: true
  },
  readOnly: {
    type: Boolean,
    default: false
  }
})

const model = defineModel({
  type: String,
  default: ''
})

const numberModel = defineModel("number", {
  type: Number,
  default: 0
})

defineEmits([
  'trailingIconClick',
  'enter'
])

const passwordLetterSpacing = computed(() => 
  (props.type === 'password' && model.value != '') ? 'tracking-[.5em]' : ''
)

const errorStyle = computed(() => props.errorMessage !== '' ? 'input-error focus:border-error' : '')

const leadingSpacing = computed(() => props.leadingIcon !== '' ? 'ps-11' : '')

</script>

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
        <label :class="`input input-bordered w-full flex items-center focus:outline-transparent focus:border-black ${passwordLetterSpacing} ${errorStyle} ${leadingSpacing}`" >
          <template v-if="type != 'number'">
            <input 
              v-model="model"
              :type="type" 
              :placeholder="placeholder" 
              :disabled="!enabled"
              class="grow"
              @keyup.enter="$emit('enter')"
            />
            <Icon 
              v-if="trailingIcon != ''" 
              :name="trailingIcon" 
              class="txet-2xl" 
              @click="$emit('trailingIconClick')"
             />
          </template>
          <template v-else>
            <input 
              v-model="numberModel"
              :type="type" 
              :placeholder="placeholder" 
              :disabled="!enabled"
              class="grow"
              @keyup.enter="$emit('enter')"
            />
            <Icon 
              v-if="trailingIcon != ''" 
              :name="trailingIcon" 
              class="txet-2xl" 
              @click="$emit('trailingIconClick')"
             />
          </template>
        </label>
    </div>
    <Text 
      v-if="errorMessage !== ''" 
      :typography="Typography.Label"
      color="text-error"
    >
      {{ errorMessage }}
    </Text>
  </div>
</template>