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
            <van-card @click="openEditPopup(product)" v-for="product in products.value" :price="product.price"
                :desc="product.description" :title="product.name"
                :thumb="'http://45.207.55.130:3000/xiaoman/' + product.imageUrl">
                <template #tags>
                    <template v-for="(tag, index) in product.tags">
                        <van-tag v-if="tag.plain == false" :type="tag.type">{{ tag.name }}</van-tag>
                        <van-tag v-else plain :type="tag.type">{{ tag.name }}</van-tag>
                        <!-- <van-tag class="tag" plain type="primary">{{ tag.name }}</van-tag> -->
                    </template>
                </template>
            </van-card>
            <!-- 编辑popup -->
            <van-popup v-model:show="showEditPopup" position="top">
                <van-field v-model="editProduct.name" label="名称" />
                <van-field v-model="editProduct.description" label="描述" />
                <van-field v-model="editProduct.price" label="价格" />
                <!-- 这里可以添加一个图片上传的组件 -->
                <!-- <van-field v-model="tagsString" label="标签" /> -->
                <van-cell title="标签" value="内容">
                    <template #value>
                        <template v-for="(tag, index) in editProduct.tags" :key="index">
                            <van-tag @close="deleteTag(index)" v-if="tag.plain" plain class="tag" :type="tag.type"
                                closeable>{{ tag.name }}</van-tag>
                            <!-- <van-tag v-if="tag.type" plain class="tag" :type="tag.type" closeable>{{ tag.name }}</van-tag> -->
                            <van-tag @close="deleteTag(index)" v-else :type="tag.type" class="tag" closeable>{{ tag.name
                            }}</van-tag>
                        </template>
                        <van-tag @click="openAddTagPopup" type="success">添加标签</van-tag>
                    </template>
                </van-cell>
                <van-popup v-model:show="showAddTagPopup" position="top">
                    <van-field v-model="newTagName" label="标签名称" input-align="right" />
                    <van-cell-group>
                        <van-cell title="标签颜色">
                            <template #value>
                                <van-radio-group direction="horizontal" v-model="newTagColor">
                                    <van-radio name="primary" label="primary">蓝色</van-radio>
                                    <van-radio name="success" label="success">绿色</van-radio>
                                    <van-radio name="danger" label="danger">红色</van-radio>
                                    <van-radio name="warning" label="warning">橙色</van-radio>
                                </van-radio-group>
                            </template>
                        </van-cell>
                        <van-cell title="空心标签">
                            <template #value>
                                <van-switch v-model="newTagPlain" size="24px" />
                            </template>
                        </van-cell>
                        <van-cell title="预览">
                            <template #value>
                                <van-tag v-if="newTagPlain == false" :type="newTagColor">{{ newTagName }}</van-tag>
                                <van-tag v-else plain :type="newTagColor">{{ newTagName }}</van-tag>
                            </template>
                        </van-cell>
                    </van-cell-group>
                    <van-button @click="addNewTag">添加标签</van-button>
                </van-popup>
                <van-button @click="saveEditedProduct">保存</van-button>
            </van-popup>
        </div>
    </div>
</template>
  
<script setup>
import axios from 'axios';
import { onMounted, ref, computed } from 'vue';
import { reactive, toRaw } from 'vue';
import Header from '@/components/Header.vue'

const active = ref(0)
const API_URL = 'http://127.0.0.1:3000';
// const API_URL = 'http://45.207.55.130:3000';
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

// 编辑
const showEditPopup = ref(false); // 控制编辑popup的显示
const editProduct = reactive({ // 存储正在编辑的产品数据
    _id: '',
    name: '',
    description: '',
    price: 0,
    imageUrl: '',
    tags: []
});
const showAddTagPopup = ref(false)
const newTagName = ref('')
const newTagColor = ref('primary')
const newTagPlain = ref(false)

// 打开添加标签弹出框
function openAddTagPopup() {
    showAddTagPopup.value = true;
}

// 添加新标签
async function addNewTag() {
    // 获取 `products.value` 中的 `tags`
    const existingTags = products.value.find(product => product._id === editProduct._id);
    console.log('exist', existingTags.tags);

    // 创建一个新标签对象
    const newTag = {
        name: newTagName.value,
        type: newTagColor.value,
        plain: newTagPlain.value,
    };

    // 将新标签添加到 `existingTags` 数组中
    existingTags.tags.push(newTag);

    // 将组合后的标签数组设置回 `editProduct.tags`
    editProduct.tags = existingTags;

    // 将新标签添加到产品的标签列表中
    console.log('edit',editProduct.tags);
    await axios.put(`${API_URL}/products/${editProduct._id}`, {
        tags: editProduct.tags
    })
    // editProduct.tags.push(newTag);

    // 清空输入框和关闭弹出框
    newTagName.value = '';
    newTagColor.value = 'primary';
    newTagPlain.value = false;
    showAddTagPopup.value = false;
}

// 删除标签
function deleteTag(index) {
    // 从标签数组中删除指定索引的标签
    editProduct.tags.splice(index, 1);
}

// const tagsString = computed({
//     get: () => editProduct.tags.map(tag => tag.name).join(', '),
//     set: value => {
//         // 这里，我们只是从字符串中提取名称。你可能需要进一步的逻辑来设置类型。
//         editProduct.tags = value.split(',').map(tagName => ({ name: tagName.trim(), type: 'defaultType' }));
//     }
// });

function openEditPopup(product) {
    editProduct._id = product._id;
    editProduct.name = product.name;
    editProduct.description = product.description;
    editProduct.price = product.price;
    editProduct.imageUrl = product.imageUrl;
    editProduct.tags = product.tags;
    showEditPopup.value = true;
}

async function saveEditedProduct() {
    try {
        await axios.put(`${API_URL}/products/${editProduct._id}`, {
            name: editProduct.name,
            description: editProduct.description,
            price: editProduct.price,
            tags: toRaw(editProduct.tags)
            // 根据你的后端API，你可能还需要更新其他字段
        });

        // 这里可以重新获取产品列表以刷新数据
        fetchData();

    } catch (error) {
        console.error('更新产品失败:', error);
    }

    showEditPopup.value = false;
}


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
  