<template>
  <div>
    <el-button @click="handleCheckData" style="margin-bottom: 12px">打印表格数据</el-button>
    <el-table-editabled
      v-model="tableData"
      :columns="['date', 'name']"
      :validators="validators"
      ref="editTable"
    >
      <el-table
        :data="tableData"
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
        <el-table-column
          fixed="right"
          label="操作"
          width="120">
          <template slot-scope="{ row }">
            <el-table-editabled-cell
              :row="row"
            >
              <template slot-scope="{ rowStates }">
                <!-- 非编辑状态展示 -->
                <div v-show="!rowStates.editing">
                  <el-button
                    @click="handleEditRow(row)"
                    type="text"
                    size="small">
                    编辑
                  </el-button>
                  <el-button
                    @click="handleDelRow(row)"
                    type="text"
                    size="small">
                    删除
                  </el-button>
                </div>
                <!-- 编辑状态展示 -->
                <div v-show="rowStates.editing">
                  <el-button
                    @click="handleCanelRow(row)"
                    type="text">
                    取消
                  </el-button>
                  <el-button
                    @click="handleSave(row)"
                    type="text">
                    保存
                  </el-button>
                </div>
              </template>
            </el-table-editabled-cell>
          </template>
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
      handleEditRow (row) {
        this.editTable.editRows([row])
      },
      handleCanelRow (row) {
        this.editTable.cancelRows([row])
      },
      handleSave (row) {
        // 验证一些正在编辑的行
        this.editTable.validateRows([row], valid => {
          // valid 为布尔值 代表表格正在编辑的所有字段是否验证通过
          if (valid) {
            // 第二个参数为 是否回退数据 若传false 则只取消编辑状态 编辑的数据会保存
            this.editTable.cancelRows([row], false)
          }
        })
      },
      handleDelRow (row) {
        // 删除选中的数据
        this.editTable.delRows([row])
      }
    }
  }
</script>
