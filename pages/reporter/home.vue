<template>
    <div class="flex flex-col">
        <TextField
            v-model="search"
            placeholder="Cari Lokasi"
            trailing-icon="mdi:magnify"
            class="m-16"
        />
        <img src="/images/indonesia-map.png" class="items-center mx-16"/>
        <div class="flex-none mt-16 mb-4 mx-16 bg-white border border-primary rounded-2xl p-8">

        </div>
    </div>
</template>

<script setup lang="ts">
    definePageMeta({
        layout: "reporter"
    })

    const search = ref('')
</script>