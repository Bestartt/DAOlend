<template>
    <main>
      <navbar />
      <notification></notification>

      <div px-3 md:px-16 lg:pe-36 block bg-gray-1 min-h-90vh>
        <div>
            <div flex gap-2 md:gap-4 lg:gap-8>
                <union-menu></union-menu>

                <div class="content" mt-4>
                    <slot />
                </div>

            </div>
        </div>
      </div>
      
      <footer />
    </main>


</template>


<style .scoped>
    .content {
        display: block;
        width: 100%;
    }
</style>

