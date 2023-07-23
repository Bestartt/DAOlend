<script setup lang="ts">
    import { onClickOutside } from '@vueuse/core';


    const route = useRoute();
    let props = defineProps<{isOpen: boolean}>();
    let emit = defineEmits(["onClose"]);
    let loading = ref(false);

    let myUnionExists = ref(false);
    const dialog = ref();
    let requests = join_requests.get();
    let unions = ref<any[]>([]);
    let network = ref("");


    async function getOrganizationData() {
        loading.value = true;
        let joinRequests = await getJoinRequests(requests);
        unions.value = joinRequests.filter(request => request.joined);
        myUnionExists.value = await connection.contractExists(my_union.get());    
        loading.value = false; 
    }

    function update() {
        getOrganizationData();
    }

    onMounted(async () => {
        getOrganizationData();
        let network_name = (await connection.getNetwork()).name;

        if (network_name == "unknown") {
            network.value = "локальная"
        }else if (network_name == "homestead") {
            network.value = "ethereum"
        } else {
            network.value = network_name
        }
    })


    onClickOutside(dialog, (e) => {
        emit("onClose");
    });

   
    watch(route, value => {
        emit("onClose");
        }, {deep: true, immediate: true}
    )

</script>

<template>
    <Teleport to="body">
        <div :class="{'my-modal': true, 'my-modal-active': props.isOpen}">
            <div ref="dialog"  :class="{'my-modal-dialog': true, 'my-dialog-active': props.isOpen}">
                <div flex justify-end>
                    <button @click="$emit('onClose')"  class="btn btn-close"></button>
                </div>
                <div px-10 py-1 pb-10>

                    <spinner :pending="loading"></spinner>

                    <!-- my union -->
                    <template v-if="myUnionExists">
                        <h4>
                            <nuxt-link prefetch :to="`/unions/${my_union.get()}/`" class="dark-link">
                               моя организация
                            </nuxt-link >
                        </h4>
                        <i text-gray>{{ my_union.get() }}</i>
                        <hr>
                    </template>

                    <!-- unions list -->
                    <template v-for="union in unions">
                        <h4>
                            <nuxt-link 
                                :to="`/unions/${union.address}/`" 
                                    class="dark-link"
                                >
                                {{ union.name }}
                            </nuxt-link>
                        </h4>

                        <i text-gray>{{ union.address }}</i>

                        <hr>
                    </template>
                    <br>

                    <button class="btn btn-dark" @click="update()">обновить</button>              
                </div>

            </div>
        </div>
    </Teleport>

</template>
