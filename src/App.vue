<template>
  <div style="padding-bottom: 20px">
    <el-link
      style="font-size: 22px"
      href="https://github.com/ckang1229/el-table-editabled/tree/master#el-table-editabled"
      target="_blank"
    >查看GitHub文档</el-link>
    <h3>批量编辑</h3>
    <el-link
      type="primary"
      :underline="false"
      style="margin-bottom: 20px"
      href="https://github.com/ckang1229/el-table-editabled/blob/gh-pages/src/demo/batch-edit.demo.vue"
      target="_blank"
    >查看示例代码</el-link>
    <batch-edit-demo></batch-edit-demo>
    <h3>单行编辑</h3>
    <el-link
      type="primary"
      :underline="false"
      style="margin-bottom: 20px"
      href="https://github.com/ckang1229/el-table-editabled/blob/gh-pages/src/demo/row-edit.demo.vue"
      target="_blank"
    >查看示例代码</el-link>
    <row-edit-demo></row-edit-demo>
    <h3>单元格编辑</h3>
    <el-link
      type="primary"
      :underline="false"
      style="margin-bottom: 20px"
      href="https://github.com/ckang1229/el-table-editabled/blob/gh-pages/src/demo/cell-edit.demo.vue"
      target="_blank"
    >查看示例代码</el-link>
    <cell-edit-demo></cell-edit-demo>
  </div>
</template>

<script>
  import batchEditDemo from './demo/batch-edit.demo.vue'
  import rowEditDemo from './demo/row-edit.demo.vue'
  import cellEditDemo from './demo/cell-edit.demo.vue'

  export default {
    components: {
      batchEditDemo,
      rowEditDemo,
      cellEditDemo
    }
  }
</script>

<style>
  h3 {
    margin: 20px 0;
    font-size: 22px;
    font-weight: 400;
    color: #1f2f3d;
  }
</style>
