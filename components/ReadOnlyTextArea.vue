<template>
    <div>
    <div v-if="label !== ''">
      <Text :typography="Typography.Body2">{{ props.label }}</Text>
      <Spacer height="h-1" />
    </div>
    <div class="relative w-full">
        <label :class="`w-full flex items-center focus:outline-transparent focus:border-black`" >
            <textarea 
                :value="text"
                class="textarea textarea-bordered grow" 
                readonly
            >
            </textarea>
        </label>
    </div>
  </div>
</template>

<script setup lang="ts">
    import { Typography } from '~/components/attr/TextAttr';

    const props = defineProps({
        label: {
            type: String,
            default: ''
        },
        text: {
            type: String,
            default: ''
        }
    })
</script>