<template>
    <div>
    <div v-if="label !== ''">
      <Text :typography="Typography.Body2">{{ props.label }}</Text>
      <Spacer height="h-1" />
    </div>
    <div class="relative w-full">
        <label :class="`w-full flex items-center focus:outline-transparent focus:border-black ${errorStyle}`" >
            <textarea 
                v-model="model"
                class="textarea textarea-bordered grow" 
                :placeholder="placeholder" 
                :disabled="!enabled"
                @keyup.enter="$emit('enter')"
            >
            </textarea>
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

<script setup lang="ts">
    import { Typography } from '~/components/attr/TextAttr';

    const props = defineProps({
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
        enabled: {
            type: Boolean,
            default: true
        }
    })

    const model = defineModel({
        type: String,
        default: ''
    })

    defineEmits(['enter'])

    const errorStyle = computed(() => props.errorMessage !== '' ? 'input-error focus:border-error' : '')
</script>