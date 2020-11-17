const payments = [
  {"id":9129,"amount":1968,"changeDate":"2020-09-13T17:27:11.063Z"},
  {"id":9130,"amount":2216,"changeDate":"2020-09-13T17:27:11.063Z"},
  {"id":9131,"amount":2594,"changeDate":"2020-09-13T17:27:11.063Z"},
  {"id":9133,"amount":1790,"changeDate":"2020-09-13T17:27:11.063Z"},
  {"id":9134,"amount":2862,"changeDate":"2020-09-13T17:27:11.063Z"},
]

function getData(dictionary){
  const response = []
  const date = new Date()
  const randomInteger = (min, max) => {
    let rand = min + Math.random() * (max + 1 - min)
    return Math.floor(rand)
  }
  for( let i = 0; i <= 30; i++){
    let data = {}
    let sum = 0
    dictionary.map( item => {
      const int = randomInteger(2000, 5000)
      data[item.value] = int 
      sum += int
      return true
    })
    data.date = date.setDate(i + 1)
    data.sum = sum
    data.payments = payments
    response.push(data)
  }
  return response
}
  
const dictionary = [
  {value:30705, name:"Отделение №705"},
  {value:30755, name:"Отделение №755"},
  {value:30756, name:"Отделение №756"},
  {value:30768, name:"Отделение №768"},
  {value:30925, name:"Отделение №925"},
  {value:31077, name:"Отделение №1077"}
]

const data = getData(dictionary)
console.log(data)

export {
  data,
  dictionary
}