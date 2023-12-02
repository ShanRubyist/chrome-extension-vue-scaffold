<template>
  <div>
    {{ message }}
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const message = ref("Hello Vue!");
</script>
