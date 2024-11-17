<template>
    <div class="bg-white rounded-2xl m-16 p-8">
        <Text :typography="Typography.H1" class="text-primary">Cari Rute</Text>
        <Spacer height="h-8"/>
        
        <!-- MAPS SELECTOR -->

        <div class="min-h-[55vh] flex flex-row gap-6">
            <div class="flex-none w-80">
                <DropdownSelector
                    v-model="selectedNodeIndex"
                    label="Jumlah Node"
                    :options="nodeOptions"
                />
                <Spacer height="h-4"/>
                <DropdownSelector
                    v-model="selectedTkpIndex"
                    search-placeholder="Cari Judul Laporan"
                    placeholder="Pilih TKP"
                    label="Pilih TKP"
                    :options="tkpOptions"
                />
                <Spacer height="h-6"/>
                <Button 
                    full-width
                    :loading="searchRouteLoading"
                    @click="searchRoute"
                >
                    Cari Rute
                </Button>
                <Spacer height="h-6"/>
                <template v-if="selectedResult != null">
                    <div class="rounded-lg bg-gray-100 p-4">
                        <Text :typography="Typography.Label" class="font-semibold" color="text-black">Kantor Terpilih</Text>
                        <Text :typography="Typography.Body1">Nama: {{ selectedResult.kantorTerdekat.nama }}</Text>
                        <Text :typography="Typography.Body1">Jumlah Personel: {{ selectedResult.kantorTerdekat.jumlahPersonel }}</Text>
                        <Text :typography="Typography.Body1">Jumlah Peralatan: {{ selectedResult.kantorTerdekat.jumlahPeralatan }}</Text>
                    </div>
                    <Spacer height="h-4"/>
                    <div class="rounded-lg bg-gray-100 p-4">
                        <Text :typography="Typography.Label" class="font-semibold" color="text-black">Jarak Kantor ke TKP</Text>
                        <Text :typography="Typography.Body1">{{ selectedResult.distance }} meter</Text>
                    </div>
                    <Spacer height="h-4"/>
                    <div class="rounded-lg bg-gray-100 p-4">
                        <Text :typography="Typography.Label" class="font-semibold" color="text-black">Durasi mencari rute</Text>
                        <Text :typography="Typography.Body1">{{ selectedResult.duration }} ms</Text>
                    </div>
                </template>
            </div>

            <!-- END OF MAPS SELECTOR -->

            <!-- MAP CONTAINER -->
            <div v-if="selectedTkpForMap == null" class="flex-1 flex justify-center items-center rounded-sm bg-gray-100">
                <Text :typography="Typography.H2" color="text-error">Pilih TKP terlebih dahulu</Text>
            </div>
            <div v-else class="flex-1">
                <LMap
                    ref="map"
                    :zoom="13"
                    :center="[selectedTkpForMap?.lat ?? 0, selectedTkpForMap?.long ?? 0]"
                    :use-global-leaflet="false"
                    @ready="setMapReady"
                >
                    <LTileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution="&amp;copy; <a href=&quot;https://www.openstreetmap.org/&quot;>OpenStreetMap</a> contributors"
                        layer-type="base"
                        name="OpenStreetMap"
                    />

                    <LPolyline
                        ref="polyline"
                        v-if="polylineCoordinates != null"
                        :lat-lngs="polylineCoordinates"
                        color="blue"
                        @ready="fitPolylineBounds"
                    />

                    <LMarker 
                        v-if="selectedResult != null"
                        :lat-lng="[selectedResult.kantorTerdekat.lat, selectedResult.kantorTerdekat.long]"
                    >
                        <LPopup>{{ selectedResult.kantorTerdekat.nama }}</LPopup>
                    </LMarker>

                    <LMarker 
                        v-if="selectedTkpForMap != null"
                        :lat-lng="[selectedTkpForMap.lat, selectedTkpForMap.long]"
                    >
                        <LPopup>{{ selectedTkpForMap.judul }}</LPopup>
                    </LMarker>
                </LMap>
            </div>

            <!-- END OF MAP CONTAINER -->

        </div>
    </div>
    <div class="bg-white rounded-2xl m-16 p-8">
        <div class="flex flex-row justify-between">
            <Text :typography="Typography.H1" class="text-primary">Data Kantor</Text>
            <Button @click="openKantorModal(null)">
                Tambah Kantor
            </Button>
        </div>
        <Spacer height="h-8"/>
        <Table
            :headers="kantorTableHeaders"
            :is-empty="kantorData.length == 0"
        >
            <tr v-for="(data, index) in kantorData">
                <th>
                    <Text :typography="Typography.Body2" class="font-semibold text-content-primary">{{ index + 1 }}</Text>
                </th>
                <td>
                    <Text :typography="Typography.Body2">{{ data.nama }}</Text>
                </td>
                <td>
                    <Text :typography="Typography.Body2">{{ data.lat }}</Text>
                </td>
                <td>
                    <Text :typography="Typography.Body2">{{ data.long }}</Text>
                </td>
                <td>
                    <Text :typography="Typography.Body2">{{ data.jumlahPersonel }}</Text>
                </td>
                <td>
                    <Text :typography="Typography.Body2">{{ data.jumlahPeralatan }}</Text>
                </td>
                <td class="flex justify-end">
                    <Button 
                        :type="ButtonType.Outlined" 
                        dense
                        @click="openKantorModal(data)"
                    >
                        Edit
                    </Button>
                </td>
            </tr>
        </Table>
    </div>
    <div class="bg-white rounded-2xl m-16 p-8">
        <div class="flex flex-row justify-between">
            <Text :typography="Typography.H1" class="text-primary">Data TKP</Text>
            <Button @click="openTkpModal(null)">
                Tambah TKP
            </Button>
        </div>
        <Spacer height="h-8"/>
        <Table
            :headers="tkpTableHeaders"
            :is-empty="tkpData.length == 0"
        >
            <tr v-for="(data, index) in tkpData">
                <th>
                    <Text :typography="Typography.Body2" class="font-semibold text-content-primary">{{ index + 1 }}</Text>
                </th>
                <td>
                    <Text :typography="Typography.Body2">{{ data.judul }}</Text>
                </td>
                <td>
                    <Text :typography="Typography.Body2">{{ data.deskripsi }}</Text>
                </td>
                <td>
                    <Text :typography="Typography.Body2">{{ data.alamat }}</Text>
                </td>
                <td>
                    <Text :typography="Typography.Body2">{{ data.lat }}</Text>
                </td>
                <td>
                    <Text :typography="Typography.Body2">{{ data.long }}</Text>
                </td>
                <td class="flex justify-end">
                    <Button 
                        :type="ButtonType.Outlined" 
                        dense
                        @click="openTkpModal(data)"
                    >
                        Edit
                    </Button>
                </td>
            </tr>
        </Table>
    </div>

    <!-- DIALOG FOR KANTOR -->

    <dialog 
        class="modal modal-bottom sm:modal-middle"
        :class="{ 'modal-open': showKantorModal }"
    >
        <div class="modal-box">
            <Text :typography="Typography.H2">
                {{ selectedKantor?.id == "" ? "Tambah kantor" : "Edit Kantor" }}
            </Text>
            <Spacer height="h-6" />
            <TextField 
                v-model="selectedKantor.nama"
                label="Nama"
                placeholder="Masukkan nama kantor"
            />
            <Spacer height="h-4" />
            <TextField 
                v-model="selectedKantor.alamat"
                label="Alamat Kantor"
                placeholder="Masukkan alamat kantor"
            />
            <Spacer height="h-4" />
            <TextField 
                v-model:number="selectedKantor.lat"
                type="number"
                label="Latitude"
                placeholder="Masukkan latitude kantor"
            />
            <Spacer height="h-4" />
            <TextField 
                v-model:number="selectedKantor.long"
                type="number"
                label="Longitude"
                placeholder="Masukkan longitude kantor"
            />
            <Spacer height="h-4" />
            <TextField 
                v-model:number="selectedKantor.jumlahPersonel"
                type="number"
                label="Jumlah Personel"
                placeholder="Masukkan jumlah personel"
            />
            <Spacer height="h-4" />
            <TextField 
            v-model:number="selectedKantor.jumlahPeralatan"
            type="number"
            label="Jumlah Peralatan"
            placeholder="Masukkan jumlah peralatan"
            />
            <Spacer height="h-6" />
            <div class="flex justify-center gap-2">
                <Button
                    @click="saveKantor"
                >
                    {{ selectedKantor.id == "" ? 'Tambah Kantor' : 'Update Kantor'}}
                </Button>
                <Button
                    @click="closeModal"
                    :type="ButtonType.Secondary"
                >
                    Batalkan
                </Button>
            </div>
        </div>
    </dialog>

    <!-- END OF DIALOG FOR KANTOR -->

    <!-- DIALOG FOR TKP -->
    <dialog 
        class="modal modal-bottom sm:modal-middle"
        :class="{ 'modal-open': showTkpModal }"
    >
        <div class="modal-box">
            <Text :typography="Typography.H2">
                {{ selectedTkp?.id == "" ? "Tambah TKP" : "Edit TKP" }}
            </Text>
            <Spacer height="h-6" />
            <TextField 
                v-model="selectedTkp.judul"
                label="Judul"
                placeholder="Masukkan judul kejadian"
            />
            <Spacer height="h-4" />
            <TextArea 
                v-model="selectedTkp.deskripsi"
                label="Deskripsi Kejadian"
                placeholder="Masukkan deskripsi kejadian"
            />
            <Spacer height="h-4" />
            <TextArea 
                v-model="selectedTkp.alamat"
                label="Alamat Kejadian"
                placeholder="Masukkan alamat kejadian"
            />
            <Spacer height="h-4" />
            <TextField 
                v-model:number="selectedTkp.lat"
                type="number"
                label="Latitude TKP"
                placeholder="Masukkan latitude TKP"
            />
            <Spacer height="h-4" />
            <TextField 
                v-model:number="selectedTkp.long"
                type="number"
                label="Longitude TKP"
                placeholder="Masukkan longitude TKP"
            />
            <Spacer height="h-6" />
            <div class="flex justify-center gap-2">
                <Button
                    @click="saveTkp"
                >
                    {{ selectedTkp.id == "" ? 'Tambah TKP' : 'Update TKP'}}
                </Button>
                <Button
                    @click="closeModal"
                    :type="ButtonType.Secondary"
                >
                    Batalkan
                </Button>
            </div>
        </div>
    </dialog>
    <!-- END OF DIALOG FOR TKP -->
