<script setup lang="ts">
  let my_union_address = my_union.get();

  let my_union_exists = ref(false);
  let metamask_connected = ref(false);

  let notif = useNotification();
  

  onBeforeMount(async () => {
    my_union_exists.value = await connection.contractExists(my_union_address);
  });

  onMounted(async () => {
    metamask_connected.value = await connection.isConnected();
  })


  let loading = ref(false);
  async function connectMetamask() {
    loading.value = true;

    try {
      await connection.requestMetamask();
      metamask_connected.value = true;
    } catch(e) {
      notif.notify("Could not connect to Metamask", "looks like it was canceled");
    }

    loading.value = false;
  }

</script>


<template>
    <main>

      <div>

        <!-- title -->
        <h1 mt-24>DAOlend</h1>
        <h3>Connecting Wallets to Profits - <br> Your Bridge to the Future of Finance</h3>
    
        <br>

        <!-- connect to metamask -->
        <div mt-3 v-if="!metamask_connected">
          <hr>
          <b>Enter your Metamask wallet before enter</b>
          <br>
          <button class="btn btn-dark mt-2" @click="connectMetamask()">
            <button-loading :loading="loading">
              connect metamask
            </button-loading>
          </button>
        </div>

        <!-- my orgranization link -->
        <nuxt-link 
            :to="`/unions/${my_union_address}/`" 
            v-if="my_union_exists && metamask_connected" 
            class="btn btn-outline-dark mt-3"
        >
          go to my organization
        </nuxt-link>
   
      </div>  
    
      
      <!-- options -->
      <h3 mt-24>What is next?</h3>
    
      <div>
        <div max-w-800px class="row gap-2 mb-3">

          <!-- create own -->
          <div class="col-12 col-md-5 card card-body">
            <p class="card-text">
              Want to create own osystem? Create your own organization in few clicks
            </p>
  
          
            <nuxt-link prefetch to="/unions/create" class="btn btn-dark">create</nuxt-link>
          </div>
    
          <!-- find -->
          <div class="col-12 col-md-5 card card-body">
            <p class="card-text">
              Or you can join another organization. Just type organization address
            </p>
    
            <nuxt-link prefetch to="/unions/search" class="btn btn-dark">find</nuxt-link>
          </div>
        </div> 
      </div>        
    </main>
    
</template>


<style scoped>
  main {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>

