<template>
  <div class="image">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/welcome' }"
            >首页</el-breadcrumb-item
          >
          <el-breadcrumb-item>素材管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
       <image-list />
    </el-card>
  </div>
</template>
<script>
import ImageList from '../components/image-list'
export default {
  components: {
    ImageList
  }
}
</script>

<style>

</style>