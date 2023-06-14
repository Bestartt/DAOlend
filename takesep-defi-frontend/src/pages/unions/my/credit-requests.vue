<script setup lang="ts">
    import { get_my_union } from "~/localstorage";
    import { Contract } from "~/crypto";


    let address = get_my_union();
    let data = ref<any>(null);
    
    
    if (address != null) {
        let contract = new Contract(address);
        contract.getCreditRequests().then(d => data.value = d);
    }

    function approve(id) {
        // @ts-ignore
        let contract = new Contract(address);
        contract.approveCreditRequest(id)
    }

    async function getMemberName(member_address: string) {

        // @ts-ignore
        let contract = new Contract(address);
        return (await contract.getMember(member_address)).name
        
        // .then((member) => {
        //     return member.name
        // });          
    }


</script>

<template>

    <my-sidebar-wrapper>
        <h4>Заявки на кредит</h4>
        <br>

        <div v-if="data.length == 0">
            <h2 text-gray>Пусто</h2>

        </div>

        <template v-for="credit_request in data">
            <div class="card card-body" max-w-400px>
                <p>
                    заемщик: {{ credit_request[1] }} <br>
                    сумма: {{ credit_request[2] }} <br>
                    срок: {{ credit_request[3] }} <br>
                    подтвердившие участники: 
                    <ol>
                        <li v-for="member in credit_request[4]">
                            {{ getMemberName(member) }}
                        </li>
                    </ol>               

                </p>


                <button @click="approve(credit_request[0])" class="btn btn-dark">подтвердить</button>

            </div>
        </template>        
    </my-sidebar-wrapper>

</template>
