<template>
  <div class="page-container">
    <!-- 欢迎卡片 -->
    <el-card class="page-card" shadow="never">
      <div class="welcome">
        <el-avatar :size="52" icon="el-icon-user-solid" style="background: #409eff"></el-avatar>
        <div class="welcome-text">
          <h3>你好，{{ username }}，欢迎使用 Quiz 后台管理系统！</h3>
          <p>这里可以管理用户与考试题目，左侧菜单切换功能模块。</p>
        </div>
      </div>
    </el-card>

    <!-- 统计卡片 -->
    <el-row :gutter="16">
      <el-col v-for="item in stats" :key="item.label" :xs="12" :sm="8" :md="4">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-icon" :style="{ background: item.color }">
            <i :class="item.icon"></i>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ item.value }}</div>
            <div class="stat-label">{{ item.label }}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 最近题目 -->
    <el-card class="page-card" shadow="never">
      <div slot="header">
        <span>最新题目</span>
      </div>
      <el-table :data="recentQuestions" stripe>
        <el-table-column prop="id" label="ID" width="70" />
        <el-table-column prop="content" label="题目内容" show-overflow-tooltip />
        <el-table-column prop="type" label="题型" width="100">
          <template slot-scope="scope">
            <el-tag :type="typeTag(scope.row.type)" size="small">{{ scope.row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="chapter" label="章节" width="100" />
        <el-table-column prop="difficulty" label="难度" width="90">
          <template slot-scope="scope">
            <el-tag :type="difficultyTag(scope.row.difficulty)" size="small">{{ scope.row.difficulty }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Dashboard',
  computed: {
    username() {
      return this.$store.state.auth.username || 'admin'
    },
    questions() {
      return this.$store.state.questions.list
    },
    stats() {
      const q = this.questions
      const count = type => q.filter(item => item.type === type).length
      return [
        { label: '用户总数', value: this.$store.state.users.list.length, icon: 'el-icon-user', color: '#409eff' },
        { label: '题目总数', value: q.length, icon: 'el-icon-document', color: '#67c23a' },
        { label: '单选题', value: count('单选题'), icon: 'el-icon-circle-check', color: '#e6a23c' },
        { label: '多选题', value: count('多选题'), icon: 'el-icon-s-grid', color: '#f56c6c' },
        { label: '判断题', value: count('判断题'), icon: 'el-icon-s-flag', color: '#909399' },
        { label: '简答题', value: count('简答题'), icon: 'el-icon-edit-outline', color: '#9c27b0' }
      ]
    },
    recentQuestions() {
      return this.questions.slice(0, 5)
    }
  },
  methods: {
    typeTag(type) {
      const map = { 单选题: 'success', 多选题: 'warning', 判断题: 'info', 填空题: 'primary', 简答题: 'danger' }
      return map[type] || 'info'
    },
    difficultyTag(diff) {
      const map = { 简单: 'success', 中等: 'warning', 困难: 'danger' }
      return map[diff] || 'info'
    }
  }
}
</script>

<style scoped>
.welcome {
  display: flex;
  align-items: center;
}

.welcome-text {
  margin-left: 16px;
}

.welcome-text h3 {
  margin: 0 0 6px;
  color: #303133;
}

.welcome-text p {
  margin: 0;
  color: #909399;
  font-size: 14px;
}

.stat-card {
  margin-bottom: 16px;
  text-align: center;
}

.stat-icon {
  width: 60px;
  height: 60px;
  margin: 0 auto 12px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 26px;
}

.stat-value {
  font-size: 26px;
  font-weight: 600;
  color: #303133;
}

.stat-label {
  margin-top: 4px;
  color: #909399;
  font-size: 13px;
}
</style>
