/* login.js */

import { generateToken, getCookie, setCookie, deleteCookie, showMessage, getLocation, apiURL } from '../js/core.js'

let isPageLogin = true

export function setup() {
	const cookie = getCookie('authorization') //if the user is already logged in
	if(getCookie('authorization')) {
		console.log('logging out')
        //delete from session storage
        document.getElementById("loginOut").innerHTML  = "Log in / Signup" //change the nav to logout
        navigator.geolocation.clearWatch(getCookie('geoID'))
        deleteCookie('authorization')
        deleteCookie('geoID')
        deleteCookie('userID')
		window.location.href = '/#home'
	}

   
     document.getElementById("footer").hidden = true //hide unnecessary footer
    
        const
      loginElement = document.getElementById('login'),
      register = document.getElementById('register'),
      switchView = document.getElementById('switch')
    loginElement.addEventListener('click', async event => await login(event))
    switchView.addEventListener('click', async event => await changeBox(event))
    register.addEventListener('click', async event => await registerAccount(event))

}


async function changeBox() {
    if(isPageLogin){
        isPageLogin = false
        console.log("Now changing to register")
        document.getElementById("loginForm").hidden = true
        document.getElementById("registerForm").hidden = false
        document.getElementById("switchText").innerHTML  = "Already have an account?"
        document.getElementById("switch").innerHTML = "Login"
    } else {
        isPageLogin = true
        console.log("Now changing to login")
        document.getElementById("loginForm").hidden = false
        document.getElementById("registerForm").hidden = true
        document.getElementById("switchText").innerHTML = "Need to register?"
        document.getElementById("switch").innerHTML = "Sign up"
    }
}




async function login() {
    event.preventDefault()
    //validation for forms:
    let validation = false
        
    if(document.forms["loginForm"]["user"].value.length == 0){
        document.forms["loginForm"]["user"].style.borderColor="red"
        validation = true
    } else {
        document.forms["loginForm"]["user"].style.borderColor=""
    }
    if(document.forms["loginForm"]["pass"].value.length == 0){
        document.forms["loginForm"]["pass"].style.borderColor="red"
        validation = true
    } else {
        document.forms["loginForm"]["user"].style.borderColor=""
    }
    if(validation==true){
        showMessage("Please fill in all of the details")
        return
    }
    
	try {
		const elements = [...document.forms['loginForm'].elements]
		const data = {}
		elements.forEach( el => {
			if(el.name) data[el.name] = el.value
		})
		const token = generateToken(data.user, data.pass)
		console.log(token)
		const options = { headers: { authorization: token}}

        //url for api
        const url = `${apiURL}/v1/accounts/${data.user}`
        console.log(`url = ${url}`)
		const response = await fetch(url,options)
        
        
        const json = await response.json()
		console.log(json)
		const status = response.status
		console.log(`HTTP status code: ${response.status}`)
		if(response.status === 200) {
            console.log("Logged In!")
            document.getElementById("loginOut").innerHTML  = "Logout" //change the nav to logout
			setCookie('authorization', token, 1)
            setCookie('userID', json.userID, 1)
			window.location.href = '#home'
		} else {
            throw new Error(json.err)
        }
	} catch(err) {
		showMessage(err.message)
	}
}

async function registerAccount(event) {
	event.preventDefault()
    //validation for forms:
    let validation = false
        
    if(document.forms["registerForm"]["user"].value.length == 0){
        document.forms["registerForm"]["user"].style.borderColor="red"
        validation = true
    } else {
        document.forms["registerForm"]["user"].style.borderColor=""
    }
    if(document.forms["registerForm"]["email"].value.length == 0){
        document.forms["registerForm"]["email"].style.borderColor="red"
        validation = true
    } else {
        document.forms["registerForm"]["email"].style.borderColor=""
    }
    if(document.forms["registerForm"]["pass"].value.length == 0){
        document.forms["registerForm"]["pass"].style.borderColor="red"
        validation = true
    } else {
        document.forms["registerForm"]["pass"].style.borderColor=""
    }
    if(document.forms["registerForm"]["location"].value.length == 0){
        document.forms["registerForm"]["location"].style.borderColor="red"
        validation = true
    } else {
        document.forms["registerForm"]["location"].style.borderColor=""
    }
    if(validation==true){
        showMessage("Please fill in all of the details")
        return
    }
	try {
		const elements = [...document.forms['registerForm'].elements]
		const data = {}
		elements.forEach( el => { if(el.name) data[el.name] = el.value })
		console.log(data)
		const options = { method: 'post', body: JSON.stringify(data) }
        
		 //url for api
        const url = `${apiURL}/v1/accounts/`
        //console.log(`url = ${url}`)
		const response = await fetch(url,options)

		const json = await response.json()
        
        console.log(typeof(json))
        console.log(json)
        console.log(json.status)
        
         if(response.status === 201) {
             window.location.href = '/#home'
         } else {
             throw new Error(`${response.status}: ${json.err}`)
         }
         
        
	} catch(err) {
		showMessage(err.message)
	}
}






