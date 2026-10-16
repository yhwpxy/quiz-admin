<template>
  <div class="page-container">
    <el-card class="page-card" shadow="never">
      <div slot="header">
        <span>系统信息</span>
      </div>
      <el-descriptions :column="1" border>
        <el-descriptions-item label="系统名称">Quiz 后台管理系统</el-descriptions-item>
        <el-descriptions-item label="版本号">v1.0.0</el-descriptions-item>
        <el-descriptions-item label="前端框架">Vue 2.7</el-descriptions-item>
        <el-descriptions-item label="UI 组件库">Element UI 2.15</el-descriptions-item>
        <el-descriptions-item label="路由方案">Vue Router 3</el-descriptions-item>
        <el-descriptions-item label="状态管理">Vuex 3</el-descriptions-item>
        <el-descriptions-item label="构建工具">Vue CLI 5（Webpack）</el-descriptions-item>
        <el-descriptions-item label="数据存储">localStorage（演示环境模拟数据）</el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-card class="page-card" shadow="never">
      <div slot="header">
        <span>功能说明</span>
      </div>
      <el-collapse>
        <el-collapse-item title="用户管理" name="1">
          <div>支持用户的查询、添加、编辑与删除操作，数据分页展示。</div>
        </el-collapse-item>
        <el-collapse-item title="题目管理" name="2">
          <div>支持单选题、多选题、判断题、填空题、简答题五类题型的增删改查，可配置章节与难度。</div>
        </el-collapse-item>
        <el-collapse-item title="数据说明" name="3">
          <div>演示环境使用浏览器 localStorage 存储数据，刷新页面数据依然保留。</div>
        </el-collapse-item>
      </el-collapse>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'SystemInfo'
}
</script>
