<script setup lang="ts">
    let loading = ref(false);
    let router = useRouter();
    let notif = useNotification();

    let union_name = ref("");
    let owner_name = ref("");


    let members = reactive({
        address: "",
        name: "",
        addresses: [],
        names: []
    })


    function addMember() {
        members.addresses.push(members.address); 
        members.names.push(members.name);
        
        members.name = ''; members.address = '';

    }

    function removeMember(index) {
        members.addresses.splice(index, 1);
        members.names.splice(index, 1);
    }


    async function create() {
        loading.value = true;

        try {
            connection.requestMetamask();

            let address = await createContract(
                union_name.value, 
                members.addresses, 
                members.names,
                owner_name.value,
            );

            my_union.set(address);

            created_unions.add({
                name: union_name.value,
                owner_name: owner_name.value,
                date: new Date().toISOString(),
                network: await connection.getNetwork(),
                address: address
            });

            router.push(`/unions/${address}/`);

        } catch(e) {
            console.error(e);
            alert("Canceled or error. Make sure that you have logged to Metamask");
        } 

        loading.value = false; 

    }

    onMounted(async () => {
        let myUnionExists = await connection.contractExists(my_union.get());
        if (myUnionExists) {
            notif.notify(
                "You already have organization!", 
                "Click 'organizations' on top bar then click 'my organization'"
            )
        }
    })

</script>


<template>
    <div flex flex-col items-center>
        

        <div class="card card-body form">
            <h3>create organization</h3>

            <!-- basic info form -->
            <input v-model="union_name" class="form-control" placeholder="organization name">
            <input v-model="owner_name" class="form-control mt-3" placeholder="your name">

            <label mt-5 for="member_id" class="form-label">Add members</label>

            <!-- add member_addresses -->

            <div flex gap-2>
                <input  v-model="members.address" class="form-control" placeholder="address">
                <input v-model="members.name" class="form-control" placeholder="name">

                <button @click="addMember()" class="btn btn-dark">add</button>
            </div>

            <div class="form-text">
                Enter the address of a member in the network
            </div>        


            <!-- members list -->
            <div class="card no-shadow" mt-3>
                <ul class="list-group list-group-flush">

                    <li v-for="(address, i) in members.addresses" class="list-group-item">
                        <div flex justify-between>
                            <b>{{ members.names[i] }} </b>
                            <button @click="removeMember(i)"  class="btn btn-danger btn-sm">
                                delete
                            </button>
                        </div>

                        <span class="text-gray text-sm">
                           {{ address }}  
                        </span>
                    </li>                     
                </ul>
            </div>


            <button mt-5 @click="create()" class="btn btn-dark">
                <button-loading :loading="loading">create</button-loading>
            </button>

        </div>        
    </div>
</template>


<style>
    .form {
        max-width: 700px;
        margin-top: 4rem;
        padding: 2.5rem;
    }
</style>
