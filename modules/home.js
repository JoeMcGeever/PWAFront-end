
/* home.js */

import { getCookie, login, showMessage, apiURL} from '../js/core.js'

export async function setup() {
	try {
		console.log('MAIN SCRIPT')
		const url = `${apiURL}/v1/accounts`
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
