import {
  isEmpty
} from "./utils";

export default class TableStore {
  constructor (options) {

    Object.assign(this, {
      columns: [],
      rowStatesCreator: () => ({}),
      cellStatesCreator: {}
    }, options)

    this.states = new Map()

    this.addStates(this.tableData)
  }

  addStates (data) {
    const {
      columns,
      rowStatesCreator,
      cellStatesCreator
    } = this

    data.forEach(row => {
      let rowStates = {
        _states: {}
      }

      if (rowStatesCreator) {
        rowStates._states = rowStatesCreator(row)
      }

      if (!isEmpty(cellStatesCreator)) {
        columns.forEach(prop => {
          const cellStates = cellStatesCreator[prop] ? cellStatesCreator[prop](row) : {}

          if (!isEmpty(cellStates)) rowStates[prop] = cellStates
        })
      }

      this.states.set(row, rowStates)
    })
  }

  getStates (row) {
    return this.states.get(row)
  }

  setRowsStates (rows, states) {
    rows.forEach(row => Object.assign(this.states.get(row)._states, states))
  }

  setCellStates (rows, cells, states) {
    rows.forEach(row => {
      const cellStates = this.states.get(row)

      cells.forEach(cell => {
        if (cellStates[cell]) {
          console.log(cellStates)
          Object.assign(cellStates[cell], states)
        }
      })
    })
  }

  delStates (rows) {
    rows.forEach(row => {
      this.states.delete(row)
    })
  }

  insertDataBeforeRow (row, rows) {
    this.insertData(row, rows, 'before')
  }

  insertDataAfterRow (row, rows) {
    this.insertData(row, rows, 'after')
  }

  insertData (row, rows, type) {
    this.addStates(rows, true)

    // this.vm[this.tableDataKey].find((_row, idx) => {
    //   if (row === _row) {
    //     this.vm[this.tableDataKey].splice(type === 'before' ? idx : idx + 1, 0, ...rows)
    //     return true
    //   }
    // })
  }
}
