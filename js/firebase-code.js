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

var signName=document.getElementById("signInfo");
var signOutBtn=document.getElementById("signOut");

let myTable=document.querySelector("#table");

var enterParticular=document.querySelector("#particular");
var enterRate=document.querySelector("#rate");
var enterDate=document.querySelector("#Date");

function insertData(){
    if(enterParticular.value=="" || enterRate.value==""){
        displayMessage("Please enter all the fields");
    }else{
        if(enterRate.value<0){
            displayMessage("Price should not be negative!");
            return;
        }
        set(ref(db,enterDate.value+"/"+enterParticular.value),{
            Particular:enterParticular.value,
            Rate:enterRate.value
        })
        .then(()=>{
            displayMessage("Data Inserted");
        })
        .catch((error)=>{
            alert(error);
        })
    }
}

function getData(){
    const dbref=ref(db);
    if(enterDate.value=="")
        {displayMessage("Please enter valid date");return;}
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
            table.setAttribute('class','table table-dark');
            let headerRow= document.createElement("tr");
            headers.forEach(headerText=>{
                let header= document.createElement("th");
                let textNode= document.createTextNode(headerText);
                header.appendChild(textNode);
                headerRow.appendChild(header);
            });
            table.appendChild(headerRow);
            myTable.appendChild(table);
            var divTable=document.getElementById("table");
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
            divTable.style.display="block";
        }else{
            displayMessage("No data available");
        }
    })  
}

function signIn(page){
    signInWithPopup(auth,provider)
    .then((result)=>{
        const credential=GoogleAuthProvider.credentialFromResult(result);
        var xhr=new XMLHttpRequest();
        xhr.onreadystatechange=function() {
            if(xhr.readyState===XMLHttpRequest.DONE){
                if(xhr.status==200){
                    document.body.innerHTML=xhr.responseText;
                }else{
                    alert("Cannot load webpage");
                }
            }
        }
        xhr.open('GET',"design"+".html",true);
        xhr.send();
        displayMessage("Logged In Successfully, now u can insert data");
        let cssLink=document.getElementById("cssProperty");
        CSSPropertyRule.href="design.css";
        
        signBtn.style.display="none";
        signName.innerHTML="Welcome "+result.user.displayName;
        signName.style.display="block";

        signOutBtn.style.display="block";
        signOutBtn.innerHTML="Sign Out";
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

function signOut(){
    auth.signOut().then(()=>{
        signName.style.display="none";
        signBtn.style.display="block";
        signOutBtn.style.display="none";
        displayMessage("Signed Out");
    }).catch((error)=>{
        alert(error);
    })
}

function displayMessage(msg) {
    var x = document.getElementById("snackbar");
    x.className = "show";
    x.innerHTML=msg;
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}
signBtn.addEventListener("click",signIn);
submitBtn.addEventListener("click",insertData);
getBtn.addEventListener("click",getData);
signOutBtn.addEventListener("click",signOut);