// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import {getAuth,GoogleAuthProvider,signInWithPopup} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDLtbu7znzhba1IkzxfptkSbCIaQgUSDlE",
  authDomain: "fir-bcaf6.firebaseapp.com",
  databaseURL: "https://fir-bcaf6-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "fir-bcaf6",
  storageBucket: "fir-bcaf6.appspot.com",
  messagingSenderId: "214512315771",
  appId: "1:214512315771:web:bb12e5cc764754212161de"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
import{getDatabase, set,get,remove,update,ref,child} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js"

const db=getDatabase();
const auth=getAuth(app);
console.log("Auth Initialized");
const provider=new GoogleAuthProvider();
console.log("Provider Initialized");

let submitBtn=document.querySelector("#submit");
let getBtn=document.querySelector("#get");
let signBtn=document.querySelector("#sign");

let myTable=document.querySelector("#table");

var enterParticular=document.querySelector("#particular");
var enterRate=document.querySelector("#rate");
var enterDate=document.querySelector("#Date");

function insertData(){
    if(enterParticular.value=="" || enterRate.value==""){
        alert("Please enter all the fields");
    }else{
        set(ref(db,enterDate.value+"/"+enterParticular.value),{
            Particular:enterParticular.value,
            Rate:enterRate.value
        })
        .then(()=>{
            alert("Data Inserted");
        })
        .catch((error)=>{
            alert(error);
        })
    }
}

function getData(){
    const dbref=ref(db);
    get(child(dbref,enterDate.value+"/"))
    .then((snapshot)=>{
        if(snapshot.exists()){
            var dict=[];
            var total=0;
            var data=snapshot.val();
            for(var key in data){
                dict.push({
                    date:enterDate.value,
                    particular:data[key].Particular,
                    rate:data[key].Rate
                });
                total+=parseInt(data[key].Rate);
            }
            var headers=["Date","Particular","Rate","Total"];
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
            
            var done=false;

            dict.forEach(emp =>{
                let row= document.createElement("tr");
                Object.values(emp).forEach(text=>{
                    let cell= document.createElement("td");
                    let textNode= document.createTextNode(text);
                    cell.appendChild(textNode);
                    row.appendChild(cell);
                });
                if(done==false){
                    let cell= document.createElement("td");
                    let textNode= document.createTextNode(total);
                    cell.appendChild(textNode);
                    row.appendChild(cell);
                    done=true;
                }
                table.appendChild(row);
            });
            myTable.appendChild(table);
        }else{
            alert("No data available");
        }
    })  
}

function signIn(){
    signInWithPopup(auth,provider)
    .then((result)=>{
        const credential=GoogleAuthProvider.credentialFromResult(result);
        alert("Logged In Successfully, now u can insert data");
    }).catch((error)=>{
        const errorCode=error.code;
        const errorMessage=error.message;
        const email=error.customData.email;
        const credential=GoogleAuthProvider.credentialFromError(error);

        console.log("Error Code:"+errorCode);
        console.log("Error Message:"+error<errorMessage);
        console.log("Email:"+email);
        console.log("Credential:"+credential);
    })
}

signBtn.addEventListener("click",signIn);
submitBtn.addEventListener("click",insertData);
getBtn.addEventListener("click",getData);