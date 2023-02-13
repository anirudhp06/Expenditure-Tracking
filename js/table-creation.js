let btnGet= document.querySelector("#get");
let myTable= document.querySelector("#table");

var dateValue=document.querySelector("#Date");

let emplyoees= [
    {name: "Heisenberg", age: 51, country:"USA"},
    {name: "Saul", age: 35, country:"Albania"},
    {name: "Mike", age: 75, country:"New Mexico"},

]

let headers=["Name", "Age", "Country"];

btnGet.addEventListener("click", ()=>{
    if(myTable.firstChild) myTable.removeChild(myTable.firstChild);
    let table= document.createElement("table");
    let headerRow= document.createElement("tr");
    headers.forEach(headerText=>{
        let header= document.createElement("th");
        let textNode= document.createTextNode(headerText);
        header.appendChild(textNode);
        headerRow.appendChild(header);
    });
    table.appendChild(headerRow);
    myTable.appendChild(table);

    emplyoees.forEach(emp =>{
        let row= document.createElement("tr");
        Object.values(emp).forEach(text=>{
            let cell= document.createElement("td");
            let textNode= document.createTextNode(text);
            cell.appendChild(textNode);
            row.appendChild(cell);
        });
        table.appendChild(row);
        
    });
    myTable.appendChild(table);
    
});
