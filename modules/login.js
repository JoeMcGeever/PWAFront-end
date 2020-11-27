
/* login.js */

import { generateToken, getCookie, setCookie, showMessage, getLocation } from '../js/core.js'

export function setup() {
	const cookie = getCookie('authorization')
	if(getCookie('authorization')) {
		console.log('authorised')
		window.location.href = '/#home'
	}
	document.querySelector('h1').innerText = 'Log In'
	document.querySelector('form').addEventListener('submit', async event => await login(event))
}

async function login() {
	try {
		event.preventDefault()
		const elements = [...document.forms['login'].elements]
		const data = {}
		elements.forEach( el => {
			if(el.name) data[el.name] = el.value
		})
		const token = generateToken(data.email, data.pass)
		console.log(token)
		const options = { headers: { Authorization: token } }
		const response = await fetch('/login',options)
		const json = await response.json()
		console.log(json)
		const status = response.status
		console.log(`HTTP status code: ${response.status}`)
		if(response.status === 401) throw new Error(json.msg)
		if(response.status === 200) {
			setCookie('authorization', token, 1)
			window.location.href = '#home'
		}
	} catch(err) {
		showMessage(err.message)
	}
}
