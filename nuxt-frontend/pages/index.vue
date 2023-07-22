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
      notif.notify("Не удалось подключить Metamask", "похоже вы отменили");
    }

    loading.value = false;
  }

</script>


<template>
    <main>

      <div>

        <!-- title -->
        <h1 mt-24>Takesep DeFi</h1>
        <h3>Платформа для кредитных организации</h3>
        <span>Введите свои отчеты прозрачно через блокчейн</span>
    
        <br>

        <!-- connect to metamask -->
        <div mt-3 v-if="!metamask_connected">
          <hr>
          <b>Войдите в свой Metamask прежде чем начать</b>
          <br>
          <button class="btn btn-dark mt-2" @click="connectMetamask()">
            <button-loading :loading="loading">
              подключить метамаск
            </button-loading>
          </button>
        </div>

        <!-- my orgranization link -->
        <nuxt-link 
            :to="`/unions/${my_union_address}/`" 
            v-if="my_union_exists && metamask_connected" 
            class="btn btn-outline-dark mt-3"
        >
          перейти к моей организации
        </nuxt-link>
   
      </div>  
    
      
      <!-- options -->
      <h3 mt-24>С чего начать?</h3>
    
      <div>
        <div max-w-800px class="row gap-2">

          <!-- create own -->
          <div class="col-5 card card-body">
            <p class="card-text">
              Хотите использовать собственную систему?
              создайте свою организацию за пару кликов        
            </p>
  
          
            <nuxt-link prefetch to="/unions/create" class="btn btn-dark">создать</nuxt-link>
          </div>
    
          <!-- find -->
          <div class="col-5 card card-body">
            <p class="card-text">
              Или можете вступить в другую организацию. Просто введите адрес организации
            </p>
    
            <nuxt-link prefetch to="/unions/search" class="btn btn-dark">найти</nuxt-link>
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

