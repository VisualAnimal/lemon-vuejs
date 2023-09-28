<template>
  <div>
    <h1>添加新的产品：</h1>
    <form @submit.prevent="addProductWithFile">
      <input v-model="newProduct.name" placeholder="产品的名字">
      <input v-model="newProduct.description" placeholder="产品描述">
      <input v-model="newProduct.price" placeholder="产品价格">
      <!-- <input v-model="newProduct.tags" placeholder="产品标签"> -->
      <input v-model="newProduct.tagsInput" placeholder="产品标签">
      <button @click.prevent="addTag">添加标签</button>
      <div>
        <div v-for="(tag, index) in newProduct.tags" :key="index">
          {{ tag }}
          <button @click.prevent="removeTag(index)">删除标签</button>
        </div>
      </div>
      <input type="file" ref="productImage">
      <button type="submit">添加</button>
    </form>
    <div>
      <h1>后端数据：</h1>
      <ul v-if="productData">
        <li v-for="item in productData" :key="item._id">
          <!-- 如果编辑模式激活，则显示编辑表单 -->
          <template v-if="item.editing">
            <input v-model="item.updatedName">
            <input v-model="item.updatedDescription">
            <input v-model="item.updatedPrice">
            <label>
              <input type="checkbox" v-model="item.out_of_stock"> 产品缺货
            </label>

            <!-- 输入框用于编辑标签 -->
            <div>
              <input v-for="(tag, index) in item.updatedTags" v-model="item.updatedTags[index]" :key="index">
              <button @click="addTagForItem(item)">添加标签</button>
              <button @click="removeTagForItem(item, index)">删除标签</button>
            </div>

            <!-- 图片上传 -->
            <input type="file" @change="updateItemImage(item)">

            <button @click="updateProduct(item)">保存</button>
          </template>

          <!-- 如果不在编辑模式，则显示产品属性和编辑按钮 -->
          <template v-else>
            <img class="images" v-if="item.imageUrl" :src="'http://45.207.55.130:3000/xiaoman/' + item.imageUrl" alt="">
            {{ `` }} -{{ item.name }} - {{ item.description }} - {{ item.price }}
            <button @click="deleteProduct(item._id)">删除</button>
            <button @click="activateEditMode(item)">编辑</button>
          </template>
        </li>
      </ul>
      <p v-else>加载中...</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

const API_URL = 'http://45.207.55.130:3000';

export default {
  data() {
    return {
      productData: null,
      newProduct: {
        name: '',
        description: '',
        price: '',
        tagsInput: '',
        tags: []
        // 添加其他属性的初始值
      }
    };
  },
  methods: {
    async addProductWithFile() {
      const formData = new FormData();

      const imageFile = this.$refs.productImage.files[0];
      if (imageFile) {
        formData.append('file', imageFile);
      }

      try {
        if (imageFile) {
          // Step 1: Upload the file and get the URL in response
          const response = await axios.post(`${API_URL}/upload/album`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });

          if (response.data.success) {
            // Step 2: Set the returned URL to the newProduct object
            this.newProduct.imageUrl = response.data.fileName;
          }
        }

        // Step 3: Save the product data
        await axios.post(`${API_URL}/products`, this.newProduct);
        // console.log(this.newProduct);

        // Reset the form fields
        this.newProduct = {
          name: '',
          description: '',
          price: '',
          tagsInput: '',
          tags: [],
          imageUrl: ''
        };

        // Refresh the list
        this.fetchProducts();
      } catch (error) {
        console.error('Error:', error);
      }
    },
    async fetchProducts() {
      try {
        const response = await axios.get(`${API_URL}/products`);
        this.productData = response.data;
        // 初始化每个产品的编辑状态和更新后的属性
        this.productData.forEach(product => {
          product.editing = false;
          product.updatedName = product.name;
          // 添加其他属性的更新状态
          product.updatedDescription = product.description;
          product.updatedPrice = product.price;
        });
      } catch (error) {
        console.error('请求错误:', error);
      }
    },
    async deleteProduct(id) {
      try {
        await axios.delete(`${API_URL}/products/${id}`);
        this.fetchProducts();
      } catch (error) {
        console.error('删除错误:', error);
      }
    },
    // 激活编辑模式
    activateEditMode(item) {
      item.editing = true;
    },
    // 更新产品属性
    async updateProduct(item) {
      try {
        await axios.put(`${API_URL}/products/${item._id}`, {
          name: item.updatedName,
          description: item.updatedDescription,
          price: item.updatedPrice,
          out_of_stock: item.out_of_stock
          // 添加其他属性的更新
        });
        item.editing = false;
        this.fetchProducts();
      } catch (error) {
        console.error('更新错误:', error);
      }
    },
    addTag() {
      if (this.newProduct.tagsInput.trim() !== '') {
        this.newProduct.tags.push(this.newProduct.tagsInput);
        this.newProduct.tagsInput = '';
      }
    },
    removeTag(index) {
      this.newProduct.tags.splice(index, 1);
    },
    // 更新单个产品的标签
    addTagForItem(item) {
      if (item.updatedTagsInput.trim() !== '') {
        item.updatedTags.push(item.updatedTagsInput);
        item.updatedTagsInput = '';
      }
    },

    // 删除单个产品的标签
    removeTagForItem(item, index) {
      item.updatedTags.splice(index, 1);
    },

    // 更新单个产品的图片
    updateItemImage(item) {
      const formData = new FormData();
      const imageFile = this.$refs.productImage.files[0];
      if (imageFile) {
        formData.append('file', imageFile);
        // 发送文件上传请求，更新 item 的 imageUrl
        axios.post(`${API_URL}/upload/album`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
          .then(response => {
            if (response.data.success) {
              item.imageUrl = response.data.fileName;
            }
          })
          .catch(error => {
            console.error('上传图片错误:', error);
          });
      }
    },
  },
  mounted() {
    this.fetchProducts();
  }
};
</script>

<style lang="scss" scoped>
.images {
  width: 100px;
  height: 100px;
}
</style>
