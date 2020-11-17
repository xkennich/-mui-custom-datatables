import React from 'react'
import {makeStyles} from '@material-ui/core/styles'
import Table, {
  dateFilterOptions,
  customBodyTotalRender,
  endPrefixFieldOptions,
  numberFilterOptions,
  expandableRows
} from './Table'

import {data, dictionary} from './data'

const useStyles = makeStyles(theme => ({
  footerCell: {
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    borderBottom: 'none'
  }
}))

const StatisticTable = () => {
  const classes = useStyles()

  const openRows = (rowData, rowMeta) => {
    const inData = data[rowMeta.dataIndex]
    return <div>{JSON.stringify(inData.payments)}</div>
  }


  const statisticOptions = {
    title: "Статистика отделений",
    columns: [
      {
        name: 'date',
        label: 'Дата',
        options: {
          ...dateFilterOptions()
        }
      }
    ],
    data,
    options: {
      ...expandableRows(openRows),
      ...customBodyTotalRender(
        [
          ...dictionary.map(d => {
            return {
              name: String(d.value),
              postfix: 'руб'
            }
          }),
          {
            name: 'sum',
            postfix: 'руб'
          }
        ],
        classes.footerCell
      )
    }
  }

  dictionary.map(d => {
    statisticOptions.columns.push({
      name: String(d.value),
      label: d.name,
      options: {
        filter: false,
        ...endPrefixFieldOptions('руб')
      }
    })
    return true
  })

  statisticOptions.columns.push({
    name: 'sum',
    label: 'Сумма',
    options: {
      ...endPrefixFieldOptions('руб'),
      ...numberFilterOptions()
    }
  })

  return <Table {...statisticOptions} />
}

export default StatisticTable