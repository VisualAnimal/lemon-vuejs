<template>
    <div class="container">
        <div class="left">
            <span class="title">端州香水柠檬(康乐店)</span>
            <span class="location"></span>

            <div class="description">
                <span class="location"><van-icon name="location" /> 距离4.2km</span>
                <span class="location"><van-icon name="phone" />/<van-icon name="wechat" /> 13028809527</span>
            </div>
        </div>
        <div class="right">
        </div>
    </div>
    <!-- <div class="tab">
        <van-tabs v-model:active="active" type="line" animated>
            <van-tab title="🛵配送"></van-tab>
            <van-tab title="🚚快递"></van-tab>
        </van-tabs>
    </div> -->
</template>

<script setup>
import { ref } from 'vue';
const checked = ref(true);

</script>

<style lang="scss" scoped>
.container {
    display: flex;
    padding: 10px 0px;
    width: 100%;
}

.left {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-left: 12px;
}

.title {
    color: var(--van-text-color);
    font-size: 19px;
    font-weight: bold;
}

.location {
    color: var(--van-text-color-3);
    font-size: 13px;
    margin-right: 10px;
    margin-top: 3px;
}

.description {
    display: flex;
}

.right {
    display: flex;
    --van-tabs-line-height: 30px;
    align-items: center;
}
</style>