const translateTable = {
  body: {
    noMatch: 'К сожалению, совпадений не найдено',
    toolTip: 'Сортировка',
    columnHeaderTooltip: column => `Сортировать по ${column.label}`
  },
  pagination: {
    next: 'Следующая',
    previous: 'Предыдущая',
    rowsPerPage: 'Строк:',
    displayRows: 'из'
  },
  toolbar: {
    search: 'Поиск',
    print: 'Печать',
    downloadCsv: "Скачать CSV",
    viewColumns: 'Показать столбцы',
    filterTable: 'Фильтр'
  },
  filter: {
    all: 'ВСЕ',
    title: 'ФИЛЬТР',
    reset: 'СБРОС'
  },
  selectedRows: {
    text: "строк выбрано",
    delete: "Удалить",
    deleteAria: "Удалить выбранные строки",
  },
  viewColumns: {
    title: 'Показать столбцы таблицы',
    titleAria: 'Показать/скрыть столбцы'
  }
}
export default translateTable