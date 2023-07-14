<script lang="ts" setup>
    let props = defineProps<{address: string}>();
    let address = props.address;
    let contract = new Contract(address);
    
    let loading = ref(false);
    let notif = useNotification();
    
    let { data, pending, refresh } = useAsyncData(async () => {
        let requests = await contract.getJoinRequests()
        return requests.filter(r => r[0] !== "0x0000000000000000000000000000000000000000");
    });


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
</script>

<template>
    <div>
        <div flex justify-between>
            <h4>Запросы на вступление</h4>
            <button class="btn btn-dark" @click="refresh()">обновить</button>
        </div>
        <br>

        <!-- loading -->
        <div class="w-full h-10vh flex justify-center items-center" v-if="pending">
            <div class="spinner-border" role="status">
                <span class="sr-only">Loading...</span>
            </div>            
        </div>

        <div v-if="data && data.length == 0 && !pending">
            <h2 text-gray>Пусто</h2>
        </div>

        <div v-if="!pending">
            <template v-for="request in data">
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
        
    </div>

</template>
