
/* home.js */

import { getCookie, login, showMessage } from '../js/core.js'

const apiURL = 'https://arizona-spray-8080.codio-box.uk'

export async function setup() {
	try {
		console.log('MAIN SCRIPT')
		const url = `${apiURL}/accounts`
		console.log(url)
		const json = await fetch(url)
		const data = await json.json()
		console.log(data)
		document.querySelector('main p').innerText = data.msg
	} catch(err) {
		console.log(err)
		window.location.href = '/#login'
	}
}
