<script lang="ts" setup>
    definePageMeta({layout: "my-union"})

    let address = get_my_union();
    let requests = ref<any[]>([]);
    let loading = ref(false);
    let notif = useNotification();
    

    async function approve(requestAddress: string) {
        loading.value = true;
        // @ts-ignore
        let contract = new Contract(address);
        await contract.approveJoinRequest(requestAddress);
        loading.value = false;
        notif.notify("Транзакция в очереди", "скоро вы будете в списке подтвердивших");
    }

    onMounted(async () => {
        let contract = new Contract(address);
        let data = await contract.getJoinRequests();
        requests.value = data.filter((request) => request[0] != "0x0000000000000000000000000000000000000000");
    })


</script>

<template>
    <div>
        <h4>Запросы на вступление</h4>
        <br>

        <div v-if="requests && requests.length == 0">
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
                <button class="btn btn-dark" @click="approve(request[0])">
                    <button-loading :loading="loading">Подтвердить</button-loading>
                </button>
            </div>
        </template>         
    </div>

</template>
