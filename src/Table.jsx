import React, {useState} from 'react'
import PropTypes from 'prop-types'
import {format} from 'date-fns'
import {withRouter} from 'react-router-dom'
import queryString from 'query-string'

import MUIDataTable from 'mui-datatables'

import {KeyboardDatePicker} from '@material-ui/pickers'
import FormLabel from '@material-ui/core/FormLabel'
import FormGroup from '@material-ui/core/FormGroup'
import TextField from '@material-ui/core/TextField'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import Paper from '@material-ui/core/Paper'
import TableFooter from '@material-ui/core/TableFooter'
import Typography from '@material-ui/core/Typography'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import Checkbox from '@material-ui/core/Checkbox'
import ListItemText from '@material-ui/core/ListItemText'
import Button from '@material-ui/core/Button'

import Link from './Link'
import translateTable from './translateTable'

const dateHandler = date => format(new Date(date), 'HH:mm dd-MM-yy')

const Table = props => {
  const search = queryString.parse(props.location.search)

  const rowsPerPageOptions = [15, 30, 60]
  const handleRows = row => {
    const find = rowsPerPageOptions.find(i => +i === +row)
    return find !== undefined ? find : rowsPerPageOptions[0]
  }

  const [page, setPage] = useState(search.page ? +search.page : 0)
  const [rows, setRows] = useState(handleRows(search.rows))

  const handleChange = (stateFnc, path) => newValue => {
    stateFnc(newValue)
    const url = queryString.stringify({...search, [path]: newValue})
    props.history.push(`${props.location.pathname}?${url}`)
  }

  const historyBalanceOptions = {
    title: props.title,
    columns: props.columns,
    options: {
      filter: true,
      filterType: 'dropdown', 
      responsive: 'standard', 
      download: false, 
      selectableRows: 'none',
      print: false, 
      confirmFilters: true,
      fixedHeader: true,
      fixedSelectColumn: true,
      tableBodyHeight: '550px',
      searchPlaceholder: 'Найти...',

      ...props.options,

      page,
      rowsPerPageOptions, 
      rowsPerPage: rows, 

      onChangePage: handleChange(setPage, 'page'),
      onChangeRowsPerPage: handleChange(setRows, 'rows'),

      onDownload: (buildHead, buildBody, columns, data) =>
        '\uFEFF' + buildHead(columns) + buildBody(data),

      customFilterDialogFooter: (currentFilterList, applyNewFilters) => (
        <div style={{marginTop: '40px'}}>
          <Button variant='contained' color='primary' onClick={applyNewFilters}>
            Применить
          </Button>
        </div>
      ),

      textLabels: translateTable
    },
    data: props.data
  }

  return (
    <Paper>
      <MUIDataTable {...historyBalanceOptions} />
    </Paper>
  )
}

Table.propTypes = {
  title: PropTypes.string.isRequired,
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  options: PropTypes.object
}

export default withRouter(Table)

const updateList = (filterList, filterPos, index) => {
  if (filterPos === 0) {
    filterList[index].splice(filterPos, 1, '')
  } else if (filterPos === 1) {
    filterList[index].splice(filterPos, 1)
  } else if (filterPos === -1) {
    filterList[index] = []
  }
  return filterList
}

// Опции для цифровых полей с 2мя полями фильтрации
export const numberFilterOptions = (label = 'Сумма', prefix = '') => {
  return {
    filter: true,
    filterType: 'custom',
    customFilterListOptions: {
      render: v => {
        if (v[0] && v[1]) {
          return `${label} от: ${v[0]}${prefix}, до: ${v[1]}${prefix}`
        } else if (v[0]) {
          return `${label} от: ${v[0]}${prefix}`
        } else if (v[1]) {
          return `${label} до: ${v[1]}${prefix}`
        }
        return false
      },
      update: updateList
    },
    filterOptions: {
      fullWidth: true,
      names: [],
      logic(amount, filters) {
        if (filters[0] && filters[1]) {
          return +amount < +filters[0] || +amount > +filters[1]
        } else if (filters[0]) {
          return +amount < +filters[0]
        } else if (filters[1]) {
          return +amount > +filters[1]
        }
        return false
      },
      display: (filterList, onChange, index, column) => (
        <>
          <FormLabel>{label}</FormLabel>
          <FormGroup row>
            <TextField
              label='От'
              value={filterList[index][0] || ''}
              onChange={event => {
                filterList[index][0] = event.target.value
                onChange(filterList[index], index, column)
              }}
              style={{width: '45%', marginRight: '5%'}}
            />
            <TextField
              label='До'
              value={filterList[index][1] || ''}
              onChange={event => {
                filterList[index][1] = event.target.value
                onChange(filterList[index], index, column)
              }}
              style={{width: '45%'}}
            />
          </FormGroup>
        </>
      )
    }
  }
}

