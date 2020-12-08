
/* add.js */

import { getCookie, showMessage, getLocation, apiURL } from '../js/core.js'

export function setup() {
    if(getCookie('authorization')) {
		console.log('user is logged in')
        document.getElementById("loginOut").innerHTML  = "Logout" //change the nav to logout
	}
    document.getElementById("footer").hidden = true //hide unnecessary footer
	const cookie = getCookie('authorization') //if the user is already logged in
	if(getCookie('authorization')) {
		console.log('logged in so is ok')
	} else {
        window.location.href = '/#login'
    }

    
    const addElement = document.getElementById('addIssue')
    addElement.addEventListener('click', async event => await add(event))

}

async function add(event) {
	try {
		event.preventDefault()
		const elements = [...document.forms['addForm'].elements]
		const data = {}
		elements.forEach( el => {
			if(el.name) data[el.name] = el.value
		})
		const token = getCookie('authorization')
        const userID = getCookie('userID')
        
        
        data['userID'] = userID //append the userID to the request
        
        console.log(data)

        const options = { headers: { authorization: token}, method: 'post', body: JSON.stringify(data) }

        //url for api
        const url = `${apiURL}/v1/issue/`
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