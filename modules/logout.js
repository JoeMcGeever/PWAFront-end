
/* logout.js */

import { deleteCookie, getCookie } from '../js/core.js'

export async function setup() {
	navigator.geolocation.clearWatch(getCookie('geoID'))
	deleteCookie('authorization')
	deleteCookie('geoID')
	window.location.href = '/#login'
}
