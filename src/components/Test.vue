<template>
    <div>
      <p>{{ message }}</p>
      <button @click="updateParent">Update Parent</button>
    </div>
  </template>
  
  <script setup>
  import { ref, defineProps, defineEmits } from 'vue';
  
  const { message } = defineProps(['message']);
  const emit = defineEmits(['update']);
  
  const updateParent = () => {
    emit('update', 'Hello from child');
  };
  </script>
  