// Выводит дату в таблицке в общем формате
export const dateFieldOptions = () => {
  return {
    customBodyRender: value => {
      return <span defaultValue={value}>{dateHandler(value)}</span>
    }
  }
}

// Опции для поля с датой фильтр с 2мя полями
export const dateFilterOptions = () => {
  return {
    filter: true,
    filterType: 'custom',
    customFilterListOptions: {
      render: v => {
        if (v[0] && v[1]) {
          return `Дата от: ${dateHandler(v[0])}, до: ${dateHandler(v[1])}`
        } else if (v[0]) {
          return `Дата от: ${dateHandler(v[0])}`
        } else if (v[1]) {
          return `Дата до: ${dateHandler(v[1])}`
        }
        return false
      },
      update: updateList
    },
    filterOptions: {
      fullWidth: true,
      names: [],
      logic(date, filters) {
        const parse = Date.parse(date)
        if (filters[0] && filters[1]) {
          return +parse < +filters[0] || +parse > +filters[1]
        } else if (filters[0]) {
          return +parse < +filters[0]
        } else if (filters[1]) {
          return +parse > +filters[1]
        }
        return false
      },
      display: (filterList, onChange, index, column) => (
        <>
          <FormLabel>Дата</FormLabel>
          <FormGroup row>
            <KeyboardDatePicker
              disableToolbar
              variant='outlined'
              format='dd-MM-yy'
              margin='normal'
              id='date-picker-1'
              label='От'
              value={filterList[index][0] || new Date()}
              onChange={event => {
                filterList[index][0] = Date.parse(format(new Date(event), 'MM-dd-yy 00:00:00'))
                onChange(filterList[index], index, column)
              }}
              style={{width: '45%', marginRight: '5%'}}
              KeyboardButtonProps={{
                'aria-label': 'change date'
              }}
            />
            <KeyboardDatePicker
              disableToolbar
              variant='outlined'
              format='dd-MM-yy'
              margin='normal'
              id='date-picker-2'
              label='До'
              value={filterList[index][1] || new Date()}
              onChange={event => {
                filterList[index][1] = Date.parse(format(new Date(event), 'MM-dd-yy 23:59:59'))
                onChange(filterList[index], index, column)
              }}
              style={{width: '45%'}}
              KeyboardButtonProps={{
                'aria-label': 'change date'
              }}
            />
          </FormGroup>
        </>
      )
    },
    ...dateFieldOptions()
  }
}

// Добавляет к полю 'руб'
export const endPrefixFieldOptions = prefix => {
  return {
    customBodyRender: value => <span defaultValue={value}>{`${value} ${prefix}`}</span>
  }
}

