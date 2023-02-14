const form= document.getElementById("transactionForm");

//submit form
form.addEventListener("submit", function(event){
    event.preventDefault();
    let transactionFormData = new FormData(form);
    let transactionObj = convertFormDataToTransactionObject(transactionFormData);
    saveTransactionObj(transactionObj);
    insertRowInTransactionTable(transactionObj);
    form.reset();
})

//draw categories of the storage when dom is loaded
document.addEventListener("DOMContentLoaded", function(event){
    drawCategory();
    let transactionObjArray = JSON.parse(localStorage.getItem("transactionData"));
    transactionObjArray.forEach(
        function(arrayElement){
            insertRowInTransactionTable(arrayElement);
        }
    )});

//returns a new unique ID for a transaction
function getNewTransactionId(){
    let lastTransactionId = localStorage.getItem("lastTransactionId") || "-1";
    let newTransactionId = JSON.parse(lastTransactionId) + 1;
    localStorage.setItem("lastTransactionId", JSON.stringify(newTransactionId));
    return newTransactionId;
}

//takes a FormData object as an argument and returns a JavaScript object representing a transaction
function convertFormDataToTransactionObject(transactionFormData){
    let transactionType= transactionFormData.get("transactionType");
    let transactionDescription= transactionFormData.get("transactionDescription");
    let transactionAmount= transactionFormData.get("transactionAmount");
    let transactionCategory= transactionFormData.get("transactionCategory");
    let transactionId= getNewTransactionId();
    return {
        "transactionType": transactionType, 
        "transactionDescription": transactionDescription, 
        "transactionAmount": transactionAmount , 
        "transactionCategory": transactionCategory ,
        "transactionId" : transactionId
    }
}

//takes a transaction object as an argument and inserts a new row into the transaction table 
function insertRowInTransactionTable(transactionObj){
    let transactionTableRef = document.getElementById("transactionTable");

    let newTransactionRow = transactionTableRef.insertRow(-1);
    newTransactionRow.setAttribute("data-transaction-id", transactionObj["transactionId"]);

    let newCellRef = newTransactionRow.insertCell(0);
    newCellRef.textContent= transactionObj["transactionType"];

    newCellRef = newTransactionRow.insertCell(1);
    newCellRef.textContent = transactionObj["transactionDescription"];

    newCellRef = newTransactionRow.insertCell(2);
    newCellRef.textContent = transactionObj["transactionAmount"];

    newCellRef = newTransactionRow.insertCell(3);
    newCellRef.textContent = transactionObj["transactionCategory"];

    let newDeleteCell = newTransactionRow.insertCell(4);
    let deleteButton = document.createElement("button");
    deleteButton.textContent = "Eliminar";
    newDeleteCell.appendChild(deleteButton);
    deleteButton.addEventListener("click", (event) =>{
       let transactionRow = event.target.parentNode.parentNode;
       console.log(transactionRow.getAttribute("data-transaction-id"));
       let transactionId = transactionRow.getAttribute("data-transaction-id");
       transactionRow.remove();
       deleteTransactionObj(transactionId);
    })
   
}
//takes a transaction ID as an argument and removes the corresponding transaction object from the localStorage
function deleteTransactionObj(transactionId){
    let transactionObjArray = JSON.parse(localStorage.getItem("transactionData"));
    let transactionIndexInArray = transactionObjArray.findIndex(element => element.transactionId == transactionId);
    transactionObjArray.splice(transactionIndexInArray, 1);
    let transactionArrayJSON = JSON.stringify(transactionObjArray);
    localStorage.setItem("transactionData", transactionArrayJSON);
}

// takes a transaction object as an argument and saves it to localStorage
function saveTransactionObj(transactionObj){
    let myTransactionArray = JSON.parse(localStorage.getItem("transactionData")) || [];
    myTransactionArray.push(transactionObj);
    let transactionArrayJSON = JSON.stringify(myTransactionArray);
    localStorage.setItem("transactionData", transactionArrayJSON);
}

//provides a way to dynamically add new categories to the transaction category select element
function insertCategory(categoryName){
    const selectElement = document.getElementById("transactionCategory");
    let htmlToInsert = `<option> ${categoryName} </option>`; 
    selectElement.insertAdjacentHTML("beforeend", htmlToInsert);
}

//adds a predefined set of categories to the transaction category select element
function drawCategory(){
    let allCategories = [
        "comida","ocio", "tecnología","transporte"
    ];
    for (let i = 0; i < allCategories.length; i++){
        insertCategory(allCategories[i])
    }
}

//dark mode/light mode
document.getElementById('darkmode').addEventListener('click', function(){
    if (document.body.style.background == 'var(--second-color)'){
        document.body.style.background = 'var(--first-color)';
        document.body.style.color = 'var(--second-color)'
    }else{  
        document.body.style.background = 'var(--second-color)';
        document.body.style.color = 'var(--first-color)'
    }
})

//buttons totales
