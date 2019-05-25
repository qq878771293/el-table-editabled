<template>
  <div>
    <h3>批量编辑</h3>
    <batch-edit-demo></batch-edit-demo>
    <h3>单行编辑</h3>
    <row-edit-demo></row-edit-demo>
    <h3>单元格编辑</h3>
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
