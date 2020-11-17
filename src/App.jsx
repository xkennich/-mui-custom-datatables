import React from 'react'
import Grid from '@material-ui/core/Grid'
import StatisticTable from './StatisticTable'

function App() {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <StatisticTable />
      </Grid>
    </Grid>
  )
}

export default App;
