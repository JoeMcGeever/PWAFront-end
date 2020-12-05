
/* core.js */

export function generateToken(user, pass) {
	const token = `${user}:${pass}`
	const hash = btoa(token)
	return `Basic ${hash}`
}

export async function login() {
	if(!getCookie('authorization')) throw new Error('cookie not found')
	const options = { headers: { Authorization: getCookie('authorization') } }
	const response = await fetch('/login',options)
	const status = response.status
	console.log(`HTTP status code: ${status}`)
	if(response.status === 401)  throw new Error('status 401 NOT AUTHORIZED')
}

// from plainjs.com
export function setCookie(name, value, days) {
	const d = new Date
	d.setTime(d.getTime() + 24*60*60*1000*days)
	document.cookie = `${name}=${value};path=/;expires=${d.toGMTString()}`
}

export function getCookie(name) {
	const v = document.cookie.match(`(^|;) ?${name}=([^;]*)(;|$)`)
	return v ? v[2] : null
}

export function deleteCookie(name) {
	setCookie(name, '', -1)
}

export function onlineStatus() {
	if(navigator.onLine) {
		return true
	} else {
		return false
	}
}

export function showMessage(message) {
	console.log(message)
	document.querySelector('aside p').innerText = message
	document.querySelector('aside').classList.remove('hidden')
	setTimeout( () => document.querySelector('aside').classList.add('hidden'), 2000)
}

export function getLocation() {
	if(navigator.geolocation) {
		console.log('location supported')
		navigator.geolocation.getCurrentPosition( position => {
			const pos = position.coords
			const locString = `lat: ${pos.latitude}, lon: ${pos.longitude}`
			document.getElementById('location').innerHTML = `${locString}<br />&nbsp;`
		})
	} else {
		console.log('geolocation not supported')
	}
}
