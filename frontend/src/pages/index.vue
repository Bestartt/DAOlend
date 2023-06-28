<script setup lang="ts" generic="T extends any, O extends any">
  import { get_my_union } from '~/localstorage';
  import { contractExists } from '~/crypto';


  let my_union_address = get_my_union();
  let my_union_exists = ref(false);

  onBeforeMount(async () => {
    my_union_exists.value = await contractExists(my_union_address);
  })

</script>

<template>

  <notification></notification>  

  <div>
    <h1 mt-24>Takesep DeFi</h1>
    <h3>Платформа для кредитных организации</h3>
    <span>Введите свои отчеты прозрачно через блокчейн</span>


    <div flex gap-2 mt-3  v-if="my_union_exists">
      <router-link to="unions/my" class="btn btn-outline-dark">перейти к моей организации</router-link>
    </div>    
  </div>  

  <br>


  <h3 mt-24>С чего начать?</h3>

  <div flex>
    <div max-w-800px class="row gap-2">
      <div class="col-5 card card-body">
        <p class="card-text">
          Хотите использовать собственную систему?
          создайте свою организацию за пару кликов        
        </p>

      
        <router-link to="/unions/create" class="btn btn-dark">создать</router-link>
      </div>

      <div class="col-5 card card-body">
        <p class="card-text">
          Или можете вступить в другую организацию. Просто введите адрес организации
        </p>

        <router-link to="/unions/search" class="btn btn-dark">найти</router-link>
      </div>
    </div> 
  </div>

  
    
</template>
