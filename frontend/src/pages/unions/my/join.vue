<script lang="ts" setup>
    import { get_my_union } from "~/localstorage";
    import { Contract } from "~/crypto";
    import { useNotification } from "~/store";

    let address = get_my_union();
    let requests = ref<any[]>([]);
    let loading = ref(false);
    let notif = useNotification();
    
    
    if (address != null) {
        let contract = new Contract(address);
        contract.getJoinRequests().then(
            d => requests.value = d.filter(
                (request) => request[0] != "0x0000000000000000000000000000000000000000"
            )
        );

    }

    async function approve(requestAddress: string) {
        loading.value = true;
        // @ts-ignore
        let contract = new Contract(address);
        await contract.approveJoinRequest(requestAddress);
        loading.value = false;
        notif.notify("Транзакция в очереди", "скоро вы будете в списке подтвердивших");
    }


</script>

<template>

    <my-sidebar-wrapper>
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
    </my-sidebar-wrapper>

</template>
