<script lang="ts" setup>
    let props = defineProps<{address: string}>();
    let address = props.address;
    
    let requests = ref<any[]>([]);
    let loading = ref(false);
    let dataLoading = ref(false);

    let notif = useNotification();
    

    async function approve(requestAddress: string) {
        loading.value = true;
        // @ts-ignore
        try {
            let contract = new Contract(address);
            await contract.approveJoinRequest(requestAddress);
            notif.notify("Транзакция в очереди", "скоро вы будете в списке подтвердивших");            
        } catch (e) {
            alert("отменена или ошибка")
        } finally {
            loading.value = false;
        }
    }
    
    async function update() {
        dataLoading.value = true;
        let contract = new Contract(address);
        let data = await contract.getJoinRequests();
        requests.value = data.filter((request) => request[0] != "0x0000000000000000000000000000000000000000");
        dataLoading.value = false;
    }

    onMounted(update);
</script>

<template>
    <div>
        <div flex justify-between>
            <h4>Запросы на вступление</h4>
            <button class="btn btn-dark" @click="update()">обновить</button>
        </div>
        <br>

        <!-- loading -->
        <div class="w-full h-10vh flex justify-center items-center" v-if="dataLoading">
            <div class="spinner-border" role="status">
                <span class="sr-only">Loading...</span>
            </div>            
        </div>

        <div v-if="requests && requests.length == 0 && !loading">
            <h2 text-gray>Пусто</h2>
        </div>

        <template v-for="request in requests">
            <div max-w-500px class="card card-body">
                <span tex-gray>Имя: </span>
                <h4>{{ request[1] }}</h4>

                <i>адрес: {{ request[0] }}</i>
                
                <b v-if="request[2].length == 0">никто не подтвердил</b>

                <ul v-else>
                    <li v-for="member in request[2]">{{ member }}</li>
                </ul>    
                
                <br>
                <button max-w-200px class="btn btn-dark" @click="approve(request[0])">
                    <button-loading :loading="loading">Подтвердить</button-loading>
                </button>
            </div>
        </template>         
    </div>

</template>
