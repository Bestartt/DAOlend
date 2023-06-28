<script setup lang="ts">
    import { getRequestsData } from '~/crypto';

    import { get_join_requests, clear_join_requests } from '~/localstorage';
    

    let requests = get_join_requests();
    let unions = ref<any[]>([]);


    onMounted(async () => {
        unions.value = await getRequestsData(requests);
    })


</script>

<template>

    <div px-16 py-6>
        <div flex justify-between>
            <h4>Ваши запросы на вступление</h4>
            <button @click="clear_join_requests(); unions = []" class="btn btn-danger">очистить</button>
        </div>
        

        <div v-for="union in unions" mt-3 max-w-600px class="card card-body">
            <h3>{{ union.name }}</h3>

            <p>основатель: {{ union.ownerName }}</p>
            <p>адрес: {{ union.address }}</p>

            <p>статус: 
                <span v-if="union.joined" text-green>вы вступили</span>
                <span v-else>ожидание</span>
            </p>

            <router-link 
                :to="`/unions/${union.address}`" 
                class="btn btn-dark" 
                v-if="union.joined"
            >
                перейти
            </router-link>
        </div>

    </div>

</template>
