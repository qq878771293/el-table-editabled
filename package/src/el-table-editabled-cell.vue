<template>
  <div
    class="el-table-editabled-cell"
    :class="{'is-validate-error': !!ownStates.validateMsg}"
    @mouseenter="() => ownStates.hovering = true"
    @mouseleave="() => ownStates.hovering = false"
  >
    <el-tooltip
      :disabled="!editValidator.validateMsgTooltip"
      :value="!!ownStates.validateMsg && ownStates.hovering"
      popper-class="el-table-editabled-cell-validate-msg"
      effect="light"
      :content="ownStates.validateMsg"
      placement="top-start"
      manual
    >
      <div class="el-table-editabled-cell__content">
        <slot
          :cellStates="cellStates"
          :rowStates="rowStates"
          :ownStates="ownStates"
          :validateOwn="validateOwn"
        ></slot>
      </div>
    </el-tooltip>
    <div
      v-if="!editValidator.validateMsgTooltip"
      v-show="!!ownStates.validateMsg"
      class="el-table-editabled-cell__error-msg"
    >
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
      prop: String,
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
    methods: {
      validateOwn (cb) {
        this.editValidator.validateCell(this.prop, this.row, this.rowStates, this.cellStates, this.ownStates)
          .then(errorMsg => {
            let valid

            if (errorMsg) {
              valid = false
            } else {
              valid = true
            }

            typeof cb === 'function' && cb(valid)
          })
      }
    }
  }
</script>

<style>
  .el-table-editabled-cell__content {
    outline: 0!important;
  }
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
  .el-tooltip__popper.el-table-editabled-cell-validate-msg.is-light {
    font-size: 12px;
    max-width: 150px;
    word-break: break-all;
    background: #fff;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.18);
    border: 0;
    color: #f56c6c;
  }
  .el-tooltip__popper.el-table-editabled-cell-validate-msg.is-light .popper__arrow {
    border: 0;
  }
</style>
