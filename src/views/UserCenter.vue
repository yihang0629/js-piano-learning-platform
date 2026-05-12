<template>
  <div class="user-center">
    <div class="user-content">
      <div class="search-form">
        <el-form :inline="true" :model="searchForm" class="search-form-inline">
          <el-form-item label="用户名">
            <el-input v-model="searchForm.username" placeholder="请输入用户名" clearable />
          </el-form-item>
          <el-form-item label="昵称">
            <el-input v-model="searchForm.nickname" placeholder="请输入昵称" clearable />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">查询</el-button>
            <el-button @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

      <div class="user-table">
        <el-table :data="tableData" border style="width: 100%" v-loading="loading">
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="username" label="用户名" width="120" />
          <el-table-column prop="nickname" label="昵称" width="150" />
          <el-table-column prop="password" label="密码" width="150" />
          <el-table-column prop="user_pic" label="头像" width="150">
            <template #default="scope">
              {{ scope.row.user_pic || '无' }}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template #default="scope">
              <el-button size="small" @click="handleView(scope.row)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="pagination">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[10, 20, 50, 100]"
            :total="total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { findUserPageApi } from '@/api/index';
import { users } from '../../mock/index';

const searchForm = reactive({
  username: '',
  nickname: '',
});
const tableData = ref([]);
const loading = ref(false);
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

const fetchUserList = async () => {
  loading.value = true;
  try {
    const params = {
      page: currentPage.value,
      pageSize: pageSize.value,
      username: searchForm.username,
      nickname: searchForm.nickname,
    };
    const res = await findUserPageApi(params);
    if (res && res.data) {
      tableData.value = res.data;
      total.value = res.total || res.data.length;
    } else {
      mockUserList();
    }
  } catch (error) {
    mockUserList();
  } finally {
    loading.value = false;
  }
};

const mockUserList = () => {
  let filteredData = users.data;
  if (searchForm.username) {
    filteredData = filteredData.filter((item) => item.username.includes(searchForm.username));
  }
  if (searchForm.nickname) {
    filteredData = filteredData.filter((item) =>
      (item.nickname || '').includes(searchForm.nickname),
    );
  }
  total.value = filteredData.length;
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  tableData.value = filteredData.slice(start, end);
};

const handleSearch = () => {
  currentPage.value = 1;
  fetchUserList();
};

const handleReset = () => {
  searchForm.username = '';
  searchForm.nickname = '';
  currentPage.value = 1;
  fetchUserList();
};

const handleSizeChange = (val) => {
  pageSize.value = val;
  currentPage.value = 1;
  fetchUserList();
};

const handleCurrentChange = (val) => {
  currentPage.value = val;
  fetchUserList();
};

const handleView = (row) => {
  ElMessage.info(
    `用户: ${row.username}, 昵称: ${row.nickname || '无'}, 头像: ${row.user_pic || '无'}`,
  );
};

onMounted(() => {
  fetchUserList();
});
</script>

<style lang="less" scoped>
.user-center {
  min-height: 100vh;
  background-color: #f8f8f8;
}

.user-content {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.search-form {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;
}

.search-form-inline {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.user-table {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>