</template>

<script setup lang="ts">
    import { Typography } from '~/components/attr/TextAttr';
    import { ButtonType } from '~/components/attr/ButtonAttr';
    import type { DropdownOption } from '~/components/attr/DropdownAttr';
    import type { GetRouteResponse } from '~/models/legacy/Data';

    definePageMeta({
        layout: "admin"
    })

    const kantorTableHeaders = ref([
        "",
        "Nama",
        "Latitude",
        "Longitude",
        "Jumlah Personel",
        "Jumlah Peralatan",
        ""
    ])
    const kantorData = useGetAllKantor()
    const showKantorModal = ref(false)
    const selectedKantor: Ref<Kantor, Kantor> = ref({...defaultKantor})

    const openKantorModal = (data: Kantor | null) => {
        if (data == null) {
            selectedKantor.value = {...defaultKantor}
        } else {
            selectedKantor.value = data
        }
        showKantorModal.value = true
    }

    const saveKantor = async () => {
        const isEdit = selectedKantor.value.id != ""
        const result = isEdit ? await useEditKantor(selectedKantor.value) : await useAddKantor(selectedKantor.value)
        if (isLeft(result)) {
            alert(unwrapEither(result))
        } else {
            const message = isEdit ? "Kantor Berhasil diubah" : "Kantor berhasil ditambahkan"
            alert(message)
        }
        closeModal()
    }

    const tkpTableHeaders = ref([
        "",
        "Judul",
        "Deskripsi",
        "Alamat",
        "Latitude",
        "Longitude",
        ""
    ])
    const tkpData = useGetAllTkp()
    const showTkpModal = ref(false)
    const selectedTkp: Ref<TKP, TKP> = ref({...defaultTkp})

    const openTkpModal = (data: TKP | null) => {
        if (data == null) {
            selectedTkp.value = {...defaultTkp}
        } else {
            selectedTkp.value = data
        }
        showTkpModal.value = true
    }

    const closeModal = () => {
        selectedKantor.value = {...defaultKantor}
        showKantorModal.value = false
        selectedTkp.value = {...defaultTkp}
        showTkpModal.value = false
    }

    const saveTkp = async () => {
        const isEdit = selectedTkp.value.id != ""
        const result = isEdit ? await useEditTkp(selectedTkp.value) : await useAddTkp(selectedTkp.value)
        if (isLeft(result)) {
            alert(unwrapEither(result))
        } else {
            const message = isEdit ? "TKP Berhasil diubah" : "TKP berhasil ditambahkan"
            alert(message)
        }
        closeModal()
    }

    useEventListener("keyup", (event: Event) => {
        if ((event as KeyboardEvent).code == "Escape") {
            showKantorModal.value = false
        }
    })

    const nodes = [2, 3, 4, 5]
    const selectedNodeIndex = ref(0)
    const selectedTkpIndex = ref(-1)
    const isMapReady = ref(false)
    const searchRouteLoading = ref(false)
    const selectedResult = ref<Data | null>()
    const map = ref()
    const polyline = ref()

    const selectedTkpForMap = computed(() => tkpData.value[selectedTkpIndex.value])
    const selectedNode = computed(() => nodes[selectedNodeIndex.value])
    const polylineCoordinates = computed(() => selectedResult.value?.coordinates)

    const nodeOptions = computed(() => nodes.map((node) => ({
        label: node.toString(),
        data: node
    } satisfies DropdownOption<number>)))

    const tkpOptions = computed(() => tkpData.value.map((tkp) => ({
        label: tkp.judul,
        data: tkp
    } satisfies DropdownOption<TKP>)))

    const setMapReady = () => { isMapReady.value = true }

    const fitPolylineBounds = () => {
        map.value.leafletObject.fitBounds(polyline.value.leafletObject.getBounds())
    }

    const searchRoute = async () => {
        if (!isMapReady.value) {
            alert('Tunggu map tampil!')
            return
        }

        searchRouteLoading.value = true
        const result = await useGetRoute(
            kantorData.value, 
            selectedTkpForMap.value, 
            selectedNode.value
        )

        if (isLeft(result)) {
            console.error(unwrapEither(result))
        } else {
            const routeResponse = unwrapEither(result) as GetRouteResponse
            selectedResult.value = {
                kantorTerdekat: routeResponse?.kantorTerdekat ?? {
                    lat: 0,
                    long: 0,
                    nama: '-'
                },
                distance: routeResponse?.distance ?? 0,
                coordinates: routeResponse?.coordinates ?? [],
                nodeTerdekat: routeResponse?.nodeTerdekat ?? [],
                duration: routeResponse?.totalDuration ?? 0,
                nodes: routeResponse?.nodes ?? []
            } satisfies Data
        }
        searchRouteLoading.value = false
    }
</script>