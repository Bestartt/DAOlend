<script setup lang="ts">
    let requests = join_requests.get();
    let unions = ref<any[]>([]);
    import autoAnimate from "@formkit/auto-animate";

    const union_list = ref();


    onMounted(async () => {
        unions.value = await getRequestsData(requests);
        autoAnimate(union_list.value);
    })

    function remove(index: number) {
        unions.value.splice(index, 1);
        join_requests.remove(index);
    }

</script>

<template>

    <div class="center px-12 py-6">
        <div class="min-w-430px flex justify-between">
            <h4>Ваши запросы</h4>
            <button @click="join_requests.clear(); unions = []" class="btn btn-danger">очистить</button>
        </div>
        
        <div ref="union_list">
            <div v-for="(union, i) in unions" class="card card-body mt-3 max-w-700px">
                <div flex justify-between>
                    <h3>{{ union.name }}</h3>
                    <button class="btn-close btn-sm" @click="remove(i)"></button>
                </div>
                

                <p>основатель: {{ union.ownerName }}</p>
                <p>адрес: {{ union.address }}</p>

                <p>статус: 
                    <span v-if="union.joined" text-green>
                        <span class="badge rounded-pill text-bg-success">вы вступили</span>
                    </span>
                    <span v-else>
                        <span class="badge rounded-pill text-bg-warning">ожидание</span>
                    </span>
                </p>

                <router-link 
                    :to="`/unions/${union.address}/`" 
                    class="btn btn-dark" 
                    v-if="union.joined"
                >
                    перейти
                </router-link>
            </div>            
        </div>


    </div>

</template>
