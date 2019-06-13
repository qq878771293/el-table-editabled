import ElTableEditabled from './src/el-table-editabled.vue'
import ElTableEditabledCell from './src/el-table-editabled-cell.vue'

export default function (Vue) {
  ElTableEditabled.observable = Vue.observable || ((target) => new Vue({data: target}))

  Vue.component(ElTableEditabled.name, ElTableEditabled)
  Vue.component(ElTableEditabledCell.name, ElTableEditabledCell)
}
