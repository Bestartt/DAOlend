<script lang="ts" setup>
    import { get_my_union } from "~/localstorage";
    import { Contract } from "~/crypto";

    let address = get_my_union();
    let contract: Contract;
    let members = ref();

    
    if (address != null) {
        contract = new Contract(address);
        contract.getMembers().then(d => members.value = d);
    }


</script>

<template>

    <sidebar-wrapper>
        <h4>Участники организации</h4>
        <span text-gray>и их вложения</span>

        <br>

        <table class="table table-striped" min-w-400px max-w-800px mt-5>
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
    </sidebar-wrapper>

</template>
