<template>
    <Header></Header>
    <!-- <van-nav-bar title="标题" /> -->
    <div class="container">
        <div class="left">
            <van-sticky>
                <van-sidebar v-model="active" v-if="categories.value">
                    <van-sidebar-item v-for="item in categories.value" :title="item.name" :key="item._id" />
                </van-sidebar>
            </van-sticky>
        </div>
        <div class="right">
            <!-- 使用v-for迭代渲染每个产品的卡片 -->
            <van-card v-for="product in products.value" :price="product.price" :desc="product.description"
                :title="product.name" :thumb="'http://45.207.55.130:3000/xiaoman/' + product.imageUrl">
                <template v-if="product.description" #desc>
                    <div class="desc" @click="() => showEditDescriptionPopup(product)">{{ product.description }}</div>
                    <van-popup v-model:show="product.showEditDescription" position="top" :key="product._id">
                        <van-field v-model="editDescription" label="描述" placeholder="输入产品描述"
                            @keyup.enter="() => saveDescription(product)" />
                        <van-button @click="() => saveDescription(product)">保存描述</van-button>
                    </van-popup>
                </template>
                <template else #desc>
                    <div class="desc" @click="() => showEditDescriptionPopup(product)">添加描述内容</div>
                    <van-popup v-model:show="product.showEditDescription" position="top" :key="product._id">
                        <van-field v-model="editDescription" label="描述" placeholder="输入产品描述"
                            @keyup.enter="() => saveDescription(product)" />
                        <van-button @click="() => saveDescription(product)">保存描述</van-button>
                    </van-popup>
                </template>


                <template #tags>
                    <template v-for="(tag, index) in product.tags">
                        <van-tag class="tag" plain closeable @close="() => deleteTag(product, index)" type="primary">{{
                            tag
                        }}</van-tag>
                    </template>
                    <van-tag class="tag" type="success" @click="() => showPopup(product)">添加标签</van-tag>
                    <!-- <van-tag class="tag" type="success"  @click="()=>showAddTagPopup.value = true">添加标签</van-tag> -->
                    <van-popup v-model:show="product.showPopup" position="top">
                        <van-field v-model="newTag" label="新标签" placeholder="输入新标签名称" @keyup.enter="addTag(product)" />
                        <van-button @click="addTag(product)">添加标签</van-button>
                    </van-popup>
                </template>
            </van-card>
        </div>
    </div>
</template>
  
<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { reactive } from 'vue';
import Header from '@/components/Header.vue'

const active = ref(0)
const API_URL = 'http://45.207.55.130:3000';
const categories = reactive([]);
const products = reactive([]);

// 获取数据
async function fetchData() {
    try {
        // 获取菜单数据
        const categories_response = await axios.get(`${API_URL}/categories`);
        categories.value = categories_response.data

        // 初始化每个类别的编辑状态和更新后的名称
        categories.value.forEach(category => {
            category.editing = false;
            category.updatedName = category.name;
        });

        // 获取产品数据
        const product_response = await axios.get(`${API_URL}/products`);
        // 注意：你还需要在产品数据映射时为每个产品对象添加一个`showEditDescription`属性，并设置其值为false。
        products.value = product_response.data.map(product => ({
            ...product,
            showPopup: false,
            showEditDescription: false
        }));
    } catch (error) {
        console.error('请求错误:', error);
    }
}

onMounted(() => {
    document.title = "端州香水柠檬"
    fetchData();
});

// 修改描述内容
const editDescription = ref('');   // 存储用户输入的新描述
const showEditDescriptionPopup = (product) => {
    product.showEditDescription = true;
    editDescription.value = product.description || '';  // 初始化为当前描述或为空
}
async function saveDescription(product) {
    product.description = editDescription.value;

    try {
        await axios.put(`${API_URL}/products/${product._id}`, { description: product.description });

    } catch (error) {
        console.error('更新描述失败:', error);
    }
    editDescription.value = '';           // 清空输入框
    product.showEditDescription = false;
}

// 添加标签
const showPopup = (product) => {
    product.showPopup = true;
}
const newTag = ref('');               // 存储用户输入的新标签

async function addTag(product) {
    if (newTag.value.trim() !== '') {
        product.tags.push(newTag.value.trim());
        try {
            // 向服务器发送请求，更新整个tags数组
            await axios.put(`${API_URL}/products/${product._id}`, { tags: product.tags });

        } catch (error) {
            console.error('更新标签失败:', error);
            // 可以提供一个更友好的错误消息给用户，例如：
            // alert('更新标签失败，请稍后再试');
        }
        newTag.value = '';           // 清空输入框
        product.showPopup = false;
    }
}

// 删除标签
const deleteTag = async (product, index) => {
    product.tags.splice(index, 1)
    try {
        // 向服务器发送请求，更新整个tags数组
        await axios.put(`${API_URL}/products/${product._id}`, { tags: product.tags });

    } catch (error) {
        console.error('更新标签失败:', error);
        // 可以提供一个更友好的错误消息给用户，例如：
        // alert('更新标签失败，请稍后再试');
    }
};

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
    --van-card-thumb-size: 100px;
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

.desc {
    color: var(--van-text-color-3);
    word-wrap: break-word;
    /* Legacy browsers */
    overflow-wrap: break-word;
    /* Modern browsers */
}
</style>
  