<script lang="ts" setup>
    import { Contract } from "~/utils/crypto";

    let route = useRoute();
    let address = route.params.address;
    let requests = ref<any[]>([]);
    let loading = ref(false);
    let notif = useNotification();
    
    if (address != null) {

        // @ts-ignore
        let contract = new Contract(address);
        contract.getJoinRequests().then(
            d => requests.value = d.filter(
                (request) => request[0] != "0x0000000000000000000000000000000000000000"
            )
        )

    }

    function approve(requestAddress: string) {
        loading.value = true;
        // @ts-ignore
        let contract = new Contract(address);
        contract.approveJoinRequest(requestAddress);
        loading.value = false;
        notif.notify("Транзакция в очереди", "скоро вы будете в списке подтвердивших");
    }


</script>

<template>
    <sidebar-wrapper>
        <h3 mt-5>Запросы на вступление</h3>

        <template v-for="request in requests">
            <div max-w-500px class="card card-body">
                <h3>{{ request[1] }}</h3>

                <i>адрес: {{ request[0] }}</i>
                
                <b v-if="request[2].length == 0">никто не подтвердил</b>

                <ul v-else>
                    <li v-for="member in request[2]">{{ member }}</li>
                </ul>    
                
                <button class="btn btn-dark" @click="approve(request[0])">
                    <button-loading :loading="loading">Подтвердить</button-loading>
                </button>
            </div>
        </template>        
    </sidebar-wrapper>



</template>
