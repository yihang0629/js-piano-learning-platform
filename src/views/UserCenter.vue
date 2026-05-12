<template>
  <div class="user-center">
    <div class="top-bar">
      <div class="logo">
        <img src="@/assets/images/piano.png" class="logo-img" />
        <p class="logo-name">钢琴知识学习系统</p>
      </div>
      <div class="menu">
        <DemoButton
          @click="goAutoPlay"
          button_size="max"
          :button_status="state.id == -1 ? 'cprimary' : 'csecondary'"
          class="menu-AutoPlay"
          >自由弹奏</DemoButton
        >
        <DemoButton
          @click="goForum"
          button_size="max"
          :button_status="state.id == 0 ? 'cprimary' : 'csecondary'"
          class="menu-Forum"
          >学习论坛</DemoButton
        >
        <DemoButton
          @click="goPhoto"
          button_size="max"
          :button_status="state.id == 1 ? 'cprimary' : 'csecondary'"
          class="menu-Music"
          >曲谱中心</DemoButton
        >
        <DemoButton
          @click="goUserCenter"
          button_size="max"
          :button_status="state.id == 2 ? 'cprimary' : 'csecondary'"
          class="menu-UserCenter"
          >用户中心</DemoButton
        >
      </div>
      <div class="user">
        <span>{{ this.hello.string }}，欢迎您</span>
        <div class="user-head" v-if="this.user.id == '::1'" @click="goPerson" />
        <div class="user-head" v-if="this.user.id != '::1'" @click="exit" />
      </div>
    </div>

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

<script>
import { findUserPageApi } from '@/api/index';
import { users } from '../../mock/index';
import DemoButton from '@/components/DemoButton.vue';

export default {
  name: 'UserCenter',
  components: {
    DemoButton,
  },
  data() {
    return {
      searchForm: {
        username: '',
        nickname: '',
      },
      tableData: [],
      loading: false,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      state: {
        id: 0,
      },
      hello: {
        string: '游客',
      },
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
  },
  mounted() {
    this.fetchUserList();
  },
  methods: {
    async fetchUserList() {
      this.loading = true;
      try {
        const params = {
          page: this.currentPage,
          pageSize: this.pageSize,
          username: this.searchForm.username,
          nickname: this.searchForm.nickname,
        };
        const res = await findUserPageApi(params);
        if (res && res.data) {
          this.tableData = res.data;
          this.total = res.total || res.data.length;
        } else {
          this.mockUserList();
        }
      } catch (error) {
        this.mockUserList();
      } finally {
        this.loading = false;
      }
    },
    mockUserList() {
      let filteredData = users.data;
      if (this.searchForm.username) {
        filteredData = filteredData.filter((item) =>
          item.username.includes(this.searchForm.username)
        );
      }
      if (this.searchForm.nickname) {
        filteredData = filteredData.filter((item) =>
          (item.nickname || '').includes(this.searchForm.nickname)
        );
      }
      this.total = filteredData.length;
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      this.tableData = filteredData.slice(start, end);
    },
    handleSearch() {
      this.currentPage = 1;
      this.fetchUserList();
    },
    handleReset() {
      this.searchForm = {
        username: '',
        nickname: '',
      };
      this.currentPage = 1;
      this.fetchUserList();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.fetchUserList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetchUserList();
    },
    handleView(row) {
      this.$message.info(`用户: ${row.username}, 昵称: ${row.nickname || '无'}, 头像: ${row.user_pic || '无'}`);
    },
    goAutoPlay() {
      this.$router.push('/AutoPlay');
    },
    goForum() {
      this.$router.push('/CardPage');
    },
    goPhoto() {
      this.$router.push('/PhotoPage');
    },
    goPerson() {
      this.$router.push('/person');
    },
    goUserCenter() {
      this.state.id = 2;
      this.$router.push('/user-center');
    },
    exit() {
      this.$store.commit('getUser', { id: '::1' });
      this.$message.success('退出登录成功');
      this.$router.push('/');
    },
  },
};
</script>

<style lang="less" scoped>
.user-center {
  min-height: 100vh;
  background-color: #f8f8f8;
}

.top-bar {
  display: flex;
  align-items: center;
  background-color: #fff;
  padding: 10px 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.logo {
  display: flex;
  align-items: center;
  margin-right: 40px;

  .logo-img {
    width: 40px;
    height: 40px;
    margin-right: 10px;
  }

  .logo-name {
    font-size: 20px;
    font-weight: bold;
    color: #333;
  }
}

.menu {
  display: flex;
  gap: 20px;
  flex: 1;
}

.user {
  display: flex;
  align-items: center;
  gap: 10px;

  .user-head {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    cursor: pointer;
  }
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
