<template>
  <el-container class="app-wrapper">
    <!-- 左侧菜单 -->
    <el-aside width="210px" class="sidebar">
      <div class="logo">
        <i class="el-icon-s-platform"></i>
        <span>Quiz后台管理</span>
      </div>
      <el-menu
        :default-active="$route.path"
        router
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
      >
        <el-menu-item
          v-for="item in menus"
          :key="item.path"
          :index="item.path"
        >
          <i :class="item.icon"></i>
          <span slot="title">{{ item.title }}</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <!-- 顶部栏 -->
      <el-header class="header">
        <div class="header-left">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/dashboard' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{ currentTitle }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="header-right">
          <el-dropdown @command="handleCommand">
            <span class="user-info">
              <el-avatar :size="30" icon="el-icon-user-solid"></el-avatar>
              <span class="username">{{ username }}</span>
              <i class="el-icon-arrow-down"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="logout" icon="el-icon-switch-button">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>

      <!-- 内容区 -->
      <el-main class="main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'Layout',
  data() {
    return {
      menus: [
        { path: '/dashboard', title: '首页', icon: 'el-icon-s-home' },
        { path: '/user', title: '用户管理', icon: 'el-icon-user' },
        { path: '/question', title: '题目管理', icon: 'el-icon-document' },
        { path: '/system', title: '系统信息', icon: 'el-icon-info' }
      ]
    }
  },
  computed: {
    username() {
      return this.$store.state.auth.username || 'admin'
    },
    currentTitle() {
      return this.$route.meta.title || ''
    }
  },
  methods: {
    handleCommand(command) {
      if (command === 'logout') {
        this.$confirm('确定要退出登录吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.$store.dispatch('auth/logout')
            this.$message.success('已退出登录')
            this.$router.push('/login')
          })
          .catch(() => {})
      }
    }
  }
}
</script>

<style scoped>
.app-wrapper {
  height: 100%;
}

.sidebar {
  background-color: #304156;
  overflow-x: hidden;
}

.logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 1px;
  background-color: #263445;
}

.logo i {
  margin-right: 8px;
  font-size: 24px;
}

.sidebar .el-menu {
  border-right: none;
}

.header {
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.user-info .username {
  margin: 0 6px;
  color: #303133;
}

.main {
  background-color: #f0f2f5;
}
</style>
