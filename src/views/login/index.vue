<template>
  <div class="login-container">
    <el-card class="login-card">
      <div class="login-title">
        <i class="el-icon-s-platform" style="color: #409eff"></i>
        Quiz后台管理系统
      </div>
      <el-form ref="loginForm" :model="form" :rules="rules" @keyup.enter.native="handleLogin">
        <el-form-item prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" prefix-icon="el-icon-user" clearable />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="请输入密码"
            prefix-icon="el-icon-lock"
            show-password
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width: 100%" :loading="loading" @click="handleLogin">
            登 录
          </el-button>
        </el-form-item>
      </el-form>
      <div class="login-hint">
        测试账号：admin<br />
        测试密码：123456
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      loading: false,
      form: {
        username: 'admin',
        password: ''
      },
      rules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      }
    }
  },
  methods: {
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (!valid) return
        this.loading = true
        this.$store
          .dispatch('auth/login', this.form)
          .then(() => {
            this.$message.success('登录成功')
            this.$router.push('/dashboard')
          })
          .catch(err => {
            this.$message.error(err.message || '登录失败')
          })
          .finally(() => {
            this.loading = false
          })
      })
    }
  }
}
</script>
