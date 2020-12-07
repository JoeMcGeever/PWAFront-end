
/* login.js */

import { generateToken, getCookie, setCookie, showMessage, getLocation, apiURL } from '../js/core.js'

let isPageLogin = true

export function setup() {
	const cookie = getCookie('authorization') //if the user is already logged in
	if(getCookie('authorization')) {
		console.log('logging out')
        //delete from session storage
        navigator.geolocation.clearWatch(getCookie('geoID'))
        deleteCookie('authorization')
        deleteCookie('geoID')
		window.location.href = '/#home'
	}

   
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
	try {
		event.preventDefault()
		const elements = [...document.forms['loginForm'].elements]
		const data = {}
		elements.forEach( el => {
			if(el.name) data[el.name] = el.value
		})
		const token = generateToken(data.user, data.pass)
		console.log(token)
		const options = { headers: { Authorization: token } }
        
        //url for api
        const url = `${apiURL}/v1/accounts/${data.user}`
		const response = await fetch(url,options)
        
        
        const json = await response.json()
		console.log(json)
		const status = response.status
		console.log(`HTTP status code: ${response.status}`)
		if(response.status === 401) throw new Error(json.msg)
		if(response.status === 200) {
            console.log("Logged In!")
			setCookie('authorization', token, 1)
			window.location.href = '#home'
		}
	} catch(err) {
		showMessage(err.message)
	}
}

async function registerAccount(event) {
	event.preventDefault()
	try {
		const elements = [...document.forms['registerForm'].elements]
		const data = {}
		elements.forEach( el => { if(el.name) data[el.name] = el.value })
		console.log(data)
		const options = { method: 'post', body: JSON.stringify(data) }
		const response = await fetch('/register',options)
        //const response = await fetch('/v1/accounts/',options)
		const json = await response.json()
		if(response.status === 422) throw new Error(`422 Unprocessable Entity: ${json.msg}`)
		window.location.href = '/#login'
	} catch(err) {
		showMessage(err.message)
	}
}






