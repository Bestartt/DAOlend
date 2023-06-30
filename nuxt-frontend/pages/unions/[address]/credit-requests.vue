<script setup lang="ts">
    import { Contract } from "~/utils/crypto";

    definePageMeta({layout: "union"})


    let route = useRoute();
    let address = route.params.address;

    let credit_requests = ref<any>([]);


    function approve(id) {
        // @ts-ignore
        let contract = new Contract(address);
        contract.approveCreditRequest(id)
    }


    onMounted(async() => {
        let contract = new Contract(address);
        let _data = await contract.getCreditRequests();
        
        var data = _data.map(function(obj) {
            var newObj = Object.assign({}, obj); // Create a new object
            return newObj;
        });

        for (let i = 0; i < data.length; i++) {
            const membersAddresses = data[i].approvedMembers;
            let members = [];

            for (let x = 0; x < membersAddresses.length; x++) {
                let member = await contract.getMember(membersAddresses[x] );
                members.push(member);                
            }

            // @ts-ignore
            data[i].members = members;
            
        }

        credit_requests.value = data;
    })


</script>

<template>
    <div>
        <h4>Заявки на кредит</h4>
        <br>

        <div v-if="credit_requests.length == 0">
            <h2 text-gray>Пусто</h2>

        </div>

        <template v-for="credit_request in credit_requests">
            <div class="card card-body" max-w-400px>
                <p>
                    заемщик: {{ credit_request.deptor }} <br>
                    сумма: {{ credit_request.amount }} <br>
                    срок: {{ credit_request.term }} <br>
                    подтвердившие участники: 
                    <ol>
                        <li v-for="member in credit_request.members">
                            {{ member.name }}
                        </li>
                    </ol>               

                </p>


                <button @click="approve(credit_request[0])" class="btn btn-dark">подтвердить</button>

            </div>
        </template>          
    </div>
      

</template>
