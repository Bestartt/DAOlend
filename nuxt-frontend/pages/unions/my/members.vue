<script lang="ts" setup>
    import { Contract } from "~/utils/contract";
    definePageMeta({layout: "my-union"})

    let address = my_union.get();
    let contract: Contract;
    let members = ref([]);
    let membersAddresses = ref([]);

    let updateLoading = ref(false);
    
    if (address != null) {
        contract = new Contract(address);
        contract.getMembers().then(d => members.value = d);
    }

    async function update() {
        updateLoading.value = true;
        members.value = await contract.getMembers();
        membersAddresses.value = await contract.getMemberAddresses();
        updateLoading.value = false;
    }


</script>

<template>
    <div>
        <div flex justify-between>
            <h4>Участники организации</h4>

            <button class="btn btn-dark" @click="update()">
                обновить
            </button>
        </div>
        
        <span text-gray>и их вложения</span>

        <br>

        <div class="card card-body max-w-800px mt-3">
            <table class="table table-hover min-w-400px max-w-800px">
                <thead>
                    <tr>
                        <th>Имя</th>
                        <th>Вложение</th>
                        <th>Адрес</th>
                    </tr>
                </thead>

                <tbody>

                    <tr v-for="(member, i) in members">
                        <td>{{ member[2] }}</td>
                        <td>{{ member[0] }}</td>
                        <td>{{ membersAddresses[i] }}</td>
                    </tr>
                </tbody>
            </table>              
        </div>
         
    </div>
     


</template>
