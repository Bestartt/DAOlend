<script setup lang="ts">
    import { Contract } from "~/utils/contract";
    import { useRouter } from "vue-router";

    let contract_address = ref("");
    let router = useRouter();

    let data = ref<any>(null);
    let not_found = ref(false);
    let has_joined = ref(false);

    let username = ref("");
    let loading = ref(false);
    let joinLoading = ref(false);
    let unions = ref(joined_unions.get());


    async function find() {
        loading.value = true;
        not_found.value = false;
        data.value = null;

        try {
            let contract = new Contract(contract_address.value);
            data.value = await contract.getData();    

            let members = await contract.getMembers();
            let signer = connection.getSigner();
            let address = await signer.getAddress();

            if (members.some(member => member.member == address)) {
                has_joined.value = true;
            }

        } catch (e) {
            not_found.value = true;
            console.error(e);
        }

        loading.value = false;
    }



    async function callJoin() {
        joinLoading.value = true;
        let contract = new Contract(contract_address.value);

        try {
            let user_address = connection.getCurrentUserAddress();
            await contract.createJoin(username.value);
            join_requests.add({address: contract_address.value, userAddress: user_address})
            router.push("/requests");

        } catch (e) {
            alert("Canceled or error. Make sure that you have logged to Metamask");
        }

        joinLoading.value = false;
        
    }

    async function add_to_joined_unions() {
        let user_address = connection.getCurrentUserAddress();
        joined_unions.add(contract_address.value);
        join_requests.add({"address": contract_address.value, "userAddress": user_address});
        unions.value = joined_unions.get();
    }

    onMounted(() => {
        connection.requestMetamask();
    })


</script>

<template>

    <div px-0 md:px-16 class="center">

        <full-loading :loading="joinLoading" />

        <div class="card card-body mt-26 md:w-500px md:px-5" v-auto-animate>
            <h3>Find organization</h3>

            <!-- input -->
            <div flex gap-3>
                <input v-model="contract_address" class="form-control" placeholder="enter contract address"/>
                <button class="btn btn-dark" @click="find()">find</button>
            </div>   

            


            <!-- results -->
            <div v-if="data !== null"  class="card card-body mt-5">

                <h4>{{ data.name }}</h4>
                <p>create: {{ data.ownerName }}</p>
            
                <template v-if="has_joined">
                    <b>You are already a member of the organization</b>


                    <div mt-3>
                        <router-link :to="`/unions/${contract_address}/`" class="btn btn-dark">
                            перейти
                        </router-link>

                        <button class="btn btn-dark ms-2" v-if="!unions.includes(contract_address)" @click="add_to_joined_unions()">
                            add to registry
                        </button>
                    </div>
                </template>

                <button v-else  class="btn btn-dark" data-bs-toggle="modal" data-bs-target="#join">
                    join
                </button>

            </div>

            <h5 v-if="not_found">Not found</h5>    

            <!-- loading -->
            <div class="spinner-border mt-[10%] ms-[50%]" role="status" v-if="loading">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>


        <!-- join modal -->
        <div class="modal fade" id="join">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5">create join request</h1>
                    <button class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <label class="form-label" for="quantity">Enter your name</label>
                    <input v-model="username" id="quantity" class="form-control">
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button class="btn btn-dark" data-bs-dismiss="modal" @click="callJoin()">Send</button>
                </div>
                </div>
            </div>
        </div>            


    </div>

</template>
