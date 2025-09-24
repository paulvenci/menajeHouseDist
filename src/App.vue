<template>
  <v-app>
    <template v-if="layout === 'default'">
      <TopBar :section-name="sectionName" />
      <SideMenu />
    </template>

    <v-main class="app-main">
      <router-view fluid class="pa-4" />
    </v-main>
  </v-app>
</template>


<script setup
  lang="ts">
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'
  import TopBar from '@/components/TopBar.vue'
  import SideMenu from '@/components/SideMenu.vue'

  const route = useRoute()

  const layout = computed(() => route.meta.layout ?? 'default')
  const sectionName = computed(() => route.meta.section ?? 'Inicio')

</script>

<style>
html,
body,
#app {
  height: 100%;
  margin: 0;
  overflow: hidden;
  /* evita scrollbar innecesario */
}

.v-application {
  height: 100%;
}

.app-main {
  height: 100%;
  /* 👈 asegúrate de que ocupe toda la altura */
  overflow-y: auto;
  /* scroll si hay mucho contenido */
}
</style>