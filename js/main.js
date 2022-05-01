//unload find locally stored data and display it

const hourKey = ['h1','h2','h3','h4','h5','h6','h7']
const minuteKey = ['m1','m2','m3','m4','m5','m6','m7']
const incentiveKey = ['i1','i2','i3','i4','i5','i6','i7']
const selectionKey = ['s1','s2','s3','s4','s5','s6','s7']

let dayIndex = findDayIndex()

console.log(dayIndex)

const tableRef = document.getElementById('numbersRan').getElementsByTagName('tbody')[0]

//if there is local data (day index is greater than 0) then call display day for each day to show the data

if(dayIndex > 0){
    for(i = 0; i < dayIndex; i++){
        displayDay(i)
    }
}


//setup local storage to save performance numbers throughout the week

document.querySelector('#submit').addEventListener('click', submit)

//start and end is always inside a single 24 hour period
//adjust for am and pm if start time is pm add 12

function findDayIndex(){
    for(i = 0; i < hourKey.length; i++){
        if(!localStorage.getItem(hourKey[i])){
            return i
        }
    } 
    return 7
}

function calcTime(start, end){
   // const regex = /(\d+):(\d+)\s*([AaPp][Mm])/
    const regex = /(\d+):(\d+)\s*/
    const matchedStart = start.match(regex)
    const matchedEnd = end.match(regex)
    let startWork = [Number(matchedStart[1]), Number(matchedStart[2])]
    let endWork = [Number(matchedEnd[1]), Number(matchedEnd[2])]
    // startWork[0] += matchedStart[3].toLowerCase() === 'pm' ? 12 : 0
    // endWork[0] += matchedEnd[3].toLowerCase() === 'pm' ? 12 : 0
    let startDate = new Date(0);
    startDate.setHours(startWork[0],startWork[1],0)
    let endDate = new Date(0);
    endDate.setHours(endWork[0],endWork[1],0)
    if(endDate < startDate){
        endDate.setDate(endDate.getDate() + 1)
    }
    let diff = endDate.getTime() - startDate.getTime();
    let hours = Math.floor(diff / 1000 / 60 / 60);
    diff -= hours * 1000 * 60 * 60;
    let minutes = Math.floor(diff / 1000 / 60);
    console.log(hours)
    console.log(minutes)
    return [hours, minutes]
    // console.log(endWork)
}

function displayDay(displayIndex){
    let newRow = tableRef.insertRow(-1)
    let hourCell = newRow.insertCell(0)
    let incentiveCell = newRow.insertCell(1)
    let selectionCell = newRow.insertCell(2)
    let hourText = document.createTextNode(localStorage.getItem(hourKey[displayIndex]) + ':' + (localStorage.getItem(minuteKey[displayIndex])))
    let incentiveText = document.createTextNode(localStorage.getItem(incentiveKey[displayIndex]))
    let selectionText = document.createTextNode(localStorage.getItem(selectionKey[displayIndex]))
    hourCell.appendChild(hourText)
    incentiveCell.appendChild(incentiveText)
    selectionCell.appendChild(selectionText)
}

function submit(){
    if(dayIndex > 6){
        return;
    }
    const startTime = document.querySelector('#startTime').value
    const endTime = document.querySelector('#endTime').value
    const incentive = document.querySelector('#incentive').value
    const hours = document.querySelector('#hours').value
    console.log(startTime)
    let timeWorked = calcTime(startTime,endTime)
    localStorage.setItem(hourKey[dayIndex], timeWorked[0])
    localStorage.setItem(minuteKey[dayIndex], timeWorked[1])
    localStorage.setItem(incentiveKey[dayIndex], incentive)
    localStorage.setItem(selectionKey[dayIndex], hours)
    displayDay(dayIndex)
    dayIndex += 1


    // let saveIncentive = incentive

    // if(!localStorage.getItem('incentive')){
    //     localStorage.setItem('incentive', 0)
    // }else{
    //     saveIncentive = localStorage.getItem('incentive') + " ; " + incentive
    //     localStorage.setItem('incentive', incentive)
    // }
    // document.querySelector('#save').innerText = localStorage.getItem('incentive')

 }
    // incentive = document.querySelector('#incentive').value
    // localStorage.setItem('incentive', incentive)
    // document.querySelector('#save').innerText = localStorage.getItem('incentive')

//reset local storage

document.querySelector('#reset').addEventListener('click', resetIncentive)

function resetIncentive(){
    localStorage.clear()
    dayIndex = 0
    tableRef.innerHTML = "";
    document.querySelector('h2').innerText = ''
}


//calculate the data, find the average for the performance and times that by hours in selection
//the hours not in selection times by flat hourly rate

document.querySelector('#calculate').addEventListener('click', calculateTotal)

function calculateTotal(){
    let totalHours = 0
    let totalMinutes = 0
    let totalIncentive = 0
    let totalSelection = 0
    let payRate = 25.71
    let incentivePay = 0
    let remainingPay = 0
    let totalPay = 0
    let comment = 'Man you suck'
    console.log(dayIndex)
    for(i = 0; i < dayIndex; i++){
        totalHours += Number(localStorage.getItem(hourKey[i]))
        totalMinutes += Number(localStorage.getItem(minuteKey[i]))
        totalIncentive += Number(localStorage.getItem(incentiveKey[i]))
        totalSelection += Number(localStorage.getItem(selectionKey[i]))
    }
    if(totalMinutes > 60){
        totalHours += Math.floor(totalMinutes / 60) 
        totalMinutes = totalMinutes % 60
    }
    totalHours = totalHours + (totalMinutes / 60) - (.5 * dayIndex)
    totalIncentive = totalIncentive / dayIndex

    //unfinished need the numbers from work

    if(totalIncentive >= 121){
        payRate = 50.93
        comment = 'Okay I guess you KINDA ran'
    }else if(totalIncentive >= 118){
        payRate = 28.93
        comment = 'Not even 120% though?'
    }else if(totalIncentive >= 115){
        payRate = 28.93
    }else if(totalIncentive >= 112){
        payRate = 28.93
    }else if(totalIncentive >= 109){
        payRate = 28.93
    }else if(totalIncentive >= 106){
        payRate = 28.93
    }else if(totalIncentive >= 103){
        payRate = 28.93
        comment = 'Damn you\'re slow.'
    }
    incentivePay = payRate * totalSelection 
    remainingPay = totalHours - totalSelection
    remainingPay = remainingPay * 25.71
    totalPay = incentivePay + remainingPay
    totalPay = totalPay.toFixed(2)
    document.querySelector('h2').innerText = `Your average for the week is ${totalIncentive} (${comment}) and your total pay for the week is $${totalPay}`
    
}

// let profit = calculateProfit(hourlyRate, hours, taxRate)

// let taxesHeld = holdForTaxes(profit)