<template>
  <div>
    <!-- header -->
    <div class="text-primary font-semibold text-2xl">Welcome!</div>
    <div class="h-[2px] w-full bg-primary/20 rounded-xl my-4"></div>
    <!-- content -->
  </div>
</template>

<script>
export default {
  setup(){
    definePageMeta({
      middleware: ['auth']
    })
  }
};
</script>
