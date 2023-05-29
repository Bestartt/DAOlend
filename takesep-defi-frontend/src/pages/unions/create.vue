<script setup lang="ts">
    import { createContract } from '~/crypto';
    import { useRouter } from 'vue-router';
    import { set_my_union, get_my_union } from '~/localstorage';

    let loading = ref(false);
    let router = useRouter();

    let union_name = ref("");
    let owner_name = ref("");

    let member_id = ref("");
    let member_name = ref("");

    let members = ref<string[]>([]);
    let memberNames = ref<string[]>([]);
    


    function addMember() {
        members.value.push(member_id.value); 
        memberNames.value.push(member_name.value);
        member_id.value = '';
        member_name.value = '';
    }

    async function create() {
        loading.value = true;

        try {
            let address = await createContract(
                union_name.value, 
                members.value, 
                memberNames.value,
                owner_name.value,
            );

            set_my_union(address);
            router.push("/unions/my");

        } catch(e) {
            console.error(e);
            alert("Отменена или ошибка. Удостовертесь что вы вошли в свой Metamask");
        } finally {
            loading.value = false; 
        }

    }
</script>


<template>

    <!-- alert -->
    <div 
        v-if="get_my_union !== null" 
        class="alert alert-warning"
    >
        У вас уже есть организация. 
        <router-link to="/my-union">перейти</router-link>
    </div>



    <h3 mt-5>Создать организацию</h3>

    <div max-w-700px>
        <input type="text" v-model="union_name" class="form-control" placeholder="имя вашей организации">
        <input type="text" v-model="owner_name" class="form-control mt-3" placeholder="ваше имя">

        <label mt-5 for="member_id" class="form-label">Добавить участников</label>

        <div flex gap-2>
            <input 
                type="text" 
                v-model="member_id" 
                class="form-control" 
                placeholder="адрес" 
                id="member_id"
            >

            <input 
                type="text" 
                v-model="member_name" 
                class="form-control" 
                placeholder="имя" 
                id="member_name"
            >

            <button @click="addMember()" class="btn btn-dark">Добавить</button>
        </div>

        <div class="form-text">
            Введите адрес счета участника в сети ethereum
        </div>        


        <ul mt-3>
           <li v-for="(member, i) in members">
                {{ i + 1 }}. {{ member }} - {{ memberNames[i] }}
            </li> 
        </ul>

        <button mt-5 @click="create()" class="btn btn-dark">создать</button>

    </div>
    
    <h3 v-if="loading">ожидаем ваше подтверждение...</h3>

</template>
