# el-table-editabled

一个用来实现el-table复杂编辑并包含验证场景的组件

![image](./demo.gif)

## Install
```shell
npm install el-table-editabled -S
```

## Quick Start
``` javascript
import Vue from 'vue'
import ElTableEditabled from 'el-table-editabled'

Vue.use(ElTableEditabled)
```

### 基础用法
```html
<template>
  <div>
    <div style="margin-bottom: 12px">
      <el-button @click="handleValidate">表格验证</el-button>
      <el-button @click="handleNewRows">新增行</el-button>
      <el-button @click="handleDelRows">删除行</el-button>
      <el-button @click="handleCheckData">打印编辑后的表格数据</el-button>
    </div>
    <el-table-editabled
      v-model="tableData"
      :columns="['date', 'name']"
      ref="elTableEditabled"
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
              :validate="{required: true, msg: '请选择日期'}"
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
              :validate="{required: true, msg: '请填写姓名'}"
            >
              <template slot-scope="{ rowStates, validateOwn }">
                <span v-show="!rowStates.editing">{{row.name}}</span>
                <el-input
                  v-show="rowStates.editing"
                  v-model="row.name"
                  clearable
                  @blur="validateOwn"
                >
                </el-input>
              </template>
            </el-table-editabled-cell>
          </template>
        </el-table-column>
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
                <el-button
                  v-show="!rowStates.editing"
                  @click="handleEdit(row)"
                  type="text"
                  size="small">
                  编辑
                </el-button>
                <div v-show="rowStates.editing">
                  <el-button
                    @click="handleCanelRow(row)"
                    type="text"
                    size="small">
                    取消
                  </el-button>
                  <el-button
                    @click="handleSave(row)"
                    type="text"
                    size="small">
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
    data() {
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
        }, {
          date: '2016-05-01',
          name: '王小虎',
          zip: 200333
        }, {
          date: '2016-05-08',
          name: '王小虎',
          zip: 200333
        }, {
          date: '2016-05-06',
          name: '王小虎',
          zip: 200333
        }, {
          date: '2016-05-07',
          name: '王小虎',
          zip: 200333
        }]
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
      handleEdit (row) {
        this.$refs.elTableEditabled.editRows([row])
      },
      handleCanelRow (row) {
        this.$refs.elTableEditabled.cancelRows([row])
      },
      handleSave (row) {
        // 验证一些正在编辑的行
        this.$refs.elTableEditabled.validateRows([row], valid => {
          // valid 为布尔值 代表表格正在编辑的所有字段是否验证通过
          if (valid) {
            // 第二个参数为 是否回退数据 若传false 则只取消编辑状态 编辑的数据会保存
            this.$refs.elTableEditabled.cancelRows([row], false)
          }
        })
      },
      handleNewRows () {
        const newRow = this.getNewRowData()
        const {
          elTableEditabled
        } = this.$refs

        elTableEditabled.newRows([newRow])
        // 缓存表格数据
        elTableEditabled.cacheTableData()
      },
      handleDelRows () {
        // 删除选中的数据
        this.$refs.elTableEditabled.delRows(this.selection)
      },
      handleValidate () {
        // 验证表格中所有正在编辑的字段
        this.$refs.elTableEditabled.validate(valid => {
          // valid 为布尔值 代表表格正在编辑的所有字段是否验证通过
          console.log(valid)
        })
      }
    }
  }
</script>
```

## API

### Props:

属性  |  说明  |  类型  |  默认值
:-------: | -------  |  :-------:  |  :-------:
v-model  |  绑定el-table的表格数据  |  Array  |  --
columns  |  需要编辑的列的字段名  |  Array  |  --
rowStates  |  可以给行添加一些状态  |  Function(row)  |  --
cellStates  | 可以给每一个单元格添加一些状态 |  Object  |  --
default-editing  |  表格是否默认为正在编辑状态  |  Boolean  | false

### Methods:

方法  |  说明  |  参数 
:-------: | -------  |  :-------:
editRows  |  使某些行进入编辑状态  |  Function(rows: Array<row>)
editColumns | 是某些行的某些字段进入编辑状态 | Function(rows: Array<row>, columns: Array<column>)
delRows  |  删除某些行  |  Function(rows: Array<row>)
newRows  |  新增行  |  Function(newDatas: Array<newRowData>)
insertRowsBeforeRow | 在某一行之前插入新数据 | Function(row: Object, newDatas: Array<newRowData>)
insertRowsAfterRow | 在某一行之后插入新数据 | Function(row: Object, newDatas: Array<newRowData>)
cancelRows | 撤销某些行的编辑状态和数据（可选） | Function(rows: Array<row>, isCancelData: Boolean(是否回滚数据，默认为true))
validateRows | 对某些正在编辑的行数据进行校验 | Function([rows: Array<row>, callback: Function(valid))
validate | 对整个表格正在编辑的数据进行校验 | Function(callback: Function(valid))

