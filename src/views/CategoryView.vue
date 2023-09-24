<template>
  <div>
    <h1>添加新的类别：</h1>
    <form @submit.prevent="addItem">
      <input v-model="newCategory.name" placeholder="类别的名字" required>
      <button type="submit">添加</button>
    </form>

    <div>
      <h1>后端数据：</h1>
      <ul v-if="responseData">
        <li v-for="item in responseData" :key="item._id">
          <!-- 如果编辑模式激活，则显示编辑表单 -->
          <template v-if="item.editing">
            <input v-model="item.updatedName" required>
            <button @click="updateItem(item)">保存</button>
          </template>
          <!-- 如果不在编辑模式，则显示类别名称和编辑按钮 -->
          <template v-else>
            {{ item.name }}
            <button @click="deleteItem(item._id)">删除</button>
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
      responseData: null,
      newCategory: {
        name: '',
      }
    };
  },
  methods: {
    async fetchData() {
      try {
        const response = await axios.get(`${API_URL}/categories`);
        this.responseData = response.data;
        // 初始化每个类别的编辑状态和更新后的名称
        this.responseData.forEach(category => {
          category.editing = false;
          category.updatedName = category.name;
        });
      } catch (error) {
        console.error('请求错误:', error);
      }
    },
    async deleteItem(id) {
      try {
        await axios.delete(`${API_URL}/categories/${id}`);
        this.fetchData();
      } catch (error) {
        console.error('删除错误:', error);
      }
    },
    async addItem() {
      try {
        await axios.post(`${API_URL}/categories`, this.newCategory);
        this.fetchData();
        this.newCategory = { name: '' };
      } catch (error) {
        console.error('添加错误:', error);
      }
    },
    // 激活编辑模式
    activateEditMode(item) {
      item.editing = true;
    },
    // 更新类别名称
    async updateItem(item) {
      try {
        await axios.put(`${API_URL}/categories/${item._id}`, { name: item.updatedName });
        item.editing = false;
        this.fetchData();
      } catch (error) {
        console.error('更新错误:', error);
      }
    }
  },
  mounted() {
    this.fetchData();
  }
};
</script>

<style lang="scss" scoped></style>
