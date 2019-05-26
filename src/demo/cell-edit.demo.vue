<template>
  <div>
    <el-button @click="handleCheckData" style="margin-bottom: 20px">打印表格数据</el-button>
    <el-table-editabled
      v-model="tableData"
      :columns="['date', 'name']"
      :cellStates="cellStates"
      :validators="validators"
      validate-msg-tooltip
      ref="editTable"
    >
      <el-table
        :data="tableData"
        @cell-mouse-enter="(row, column) => handleCellMouse(row, column, 'enter')"
        @cell-mouse-leave="(row, column) => handleCellMouse(row, column, 'leave')"
        @selection-change="selection = arguments[0]"
      >
        <el-table-column
          fixed
          prop="date"
          label="日期"
        >
          <template slot-scope="{ row }">
            <el-table-editabled-cell
              :row="row"
              prop="date"
            >
              <template slot-scope="{ ownStates, validateOwn }">
                <div class="cell-edit-wrapper">
                  <div class="cell-content">
                    <span v-show="!ownStates.editing">{{row.date}}</span>
                    <el-date-picker
                      v-show="ownStates.editing"
                      v-model="row.date"
                      type="date"
                      value-format="yyyy-MM-dd"
                      placeholder="选择日期"
                      clearable
                      @change="validateOwn"
                    >
                    </el-date-picker>
                  </div>
                  <div class="cell-edit-controller">
                    <i
                      @click="() => ownStates.editing = true"
                      class="el-icon-edit"
                      v-show="ownStates.cellHovering && !ownStates.editing"
                    ></i>
                    <span v-show="ownStates.editing">
                      <i class="el-icon-close" @click="handleCancelCell(row, 'date')"></i>
                      <i class="el-icon-check" @click="handleSaveCell(validateOwn, row, 'date')"></i>
                    </span>
                  </div>
                </div>
              </template>
            </el-table-editabled-cell>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="姓名"
        >
          <template slot-scope="{ row }">
            <el-table-editabled-cell
              :row="row"
              prop="name"
            >
              <template slot-scope="{ ownStates, validateOwn }">
                <div class="cell-edit-wrapper">
                  <div class="cell-content">
                    <span v-show="!ownStates.editing">{{row.name}}</span>
                    <el-input
                      v-show="ownStates.editing"
                      v-model="row.name"
                      clearable
                      @input="validateOwn"
                    >
                    </el-input>
                  </div>
                  <div class="cell-edit-controller">
                    <i
                      @click="() => ownStates.editing = true"
                      class="el-icon-edit"
                      v-show="ownStates.cellHovering && !ownStates.editing"
                    ></i>
                    <span v-show="ownStates.editing">
                      <i class="el-icon-close" @click="handleCancelCell(row, 'name')"></i>
                      <i class="el-icon-check" @click="handleSaveCell(validateOwn, row, 'name')"></i>
                    </span>
                  </div>
                </div>
              </template>
            </el-table-editabled-cell>
          </template>
        </el-table-column>
        <el-table-column
          prop="zip"
          label="邮编"
        >
        </el-table-column>
      </el-table>
    </el-table-editabled>
  </div>
</template>

<script>
  export default {
    computed: {
      editTable () {
        return this.$refs.editTable
      }
    },
    data () {
      const setCellStates = function (row) {
        return {
          cellHovering: false
        }
      }

      return {
        cellStates: {
          date: setCellStates,
          name: setCellStates
        },
        tableData: [{
          date: '2016-05-03',
          name: '王小虎',
          zip: 200333
        }, {
          date: '2016-05-02',
          name: '王小虎',
          zip: 200333
        }, {
          date: '2016-05-04',
          name: '王小虎',
          zip: 200333
        }],
        validators: {
          date ({ date }, next) {
            if (!date) {
              next('请选择日期')
            } else {
              next('')
            }
          },
          name ({ name }, next) {
            if (!name) {
              next('请填写姓名')
            } else {
              next('')
            }
          }
        }
      }
    },
    methods: {
      handleCellMouse (row, column, action) {
        this.editTable.store.setCellStates([row], [column.property], {
          cellHovering: action === 'enter'
        })
      },
      handleCancelCell (row, cell) {
        this.editTable.cancelCells([row], [cell])
      },
      handleSaveCell (validateCell, row, cell) {
        // 验证该单元格的数据
        validateCell((valid) => {
          if (valid) {
            this.$message.success('保存成功')

            this.editTable.cancelCells([row], [cell], false)
          } else {
            this.$message.error('校验不通过')
          }
        })
      },
      handleCheckData () {
        console.log(this.tableData)
      }
    }
  }
</script>

<style>
  .cell-edit-wrapper {
    display: flex;
    align-items: center;
  }
  .cell-content {
    flex: 1;
  }
  .cell-edit-controller {
    margin-left: 8px;
    width: 40px;
    text-align: center;
    cursor: pointer;
    font-size: 16px;
  }
  .cell-edit-controller .el-icon-check {
    color: #67C23A;
  }
</style>
