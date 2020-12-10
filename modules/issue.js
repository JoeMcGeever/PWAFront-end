/* issue.js */

import { getCookie, showMessage, apiURL} from '../js/core.js'

export async function setup(issueID) {
	if(getCookie('authorization')) {
		console.log('user is logged in')
        document.getElementById("loginOut").innerHTML  = "Logout" //change the nav to logout
	} else {
        showMessage("You have to log in first")
        window.location.href = '/#login'
    }
	try {
        document.getElementById("footer").hidden = false //show footer again
		console.log('MAIN SCRIPT')
		const url = `${apiURL}/v1/issue/${issueID}`
		const json = await fetch(url)
		const data = await json.json()
		console.log(data)
        await setupIssue(data)
// 		document.querySelector('main p').innerText = data.msg
	} catch(err) {
		console.log(err)
	}
}


async function setupIssue(data){
    console.log("Called setup issue")
}