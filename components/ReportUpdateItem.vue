<template>
    <div class="w-full flex flex-row gap-4">
        <div class="flex flex-col items-center">
            <div>
                <Text
                    class="rounded-full w-12 h-12 flex items-center justify-center font-bold"
                    :class="showDecoration ? 'border-border-primary border' : 'border-primary border-4'"
                >{{ orderNo }}</Text>
            </div>
            <div v-if="showDecoration" class="h-full bg-primary w-1"/>
        </div>
        <div class="flex-1">
            <template v-if="updateData.assignmentReceivedData != null">
                <div class="min-h-12 flex flex-row gap-2 items-center justify-between">
                    <div>
                        <Text class="font-semibold" color="text-content-secondary">{{ formattedDate }}</Text>
                        <Text :typography="Typography.Label" class="font-bold" color="text-black">{{ formattedTime }} WIB</Text>
                    </div>
                    <StatusCard status="RECEIVED-BY-OFFICER" class="mb-0"/>
                </div>
                <Spacer height="h-4"/>
                <ReadOnlyTextField
                    label="Personil"
                    :text="updateData.assignmentReceivedData.personil"
                />
                <Spacer height="h-4"/>
                <ReadOnlyTextField
                    label="Peralatan yang Dibawa"
                    :text="updateData.assignmentReceivedData.packageBrought"
                />
                <Spacer height="h-8"/>
            </template>
            <template v-if="updateData.arrivalData != null">
                <div class="min-h-12 flex flex-row gap-2 items-center justify-between">
                    <div>
                        <Text class="font-semibold" color="text-content-secondary">{{ formattedDate }}</Text>
                        <Text :typography="Typography.Label" class="font-bold" color="text-black">{{ formattedTime }} WIB</Text>
                    </div>
                    <StatusCard status="INPROGRESS" class="mb-0"/>
                </div>
                <Spacer height="h-4"/>
                <ReadOnlyTextField
                    label="Waktu Kedatangan"
                    :text="updateData.arrivalData.arrivedAt"
                />
                <Spacer height="h-4"/>
                <ReadOnlyTextField
                    label="Detail Pelaksanaan"
                    :text="updateData.arrivalData.accidentDetail"
                />
                <Spacer height="h-4"/>
                <ReadOnlyTextField
                    label="Peralatan yang Digunakan"
                    :text="updateData.arrivalData.packageUsed"
                />
                <Spacer height="h-8"/>
            </template>
            <template v-if="updateData.completionData != null">
                <div class="min-h-12 flex flex-row gap-2 items-center justify-between">
                    <div>
                        <Text class="font-semibold" color="text-content-secondary">{{ formattedDate }}</Text>
                        <Text :typography="Typography.Label" class="font-bold" color="text-black">{{ formattedTime }} WIB</Text>
                    </div>
                    <StatusCard status="DONE" class="mb-0"/>
                </div>
                <template v-if="updateData.completionData.evidence != ''">
                    <Spacer height="h-4"/>
                    <img :src="updateData.completionData.evidence"/>
                </template>
                <Spacer height="h-4"/>
                <ReadOnlyTextField
                    label="Status Korban"
                    :text="updateData.completionData.victimStatus"
                />
                <Spacer height="h-4"/>
                <ReadOnlyTextField
                    label="Kendala"
                    :text="updateData.completionData.blocker"
                />
                <Spacer height="h-4"/>
                <ReadOnlyTextField
                    label="Detail Kejadian"
                    :text="updateData.completionData.accidentDetail"
                />
            </template>
            <template v-if="updateData.declineData != null">
                <div class="min-h-12 flex flex-row gap-2 items-center justify-between">
                    <div>
                        <Text class="font-semibold" color="text-content-secondary">{{ formattedDate }}</Text>
                        <Text :typography="Typography.Label" class="font-bold" color="text-black">{{ formattedTime }} WIB</Text>
                    </div>
                    <StatusCard status="DECLINED" class="mb-0"/>
                </div>
                <ReadOnlyTextField
                    label="Alasan Penolakan"
                    :text="updateData.declineData.reason"
                />
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { useDateFormat } from '@vueuse/core';
    import type { PropType } from 'vue';
    import { Typography } from './attr/TextAttr';

    const props = defineProps({
        orderNo: {
            type: Number,
            required: true
        },
        updateData: {
            type: Object as PropType<UpdateReport>,
            required: true
        },
        showDecoration: {
            type: Boolean,
            default: true
        }
    })

    const formattedDate = useDateFormat(props.updateData.createdAt, 'dddd, DD MMM YYYY', { locales: 'id-ID' })
    const formattedTime = useDateFormat(props.updateData.createdAt, 'HH:mm', { locales: 'id-ID' })

    onMounted(() => {
        console.log(props.updateData)
    })
</script>