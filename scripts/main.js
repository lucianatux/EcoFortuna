const form= document.getElementById("transactionForm");

form.addEventListener("submit", function(event){
    event.preventDefault();
    let transactionFormData = new FormData(form);
    let transactionObj = convertFormDataToTransactionObject(transactionFormData);
    saveTransactionObj(transactionObj);
    insertRowInTransactionTable(transactionObj);
    form.reset();
})


document.addEventListener("DOMContentLoaded", function(event){
    drawCategory();
    let transactionObjArray = JSON.parse(localStorage.getItem("transactionData"));
    transactionObjArray.forEach(
        function(arrayElement){
            insertRowInTransactionTable(arrayElement);
        }
    )});

function getNewTransactionId(){
    let lastTransactionId = localStorage.getItem("lastTransactionId") || "-1";
    let newTransactionId = JSON.parse(lastTransactionId) + 1;
    localStorage.setItem("lastTransactionId", JSON.stringify(newTransactionId));
    return newTransactionId;
}

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
//elimino la transaccion segun el id que paso como parámetro
function deleteTransactionObj(transactionId){
    //obtengo las transacciones de mi base de datos, desconvierto de json a objeto
    let transactionObjArray = JSON.parse(localStorage.getItem("transactionData"));
    //busco el indice o posicion de la transaccion que quiero eliminar
    let transactionIndexInArray = transactionObjArray.findIndex(element => element.transactionId == transactionId);
    //elimino la transaccion de esa posicion
    transactionObjArray.splice(transactionIndexInArray, 1);
    //convierto de objeto a json
    let transactionArrayJSON = JSON.stringify(transactionObjArray);
    //guardo mi array de transaccion en formato json en el local storage
    localStorage.setItem("transactionData", transactionArrayJSON);
}

function saveTransactionObj(transactionObj){
    let myTransactionArray = JSON.parse(localStorage.getItem("transactionData")) || [];
    myTransactionArray.push(transactionObj);
    //Convierto mi array de transaction a json
    let transactionArrayJSON = JSON.stringify(myTransactionArray);
    //Guardo mi array de transaccion en formato json en el local storage
    localStorage.setItem("transactionData", transactionArrayJSON);
}

function insertCategory(categoryName){
    const selectElement = document.getElementById("transactionCategory");
    let htmlToInsert = `<option> ${categoryName} </option>`; 
    selectElement.insertAdjacentHTML("beforeend", htmlToInsert);
}

function drawCategory(){
    let allCategories = [
        "comida","ocio", "tecnología","transporte"
    ];
    for (let i = 0; i < allCategories.length; i++){
        insertCategory(allCategories[i])
    }
}

//MODO OSCURO - MODO CLARO 
document.getElementById('darkmode').addEventListener('click', function(){
    if (document.body.style.background == 'var(--second-color)'){
        document.body.style.background = 'var(--first-color)';
        document.body.style.color = 'var(--second-color)'
    }else{  
        document.body.style.background = 'var(--second-color)';
        document.body.style.color = 'var(--first-color)'
    }
})

//BOTONES TOTALES
