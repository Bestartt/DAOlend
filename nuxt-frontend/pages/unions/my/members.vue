<script lang="ts" setup>
    import { Contract } from "~/utils/contract";
    definePageMeta({layout: "my-union"})

    let address = get_my_union();
    let contract: Contract;
    let members = ref([]);
    let updateLoading = ref(false);
    
    if (address != null) {
        contract = new Contract(address);
        contract.getMembers().then(d => members.value = d);
    }

    async function update() {
        updateLoading.value = true;
        members.value = await contract.getMembers();
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
                    </tr>
                </thead>

                <tbody>

                    <tr v-for="member in members">
                        <td>{{ member[2] }}</td>
                        <td>{{ member[0] }}</td>
                    </tr>
                </tbody>
            </table>              
        </div>
         
    </div>
     


</template>
