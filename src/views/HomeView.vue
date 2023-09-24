<template>
  <Header></Header>
  <!-- <van-nav-bar title="标题" /> -->
  <br>
  <div class="container">
    <div class="left">
      <van-sticky>
        <van-sidebar v-model="active" v-if="responseData.value">
          <van-sidebar-item v-for="item in responseData.value" :title="item.name" :key="item._id" />
        </van-sidebar>
      </van-sticky>
    </div>
    <div class="right">
      <!-- 使用v-for迭代渲染每个产品的卡片 -->
      <van-card v-for="product in products.value" :price="product.price" :desc="product.description" :title="product.name"
        :thumb="'http://45.207.55.130:3000/xiaoman/' + product.imageUrl">

        <template #tags>
          <template v-for="tag in product.tags">
            <van-tag class="tag" plain type="primary">{{ tag }}</van-tag>
          </template>
          <van-tag v-if="product.out_of_stock" class="tag" type="danger">缺货</van-tag>

        </template>

        <!-- <template #footer>
          <van-button size="mini">按钮</van-button>
          <van-button size="mini">按钮</van-button>
        </template> -->
      </van-card>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { reactive } from 'vue';
import Header from '@/components/Header.vue'

// const API_URL = 'http://127.0.0.1:3000';
const active = ref(0)
const API_URL = 'http://45.207.55.130:3000';

const responseData = reactive([]);

const products = reactive([]);

async function fetchData() {
  try {
    const response = await axios.get(`${API_URL}/categories`);
    responseData.value = response.data;

    // 初始化每个类别的编辑状态和更新后的名称
    responseData.value.forEach(category => {
      category.editing = false;
      category.updatedName = category.name;
    });

    // 获取产品数据，假设产品数据从另一个 API 端点获取
    const productResponse = await axios.get(`${API_URL}/products`);
    products.value = productResponse.data;
  } catch (error) {
    console.error('请求错误:', error);
  }
}

onMounted(() => {
  document.title = "端州香水柠檬"
  fetchData();
});

const state = reactive({
  // ...其他状态数据
});
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.left {
  width: 25%;
  height: 100vh;
  background-color: var(--van-background);
  --van-sidebar-width: 100%;
}

.right {
  width: 75%;
  --van-card-thumb-size: 90px;
  --van-card-font-size: 14px;
  --van-card-desc-color: var(--van-text-color-3);
  --van-card-background: #fff;
}

.card {
  margin: 10px 0px;
}

.tag {
  margin-right: 3px;
}
</style>
