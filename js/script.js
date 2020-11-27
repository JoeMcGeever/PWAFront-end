
/* script.js */

/**
 * ROUTER
 * This module needs to be imported into your top-level html file.
 * It checks the URL fragment/hash and dynamically loads the correct view
 * and module.
 * There needs to be an html view file and a module file for each fragment.
 */

import { getCookie, getLocation, onlineStatus } from './core.js'

let geoID

// event triggered when the page first loads, triggers the 'hashchange' event
window.addEventListener('DOMContentLoaded', async event => {
// 	geoID = await navigator.geolocation.watchPosition(getLocation)
	loadPage()
})

// event gets triggered every time the URL fragment (hash) changes in the address bar
window.addEventListener('hashchange', async event => await loadPage())

async function loadPage() {
	try {
		// the 'name' of the page is the name in the fragment without the # character
		// if there is no fragment/hash, assume we want to load the home page (ternary operator)
		console.log(typeof location.hash)
		const pageName = location.hash ? location.hash.replace('#', '') : 'home'
		console.log('location updated')
		// load the html page that matches the fragment and inject into the page DOM
		document.querySelector('main').innerHTML = await (await fetch(`./views/${pageName}.html`)).text()
		document.querySelector('h1').innerText = pageName
		console.log('---------------------------------------------------------------')
		console.log(`${pageName.toUpperCase()}: ${window.location.protocol}//${window.location.host}/${window.location.hash}`)
		if(getCookie('authorization')) console.log(`Authorization: "${getCookie('authorization')}"`)
		// dynamically importing the code module who's name matches the page name
		try {
			// run the setup function in whatever module has been loaded if module exists
			const module = await import(`../modules/${pageName}.js`)
			module.setup()
		} catch(err) {
			console.warn('no page module')
		}
	} catch(err) {
		// errors are triggered if script can't find matching html fragment or script
		console.log(err)
		console.log(`error: ${err.message}, redirecting to 404 page`)
		console.log(err)
	}
}
