<template>
    <div>
        123
        <Test :message="parentMessage" @update="handleUpdate"></Test>
    </div>
</template>

<script setup>
import Test from '../components/Test.vue';
import { ref } from 'vue';
const parentMessage = ref('Hello from parent');

const handleUpdate = (newMessage) => {
    console.log('Received update from child:', newMessage);
};
</script>

<style lang="scss" scoped></style>