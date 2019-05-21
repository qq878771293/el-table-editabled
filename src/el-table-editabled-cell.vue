<template>
  <div
    class="el-table-editabled-cell"
    :class="{'is-validate-error': !!ownStates.validateMsg}"
    @mouseenter="() => ownStates.hovering = true"
    @mouseleave="() => ownStates.hovering = false"
  >
    <div class="el-table-editabled-cell__content">
      <slot
        :cellStates="cellStates"
        :rowStates="rowStates"
        :validateOwn="validateOwn"
      ></slot>
    </div>
    <div v-show="!!ownStates.validateMsg" class="el-table-editabled-cell__error-msg">
      {{ownStates.validateMsg}}
    </div>
  </div>
</template>

<script>
  import {
    isNumber,
    isEmpty
  } from "./utils"

  export default {
    name: 'ElTableEditabledCell',
    inject: ['editValidator'],
    props: {
      prop: {
        type: String,
        required: true
      },
      validate: Object,
      row: null,
    },
    computed: {
      rowStates () {
        return this.cellStates._states
      },
      cellStates () {
        return this.editValidator.store.getStates(this.row)
      },
      ownStates () {
        return this.cellStates && this.prop ? this.cellStates[this.prop] : {}
      }
    },
    created () {
      this.$$ElTableEditabled.$on('edit-validator:validate', this.handleValidate)
    },
    beforeDestroy () {
      this.$$ElTableEditabled.$off('edit-validator:validate', this.handleValidate)
    },
    methods: {
      handleValidate (validateStacks, validateRows) {
        if ((this.ownStates.editing || this.rowStates.editing) && this.validate && (!validateRows || validateRows.includes(this.row))) {
          validateStacks.push(this.validateOwn)
        }
      },
      validateOwn () {
        const {
          validate: validateOpt,
          ownStates
        } = this

        return new Promise(resolve => {
          const {
            required = false,
            rules = []
          } = validateOpt

          const result = this.row[this.prop]

          if (required && isEmpty(result)) {
            return resolve(ownStates.validateMsg = validateOpt.msg)
          }

          for (const {type, value, msg} of rules) {

            if (type === 'number' && (result === '' || !isNumber(+result))) {
              return resolve(ownStates.validateMsg = msg)
            } else if (type === 'minLength' && result.length < value) {
              return resolve(ownStates.validateMsg = msg)
            } else if (type === 'maxLength' && result.length > value) {
              return resolve(ownStates.validateMsg = msg)
            } else if (type === 'regexp' && !value.test(result)) {
              return resolve(ownStates.validateMsg = msg)
            } else if (type === 'custom' && typeof value === 'function' && !value(this.row, this.cellStates)) {
              return resolve(ownStates.validateMsg = msg)
            } else if (type === 'async' && typeof value === 'function') {
              value(this.row, this.cellStates, function () {
                resolve(ownStates.validateMsg = '')
              }, function () {
                resolve(ownStates.validateMsg = msg)
              })
              return
            }
          }

          resolve(ownStates.validateMsg = '')
        })
      },
      toogleTooltip () {
        setTimeout(() => this.ownStates.tooltipDisabled = !this.ownStates.validateMsg, 0)
      }
    }
  }
</script>

<style>
  .el-table-editabled-cell__error-msg {
    margin-top: 4px;
    line-height: 1;
    color: #f56c6c;
  }
  .el-table-editabled-cell.is-validate-error .el-input__inner,
  .el-table-editabled-cell.is-validate-error .el-input__inner:focus,
  .el-table-editabled-cell.is-validate-error .el-textarea__inner,
  .el-table-editabled-cell.is-validate-error .el-textarea__inner:focus {
    border-color: #f56c6c;
  }
  .el-table-editabled-cell .el-autocomplete,
  .el-table-editabled-cell .el-select,
  .el-table-editabled-cell .el-date-editor.el-input__inner,
  .el-table-editabled-cell .el-date-editor.el-input,
  .el-table-editabled-cell .el-cascader {
    width: 100%;
  }
</style>
