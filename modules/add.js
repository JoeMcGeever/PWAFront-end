
/* add.js */

import { getCookie, showMessage, getLocation, apiURL } from '../js/core.js'
//import fs from 'fs'
//const fs = require('fs');


export function setup() {
    if(getCookie('authorization')) {
		console.log('user is logged in')
        document.getElementById("loginOut").innerHTML  = "Logout" //change the nav to logout
	} else {
        showMessage("You have to log in first")
        window.location.href = '/#login'
    }
    document.getElementById("footer").hidden = true //hide unnecessary footer
	const cookie = getCookie('authorization') //if the user is already logged in

    
    const addElement = document.getElementById('addIssue')
    addElement.addEventListener('click', async event => await add(event))

}

async function add(event) {
    event.preventDefault()
    let validation = false
        
    if(document.forms["addForm"]["title"].value.length == 0){
        document.forms["addForm"]["title"].style.borderColor="red"
        validation = true
    } else {
        document.forms["addForm"]["title"].style.borderColor=""
    }
    if(document.forms["addForm"]["location"].value.length == 0){
        document.forms["addForm"]["location"].style.borderColor="red"
        validation = true
    } else {
        document.forms["addForm"]["location"].style.borderColor=""
    }
    if(document.forms["addForm"]["description"].value.length == 0){
        document.forms["addForm"]["description"].style.borderColor="red"
        validation = true
    } else {
        document.forms["addForm"]["description"].style.borderColor=""
    }
    if(validation==true){
        showMessage("Please fill in all of the required details")
        return
    }
    
    var postcodeRegEx = /[A-Z]{1,2}[0-9]{1,2} ?[0-9][A-Z]{2}/i //reg expression for postcode format 
    
    if(!postcodeRegEx.test(document.forms["addForm"]["location"].value)){ //check if a valid postcode
        document.forms["addForm"]["location"].style.borderColor="red"
        showMessage("Please enter a valid uk postcode")
        return
    }
    
    
    
	try {
		const elements = [...document.forms['addForm'].elements]
		const data = {}
        let imageElement
		elements.forEach( el => {
            if(el.name=='img') {
                imageElement = el //skip over the image file for now
            } else if(el.name){
                data[el.name] = el.value
            }
		})
		const token = getCookie('authorization')
        const userID = getCookie('userID')
        
        
        data['userID'] = userID //append the userID to the request
        
        
        //url for api
        let url = `${apiURL}/v1/issue`
                
        if(imageElement.value != ''){
            const base64EncodedFile = await encode(imageElement.files[0]) //encode it
            data['image'] = base64EncodedFile //add to data to be sent
            console.log(base64EncodedFile)
//             data['image'] = "test"
            
            url = `${apiURL}/v2/issue/` //update the version of the URL we will be using (the one that allows image data to be sent)
        }
        
        console.log(data)
        console.log(url)

        const options = { headers: { authorization: token}, method: 'post', body: JSON.stringify(data) }


        //console.log(`url = ${url}`)
		const response = await fetch(url,options)
        
        
        const json = await response.json()
		console.log(json)
		const status = response.status
		console.log(`HTTP status code: ${response.status}`)
		if(response.status === 201) {
            showMessage("Issue added!")
			document.getElementById("addForm").reset();
		} else {
            throw new Error(json.err)
        }
	} catch(err) {
		showMessage(err.message)
	}
}


// encodes file data to base64
// function encode(file) {
//     var bitmap = fs.readFileSync(file) // read as binary data
//     return new Buffer(bitmap).toString('base64'); //convert the binary data to base64 string and return
// }

// encodes file data to base64
// async function encode(file) {
//        var reader = new FileReader()
//        reader.readAsDataURL(file)
//        reader.onload = function () {
//            console.log("2")
//            return reader.result
//        }
//        reader.onerror = function (error) {
//            throw new Error(error)
//        }
// }


// encodes file data to base64 -- returns a promise
const encode = async(file) => {
    return new Promise((resolve, reject) => {
      var reader = new FileReader()
       reader.readAsDataURL(file)
       reader.onload = function () {
           console.log("2")
           resolve(reader.result)
       }
       reader.onerror = function (error) {
           reject(error)
       }
})
}
                    