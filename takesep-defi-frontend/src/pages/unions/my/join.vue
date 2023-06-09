<script lang="ts" setup>
    import { get_my_union } from "~/localstorage";
    import { Contract } from "~/crypto";

    let address = get_my_union();
    let requests = ref<any[]>([]);
    
    
    if (address != null) {
        let contract = new Contract(address);
        contract.getJoinRequests().then(
            d => requests.value = d.filter(
                (request) => request[0] != "0x0000000000000000000000000000000000000000"
            )
        );

    }

    function approve(requestAddress: string) {
        // @ts-ignore
        let contract = new Contract(address);
        contract.approveJoinRequest(requestAddress);
    }


</script>

<template>

    <sidebar-wrapper>
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
                    Подтвердить 
                </button>
            </div>
        </template> 
    </sidebar-wrapper>

</template>
