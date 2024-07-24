// npx json-server --watch -p 5500 apiFile.json 
// https://basmalayaser.github.io/CustonerTransaction/

AOS.init();


$(window).on("load resize ", function() {
  var scrollWidth = $('.tbl-content').width() - $('.tbl-content table').width();
  $('.tbl-header').css({'padding-right':scrollWidth});
}).resize();

getAllTransaction()
async function getAllTransaction(){
  let responce= await fetch(`https://raw.githubusercontent.com/Basmalayaser/CustonerTransaction/main/apiFile.json`)
  let data = await responce.json()
  let transactions=data.transactions
  let customers=data.customers
  add(transactions)
  displayTransaction(customers,transactions)
}


function add(transaction){

  for (let i = 0; i < transaction.length; i++) {
    transaction[i].view='';
  }
}


function displayTransaction(customers,transaction){
    let cartoona=""
     transaction.forEach(element => {
      customers.map((cust)=>{
       if( element.customer_id==cust.id){
        let date=new Date(element.date)
        let day =date.getDate()
        let month=date.toLocaleString('en-us',{month:'long'})
        let year=date.getFullYear()
        cartoona +=`<tr>
                <td>${element.customer_id}</td>
                <td>${cust.name}</td>              
                <td>${day}${month} ${year}</td>
                <td>${"$  "}${element.amount}</td>
                <td><button id="${element.customer_id}" class="btn btn-outline-light">view  <i class="fa-regular fa-eye"></i></button></td>
            </tr>`
       }
      })
    })

    tbody.innerHTML=cartoona;

    let list =document.querySelectorAll(".btn")

    for (let i = 0; i < list.length; i++) {
       list[i].addEventListener('click',function(){
        const y = charts.getBoundingClientRect().top + window.scrollY;
        window.scroll({
          top: y,
          behavior: 'smooth'
        });
        linechart(list[i].id,transaction)
        pieChart(list[i].id,transaction)
   })
}
}


document.querySelector("#searchByName").addEventListener("input",function(e){
  searchByName(this.value)
})

document.querySelector("#searchByAmount").addEventListener("input",function(e){
   searchByAmount(this.value)
})
 


async function searchByName(name){
  var results = [];
  var searchField = "name";
  var searchVal = name;
  let responce= await fetch(`https://raw.githubusercontent.com/Basmalayaser/CustonerTransaction/main/apiFile.json`)
  let data = await responce.json()
  let transactionData=data.transactions
  let searchedData=data.customers

for (var i=0 ; i < searchedData.length ; i++)
{
    if (searchedData[i][searchField].toLowerCase().includes(searchVal.toLowerCase())) {
        results.push(searchedData[i]);
    }
    displayTransaction(results,transactionData)
}
}


async function searchByAmount(search){
  let responce= await fetch(`https://raw.githubusercontent.com/Basmalayaser/CustonerTransaction/main/apiFile.json`)
  let data = await responce.json()
  let transaction=data.transactions
  let customerData=data.customers
  let amount =transaction.filter((ele)=>ele.amount==search)
  displayTransaction(customerData,amount)

}


function linechart(id,transactions){
  let amount=[]
  let date=[]
   let user =transactions.filter((ele)=>ele.customer_id==id)
   for (let i = 0; i < user.length; i++) {
     amount.push(user[i].amount);
     date.push(user[i].date);

   }

  const ctx = document.getElementById('myChart');

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: date,
      datasets: [{
        label: '#total transaction amount per day',
        data: amount,
        borderWidth: 1,
        backgroundColor:"#7ec3fa"
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}


// pieChart()
function pieChart(id,transactions){

  let amount=[]
  let date=[]
   let user =transactions.filter((ele)=>ele.customer_id==id)
   for (let i = 0; i < user.length; i++) {
     amount.push(user[i].amount);
     date.push(user[i].date);

   }


const xValues = date;
const yValues = amount;
const barColors = [
  "#5DADE2",
  "#E8DAEF",
  "#D6EAF8",
  "#D7BDE2",
  "#AED6F1"
];

new Chart("myChart2", {
  type: "pie",
  data: {
    labels: xValues,
    datasets: [{
      backgroundColor: barColors,
      data: yValues
    }]
  },
  options: {
    title: {
      display: true,
      text: "World Wide Wine Production 2018"
    }
  }
});

}