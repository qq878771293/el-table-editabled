<template>
  <div>
    <div style="margin-bottom: 12px">
      <el-button @click="handleSave" type="primary">保存</el-button>
      <el-button @click="handleEditRows">编辑</el-button>
      <el-button @click="handleCancelRows">撤销</el-button>
      <el-button @click="handleNewRows">新增行</el-button>
      <el-button @click="handleDelRows">删除行</el-button>
      <el-button @click="handleValidate">验证表格正在编辑的数据</el-button>
      <el-button @click="handleCheckData">打印表格数据</el-button>
    </div>
    <el-table-editabled
      v-model="tableData"
      :columns="['date', 'name']"
      :validators="validators"
      ref="editTable"
    >
      <el-table
        :data="tableData"
        style="width: 100%"
        @selection-change="selection = arguments[0]"
      >
        <el-table-column
          type="selection"
        ></el-table-column>
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
              <template slot-scope="{ rowStates, validateOwn }">
                <span v-show="!rowStates.editing">{{row.date}}</span>
                <el-date-picker
                  v-show="rowStates.editing"
                  v-model="row.date"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期"
                  clearable
                  @change="validateOwn"
                >
                </el-date-picker>
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
              <template slot-scope="{ rowStates, validateOwn }">
                <span v-show="!rowStates.editing">{{row.name}}</span>
                <el-input
                  v-show="rowStates.editing"
                  v-model="row.name"
                  clearable
                  @input="validateOwn"
                >
                </el-input>
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
      return {
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
      handleCheckData () {
        console.log(this.tableData)
      },
      getNewRowData () {
        return {
          date: '',
          name: '',
          zip: ''
        }
      },
      checkSelection () {
        if (this.selection && this.selection.length) {
          return true
        } else {
          this.$message.error('请先选择数据')
        }
      },
      handleEditRows () {
        if (this.checkSelection()) {
          this.editTable.editRows(this.selection)
        }
      },
      handleEdit (row) {
        this.$refs.elTableEditabled.editRows([row])
      },
      handleCancelRows () {
        // 删除选中的数据
        if (this.checkSelection()) {
          this.editTable.cancelRows(this.selection)
        }
      },
      handleNewRows () {
        const newRow = this.getNewRowData()

        this.editTable.newRows([newRow])
      },
      handleDelRows () {
        // 删除选中的数据
        if (this.checkSelection()) {
          this.editTable.delRows(this.selection)
        }
      },
      handleSave () {
        // 保存数据前先进行数据验证
        this.handleValidate(() => {
          this.editTable.cancelRows(this.tableData, false)
        })
      },
      handleValidate (successCb) {
        // 验证表格中所有正在编辑的字段
        this.editTable.validate(valid => {
          // valid 为布尔值 代表表格正在编辑的所有字段是否验证通过
          if (valid) {
            this.$message.success('表格验证通过')
            successCb()
          } else {
            this.$message.error('表格验证不通过')
          }
        })
      }
    }
  }
</script>