// для поля с ID принимает префикс для ссылки, разрешение на ссылку и словарь [{ name: имя, value: column value }] возвращает кнопку
// !!! Словарь обязателен если есть поиск или после вызова функции указать filterType: 'multiselect'
export const idLinkFieldOptions = (prefix, link, dictionary = []) => {
  function customLink(prefix, value, link, label = null) {
    if (link)
      return (
        <span defaultValue={value}>
          <Link to={prefix + value}>{label ? label : value}</Link>
        </span>
      )
    return <span defaultValue={value}>{label ? label : value}</span>
  }

  return {
    filterType: 'custom',
    customBodyRender: value => {
      if (dictionary.length === 0) {
        return customLink(prefix, value, link)
      } else {
        const dict = dictionary.find(v => v.value === value)
        if (dict !== undefined) return customLink(prefix, value, link, dict.name)
        return customLink(prefix, value, link)
      }
    },
    customFilterListOptions: {
      render: value => {
        if (dictionary.length === 0) {
          return value.map(v => <span defaultValue={v}>{v}</span>)
        } else {
          return value.map(v => {
            const dict = dictionary.find(val => val.value === v)
            if (dict !== undefined) return <span defaultValue={value}>{dict.name}</span>
            return <span defaultValue={v}>{v}</span>
          })
        }
      }
    },
    filterOptions: {
      fullWidth: true,
      renderValue: value => {
        if (dictionary.length === 0) {
          return <span defaultValue={value}>{value}</span>
        } else {
          const dict = dictionary.find(v => v.value === value)
          if (dict !== undefined) return <span defaultValue={value}>{dict.name}</span>
          return <span defaultValue={value}>{value}</span>
        }
      },
      logic: (location, filters) => {
        if (filters.length) return !filters.includes(location)
        return false
      },
      display: (filterList, onChange, index, column) => {
        let optionValues = []
        if (dictionary.length > 0) {
          optionValues = dictionary
        }
        return (
          <FormControl>
            <InputLabel htmlFor='select-multiple-chip'>{column.label}</InputLabel>
            <Select
              multiple
              value={filterList[index]}
              renderValue={selected => {
                if (dictionary.length > 0) {
                  const accu = selected.map(sel => {
                    const item = dictionary.find(dic => dic.value === sel)
                    if (item !== undefined) return item.name
                    return sel
                  })
                  return accu.join(', ')
                } else {
                  return selected.join(', ')
                }
              }}
              onChange={event => {
                filterList[index] = event.target.value
                onChange(filterList[index], index, column)
              }}
            >
              {optionValues.map(item => (
                <MenuItem key={item.value} value={item.value}>
                  <Checkbox color='primary' checked={filterList[index].indexOf(item.value) > -1} />
                  <ListItemText primary={item.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )
      }
    }
  }
}

// Раскрытие строки принимает callback с React компонентом отображения в раскрытии и changeCallback вызываеться в момент раскрытия
export const expandableRows = (callback, changeCallback = () => {}) => {
  return {
    expandableRows: true,
    expandableRowsHeader: false,
    expandableRowsOnClick: true,
    isRowExpandable: (dataIndex, expandedRows) => {
      if (
        expandedRows.data.length > 4 &&
        expandedRows.data.filter(d => d.dataIndex === dataIndex).length === 0
      )
        return false
      return true
    },
    renderExpandableRow: (rowData, rowMeta) => {
      const colSpan = rowData.length + 1
      return (
        <TableRow>
          <TableCell colSpan={colSpan}>{callback(rowData, rowMeta)}</TableCell>
        </TableRow>
      )
    },
    onRowExpansionChange: (curExpanded, allExpanded, rowsExpanded) =>
      changeCallback(curExpanded, allExpanded, rowsExpanded)
  }
}

// Добавляет в конец страницы строку с суммой столбца, принимает массив с {name: collum.name, postfix, label} и клас с цветами: {
//     backgroundColor: theme.palette.background.paper,        цвет фона ячейки
//     color: theme.palette.text.primary,                      цвет текста
// }
export const customBodyTotalRender = (args = [], classes) => {
  const style = {
    position: 'sticky',
    bottom: 0,
    zIndex: 100
  }
  return {
    customTableBodyFooterRender: opts => {
      let accumulator = []
      args.map(op => {
        const index = opts.columns.findIndex(i => i.name === op.name)
        if (index !== -1) {
          let avg = opts.data.reduce((accu, item) => {
            return (accu * 1000 + item.data[index].props.defaultValue * 1000) / 1000
          }, 0)
          accumulator.push({
            name: op.name,
            value: avg,
            postfix: op.postfix ? op.postfix : '',
            label: op.label ? op.label : 'Сумма'
          })
        }
        return true
      })
      return (
        <TableFooter style={style} className={classes}>
          <TableRow>
            {opts.selectableRows !== 'none' ? (
              <TableCell style={style} className={classes} />
            ) : null}
            {opts.columns.map((col, index) => {
              if (col.display === 'true') {
                const cell = accumulator.find(accu => String(col.name) === String(accu.name))
                if (cell !== undefined) {
                  return (
                    <TableCell key={index} style={style} className={classes}>
                      <Typography variant='body1'>
                        <strong>{cell.label}</strong>: {cell.value} {cell.postfix}
                      </Typography>
                    </TableCell>
                  )
                } else {
                  return <TableCell key={index} style={style} className={classes} />
                }
              }
              return null
            })}
          </TableRow>
        </TableFooter>
      )
    }
  }
}
