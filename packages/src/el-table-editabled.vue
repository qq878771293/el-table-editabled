<template>
  <div class="el-table-editabled">
    <slot></slot>
  </div>
</template>

<script>
  import {
    getEmptyArray,
    getEmptyObject,
    isEmpty,
    deepCopy,
    observable
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
        default: getEmptyObject
      },
      cellStates: {
        type: Object,
        default: () => {
          return {
            default: getEmptyObject
          }
        }
      },
      validators: {
        type: Object,
        default: getEmptyObject
      },
      defaultEditing: {
        type: Boolean,
        default: false
      },
      validateMsgTooltip: {
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
        this.tableCacheData = new Map()
        const cellStates = {}

        this.columns.forEach(prop => {
          const cellStatesCreator = this.cellStates[prop]

          cellStates[prop] = row => {
            return observable(Object.assign({
              editing: this.defaultEditing,
              validateMsg: '',
              hovering: false
            }, cellStatesCreator && cellStatesCreator(row)))
          }
        })

        this.store = new TabelStore({
          tableData: this.tableData,
          columns: this.columns,
          rowStatesCreator: (row) => {
            return observable(Object.assign({
              editing: this.defaultEditing
            }, this.rowStates(row)))
          },
          cellStatesCreator: cellStates,
          onInitLoop: (row) => {
            // 在初始化表格状态遍历表格数据的时候去初始化表格缓存数据
            this.updateTableCache([row], 'add')
          }
        })
      },

      editRows (rows) {
        this.store.setRowsStates(rows, {
          editing: true
        })
      },

      updateTableCache (rows, action) {
        const {
          tableCacheData
        } = this

        rows.forEach(row => {
          if ((action === 'add' && !tableCacheData.has(row)) || action === 'update') {
            tableCacheData.set(row, deepCopy(row))
          } else if (action === 'delete') {
            tableCacheData.delete(row)
          }
        })
      },

      // 回滚功能暂不开启
      // fallback () {
      //   const tableData = []
      //   const tableCacheData = new Map()
      //
      //   for (const [row, cacheRowData] of this.tableCacheData) {
      //     const rowStates = this.store.getStates(row)
      //
      //     this.updateTableCache(row, cacheRowData, rowStates)
      //     tableData.push(cacheRowData)
      //   }
      //
      //   this.byOwnerAction = true
      //   this.tableCacheData = tableCacheData
      //   this.$emit('table-data-change', tableData)
      // },

      cancelRows (rows, cancelData = true) {
        const {
          tableCacheData,
          store
        } = this

        rows.forEach(row => {
          const rowCacheData = tableCacheData.get(row)
          // 数据回滚
          if (cancelData && rowCacheData) {
            Object.assign(row, rowCacheData)
          }

          // 更新缓存 防止字段的值是引用类型 导致修改数据的时候缓存也会被修改
          this.updateTableCache([row], 'update')

          // 取消编辑状态并重置表单验证状态
          store.setRowsStates([row], {
            editing: false
          })
          store.setCellStates([row], this.columns, {
            editing: false,
            validateMsg: ''
          })
        })
      },

      cancelCells (rows, cells, cancelData = true) {
        const {
          tableCacheData,
          store
        } = this

        rows.forEach(row => {
          const rowCacheData = tableCacheData.get(row)

          cells.forEach(cell => {
            // 数据回滚
            if (cancelData && rowCacheData && rowCacheData[cell]) {
              row[cell] = rowCacheData[cell]
            }

            // 更新缓存
            this.updateTableCache([row], 'update')

            // 取消单元格编辑状态并重置表单验证状态
            store.setCellStates([row], [cell], {
              editing: false,
              validateMsg: ''
            })
          })
        })
      },

      editColumns (rows, cells) {
        this.store.setCellStates(rows, cells, {
          editing: true
        })
      },

      delRows (rows) {
        this.byOwnerAction = true
        this.updateTableCache(rows, 'delete')

        this.$emit('table-data-change', this.tableData.filter(row => !rows.includes(row)))

        this.store.delStates(rows)
      },

      newRows (rows) {
        this.byOwnerAction = true

        this.updateTableCache(rows, 'add')
        this.store.addStates(rows)
        this.tableData.splice(0, 0, ...rows)

        this.editRows(rows)
      },

      insertRowsBeforeRow (row, rows) {
        this.insertRows(row, rows, 'before')
      },

      insertRowsAfterRow (row, rows) {
        this.insertRows(row, rows, 'after')
      },

      insertRows (row, rows, type) {
        this.byOwnerAction = true
        this.store.addStates(rows)
        this.updateTableCache(rows, 'add')

        this.tableData.find((_row, idx) => {
          if (row === _row) {
            this.tableData.splice(type === 'before' ? idx : idx + 1, 0, ...rows)
            return true
          }
        })

        this.editRows(rows)
      },

      async validateRows (rows, cb) {
        let validatePromiseStacks = []
        let valid

        rows.forEach(row => {
          const cellStates = this.store.getStates(row)
          const rowStates = cellStates._states

          this.columns.forEach(prop => {
            const ownStates = cellStates ? cellStates[prop] : {}

            if ((ownStates.editing || rowStates.editing) && this.validators[prop]) {
              validatePromiseStacks.push(new Promise((resolve, reject) => {
                this.validateCell(prop, row, rowStates, cellStates, ownStates).then(errorMsg => {
                  if (errorMsg) {
                    reject()
                  } else {
                    resolve()
                  }
                })
              }))
            }
          })
        })

        try {
          await Promise.all(validatePromiseStacks)

          valid = true
        } catch(e) {
          valid = false
        }

        cb(valid)
      },

      validate (cb) {
        this.validateRows(this.tableData, cb)
      },

      validateCell (prop, row, rowStates, cellStates, ownStates) {
        const validator = this.validators[prop]

        return new Promise(resolve => {
          validator(row, (errorMsg) => {
            if (ownStates.editing || rowStates.editing) {
              ownStates.validateMsg = errorMsg
              resolve(errorMsg)
            }
          }, rowStates, cellStates)
        })
      }
    }
  }
</script>
