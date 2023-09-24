<template>
    <div class="container">
        <div class="left">
            <span class="title">端州香水柠檬(康乐店)</span>
            <span class="location"></span>

            <span class="location"><van-icon name="location" /> 距离4.2km</span>
        </div>
        <div class="right">
            <van-tabs v-model:active="active" type="line" animated>
                <van-tab title="🛵配送"></van-tab>
                <van-tab title="🚚快递"></van-tab>
            </van-tabs>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
const checked = ref(true);

</script>

<style lang="scss" scoped>
.container {
    display: flex;
    margin-top: 10px;
}

.left {
    width: 40%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-left: 12px;
}

.title {
    color: var(--van-text-color);
    font-size: var(--van-font-size-lg);
}

.location {
    color: var(--van-text-color-3);
    font-size: 13px;

}

.right {
    display: flex;
    width: 60%;
    --van-tabs-line-height: 30px;
    align-items: center;
}
</style>