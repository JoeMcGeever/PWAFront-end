
/* add.js */

import { getCookie, showMessage, getLocation } from '../js/core.js'

export function setup() {
	const cookie = getCookie('authorization') //if the user is already logged in
	if(getCookie('authorization')) {
		console.log('logged in so is ok')
	} else {
        window.location.href = '/#login'
    }

}