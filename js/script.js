
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
		let pageName = location.hash ? location.hash.replace('#', '') : 'home?page=1'
        
        
        if(pageName == 'home'){ //if just loading onto the page, set page to be 1
           pageName = 'home?page=1'
        }
       
        
        //if page name has the issueID in it, extract and send to the setup file in issue.js
        let issueID = null
        try{ // extract the issueID if viewing an individual issue 
            issueID = pageName.split('?Issue=')[1] // issueID is everything after the ?Issue=
            pageName = pageName.split('?Issue=')[0] // the page name is everything before ?Issue=
            console.log(`${issueID} is the ID, and the page name is ${pageName}`)
        } catch {
            console.log("Not going to the issue page")
        }
        
        
        //get page number for issue page and call the correct elements from the server
        let pageNumber = null
        try{ // extract the pageNumber if viewing an individual issue
            console.log(pageName)
            console.log(pageName.split('?page='))
            pageNumber = pageName.split('?page=')[1] // issueID is everything after the ?Issue=
            pageName = pageName.split('?page=')[0] // the page name is everything before ?Issue=
            console.log(`${pageNumber} is the number, and the page name is ${pageName}`)
        } catch {
            console.log("First time at the page (so setup needs to setup footer)") //not specified a page, so if routing to the home page, use pageNumber = 1 instead
        }
        
        
		console.log('location updated')
		// load the html page that matches the fragment and inject into the page DOM
		document.querySelector('main').innerHTML = await (await fetch(`./views/${pageName}.html`)).text()
		//document.querySelector('h1').innerText = pageName
		console.log('---------------------------------------------------------------')
		console.log(`${pageName.toUpperCase()}: ${window.location.protocol}//${window.location.host}/${window.location.hash}`)
		if(getCookie('authorization')) console.log(`Authorization: "${getCookie('authorization')}"`)
		// dynamically importing the code module who's name matches the page name
		try {
			// run the setup function in whatever module has been loaded if module exists
            console.log(`trying to import:   ../modules/${pageName}.js`)
			const module = await import(`../modules/${pageName}.js`)
            if(pageName == 'issue'){
                module.setup(issueID)
            } else if(pageName == 'home'){
                module.setup(pageNumber)
            } else {
                module.setup()
            }
		} catch(err) {
			console.warn('no page module')
            console.log(err)
		}
	} catch(err) {
		// errors are triggered if script can't find matching html fragment or script
		console.log(err)
		console.log(`error: ${err.message}, redirecting to 404 page`)
		console.log(err)
	}
}
