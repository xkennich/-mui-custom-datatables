import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import {BrowserRouter as Router} from 'react-router-dom'
import {MuiPickersUtilsProvider} from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'
import ruLocale from 'date-fns/locale/ru'
import {ThemeProvider, createMuiTheme} from '@material-ui/core/styles'

const customTheme = {
  overrides: {
    MUIDataTableBodyCell: {
      root: {
        lineHeight: 1.3
      }
    },
    MuiTableCell: {
      root: {
        padding: '10px'
      }
    }
  }
}

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={createMuiTheme(customTheme)}>
      <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ruLocale}>
        <Router>
          <App />
        </Router>
      </MuiPickersUtilsProvider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
)