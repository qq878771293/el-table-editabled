<template>
  <div class="el-table-editabled">
    <slot></slot>
  </div>
</template>

<script>
  import {
    getEmptyArray,
    isEmpty,
    deepCopy
  } from "./utils";
  import TabelStore from './table-store'

  import Vue from 'vue'

  export default {
    name: 'ElTableEditabled',
    provide () {
      return {
        editValidator: this
      }
    },
    model: {
      prop: 'tableData',
      event: 'table-data-change'
    },
    props: {
      tableData: {
        type: Array,
        default: getEmptyArray
      },
      columns: {
        type: Array,
        default: getEmptyArray
      },
      rowStates: {
        type: Function,
        default: () => ({})
      },
      cellStates: {
        type: Object,
        default: () => {
          return {
            default: () => ({})
          }
        }
      },
      defaultEditing: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        store: new Map()
      }
    },
    watch: {
      tableData: {
        immediate: true,
        handler (newVal, oldVal) {
          if (!this.byOwnerAction) {
            this.init()
          }
          this.byOwnerAction = false
        }
      }
    },
    methods: {
      init () {
        this.cacheTableData()
        const cellStates = {}

        this.columns.forEach(prop => {
          const cellStatesCreator = this.cellStates[prop]

          cellStates[prop] = row => {
            return new Vue({
              data: Object.assign({
                editing: this.defaultEditing,
                validateMsg: '',
                hovering: false
              }, cellStatesCreator && cellStatesCreator(row))
            })
          }
        })

        this.store = new TabelStore({
          tableData: this.tableData,
          columns: this.columns,
          // 因Vue.observable API 依赖于Vue 2.6.x 所以只能用创建Vue实例的方式来创建响应式数据了
          rowStatesCreator: (row) => {
            return new Vue({
              data: Object.assign({
                editing: this.defaultEditing
              }, this.rowStates(row))
            })
          },
          cellStatesCreator: cellStates
        })
      },

      cacheTableData () {
        const tableCacheData = new Map()

        this.tableData.forEach(row => {
          tableCacheData.set(row, deepCopy(row))
        })

        this.tableCacheData = tableCacheData
      },

      editRows (rows) {
        this.store.setRowsStates(rows, {
          editing: true
        })
      },

      fallback () {
        const tableData = []
        const tableCacheData = new Map()

        for (const [row, cacheRowData] of this.tableCacheData) {
          const rowStates = this.store.getStates(row)

          this.updateTableCache(row, cacheRowData, rowStates)
          tableData.push(cacheRowData)
        }

        this.byOwnerAction = true
        this.tableCacheData = tableCacheData
        this.$emit('table-data-change', tableData)
      },

      cancelRows (rows, cancelData = true) {
        const tableData = []

        this.tableData.forEach(row => {
          const rowStates = this.store.getStates(row)

          if (rows.includes(row) && rowStates._states.editing) {
            const cacheRowData = this.tableCacheData.get(row)

            if (cancelData) {
              this.updateTableCache(row, cacheRowData, rowStates)
              this.tableCacheData.delete(row, cacheRowData)
            } else {
              this.tableCacheData.set(row, deepCopy(row))
            }

            const currentRow = cancelData ? cacheRowData : row

            tableData.push(currentRow)

            this.store.setRowsStates([currentRow], {
              editing: false
            })
            this.store.setCellStates([currentRow], this.columns, {
              validateMsg: ''
            })
          } else {
            tableData.push(row)
          }
        })

        this.byOwnerAction = true
        this.$emit('table-data-change', tableData)
      },

      updateTableCache (oldRow, newRow, rowStates) {
        this.store.states.set(newRow, rowStates)
        this.store.states.delete(oldRow)
        this.tableCacheData.set(newRow, deepCopy(cacheRowData))
      },

      editColumns (rows, cells) {
        this.store.setCellStates(rows, cells, {
          editing: true
        })
      },

      delRows (rows) {
        this.byOwnerAction = true

        this.$emit('table-data-change', this.tableData.filter(row => !rows.includes(row)))

        console.log(this.tableCacheData)

        // this.store.delStates(rows)
      },

      newRows (rows) {
        this.byOwnerAction = true

        this.store.addStates(rows)
        this.tableData.splice(0, 0, ...rows)

        this.editRows(rows)
      },

      insertRowsBeforeRow (row, rows) {
        this.insertRows(row, rows, 'before')
      },

      insertRowsAfterRow (row, rows) {
        this.insertData(row, rows, 'after')
      },

      insertRows (row, rows, type) {
        this.byOwnerAction = true
        this.store.addStates(rows)

        this.tableData.find((_row, idx) => {
          if (row === _row) {
            this.tableData.splice(type === 'before' ? idx : idx + 1, 0, ...rows)
            return true
          }
        })

        this.editRows(rows)
      },

      async validate (cb) {
        const validateStacks = []
        this.$$ElTableEditabled.$emit('edit-validator:validate', validateStacks)
        let validatePromiseStacks = []
        let valid

        validateStacks.forEach(validateCell => {
          validatePromiseStacks.push(new Promise((resolve, reject) => {
            validateCell().then(errorMsg => {
              if (errorMsg) {
                reject()
              } else {
                resolve()
              }
            })
          }))
        })

        try {
          await Promise.all(validatePromiseStacks)

          valid = true
        } catch(e) {
          valid = false
        }

        cb(valid)
      }
    }
  }
</script>
