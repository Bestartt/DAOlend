<script setup lang="ts" generic="T extends any, O extends any">
  let my_union_address = my_union.get();
  let my_union_exists = ref(false);
  let metamask_connected = ref(false);
  let notif = useNotification();
  let loading = ref(false);

  onBeforeMount(async () => {
    my_union_exists.value = await connection.contractExists(my_union_address);
  });

  onMounted(async () => {
    metamask_connected.value = await connection.isConnected();
  })

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
    <div text-center flex flex-col items-center>
      <div>
        <h1 mt-24>Takesep DeFi</h1>
        <h3>Платформа для кредитных организации</h3>
        <span>Введите свои отчеты прозрачно через блокчейн</span>
    
        <br>

        <template v-if="!metamask_connected">
          <hr>
          <b>Войдите в свой Metamask прежде чем начать</b>
          <br>
          <button class="btn btn-dark mt-2" @click="connectMetamask()">
            <button-loading :loading="loading">
              подключить метамаск
            </button-loading>
          </button>
        </template>

        <nuxt-link 
          mt-3
          :to="`/unions/${my_union_address}/`" 
          v-if="my_union_exists && metamask_connected" 
          class="btn btn-outline-dark">перейти к моей организации
        </nuxt-link>
   
      </div>  
    
      <br>
    
    
      <h3 mt-24>С чего начать?</h3>
    
      <div>
        <div max-w-800px class="row gap-2">
          <div class="col-12 col-md-5 card card-body">
            <p class="card-text">
              Хотите использовать собственную систему?
              создайте свою организацию за пару кликов        
            </p>
    
          
            <nuxt-link prefetch to="/unions/create" class="btn btn-dark">создать</nuxt-link>
          </div>
    
          <div class="col-5 card card-body">
            <p class="card-text">
              Или можете вступить в другую организацию. Просто введите адрес организации
            </p>
    
            <nuxt-link prefetch to="/unions/search" class="btn btn-dark">найти</nuxt-link>
          </div>
        </div> 
      </div>        
    </div>
    
</template>
