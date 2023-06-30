<script setup lang="ts">
    let loading = ref(false);
    let router = useRouter();

    let union_name = ref("");
    let owner_name = ref("");

    let member_id = ref("");
    let member_name = ref("");

    let members = ref<string[]>([]);
    let memberNames = ref<string[]>([]);

    let notif = useNotification();
    

    function addMember() {
        members.value.push(member_id.value); 
        memberNames.value.push(member_name.value);
        member_id.value = '';
        member_name.value = '';
    }

    async function create() {
        loading.value = true;

        try {
            connection.getProvider();
            connection.getSigner();

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

    onMounted(async () => {
        let myUnionExists = await contractExists(get_my_union());
        if (myUnionExists) {
            notif.notify(
                "У вас уже есть организация!", 
                "нажмите на 'организации' в меню и перейдите в 'моя организация'"
            )
        }
    })

</script>


<template>
    <div flex flex-col items-center>
        <h3 mt-10>Создать организацию</h3>

        <div max-w-600px>
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

            <button mt-5 @click="create()" class="btn btn-dark">
                <template v-if="loading">
                    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    ожидание...
                </template>
                <template v-else>
                    создать
                </template>
            </button>

        </div>        
    </div>
    <!-- alert -->
 

</template>
