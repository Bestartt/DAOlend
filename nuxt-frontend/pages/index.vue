<script setup lang="ts" generic="T extends any, O extends any">
  let my_union_address = get_my_union();
  let my_union_exists = ref(false);

  onBeforeMount(async () => {
    my_union_exists.value = await contractExists(my_union_address);
  })

</script>


<template>
    <div text-center flex flex-col items-center>
      <div>
        <h1 mt-24>Takesep DeFi</h1>
        <h3>Платформа для кредитных организации</h3>
        <span>Введите свои отчеты прозрачно через блокчейн</span>
    
        <br>
        <nuxt-link 
          mt-3
          to="unions/my" 
          v-if="my_union_exists" 
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
    
          
            <nuxt-link to="/unions/create" class="btn btn-dark">создать</nuxt-link>
          </div>
    
          <div class="col-5 card card-body">
            <p class="card-text">
              Или можете вступить в другую организацию. Просто введите адрес организации
            </p>
    
            <nuxt-link to="/unions/search" class="btn btn-dark">найти</nuxt-link>
          </div>
        </div> 
      </div>        
    </div>
    
</template>
