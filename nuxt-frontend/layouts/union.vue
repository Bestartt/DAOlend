<template>
    <main>
      <navbar />
      <notification></notification>

      <div px-24 px-md-32 block>
        <div>
            <div flex gap-12>
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

