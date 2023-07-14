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

        <div v-if="!pending" v-auto-animate>
            <template v-for="request in data">
                <div max-w-700px class="card">
                    <div class="card-header flex justify-between items-center">
                        <div>
                            <span tex-gray text-sm>Имя: </span>
                            <h5>{{ request[1] }}</h5>
                        </div>

                        <i text-gray>адрес: {{ request[0] }}</i>

                    </div>
                    
                    <div class="card-body">
                        <b v-if="request[2].length == 0" class="text-gray">пока никто не подтвердил</b>
                        
                        <div v-else>
                            <b>подтвердившие члены</b>
                            <ul>
                                <li v-for="member in request[2]">{{ member }}</li>
                            </ul>    
                        </div>
                        <br>    
                        <button max-w-200px class="btn btn-dark mt-3" @click="approve(request[0])">
                            <button-loading :loading="loading">Подтвердить</button-loading>
                        </button>
                    </div>
                </div>
            </template>             
        </div>
        
    </div>

</template>
