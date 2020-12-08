
/* home.js */

import { getCookie, showMessage, apiURL} from '../js/core.js'

export async function setup() {
	if(getCookie('authorization')) {
		console.log('user is logged in')
        document.getElementById("loginOut").innerHTML  = "Logout" //change the nav to logout
	}
	try {
        document.getElementById("footer").hidden = false //show footer again
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
