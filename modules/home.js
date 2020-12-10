
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
		let url = `${apiURL}/v1/issue/recent/1`
		const json = await fetch(url)
		const data = await json.json()
		console.log(data)
        await setupIssues(data)
        
        url = `${apiURL}/v1/issue/all/total`
        const json2= await fetch(url)
		const numberOfIssues = await json2.json()
        console.log(numberOfIssues)
        
        await setupFooter(numberOfIssues.numberOfIssues)
// 		document.querySelector('main p').innerText = data.msg
	} catch(err) {
		console.log(err)
	}
}

async function setupIssues(data) { //sets up each of the issues 
    console.log(data.issues)
    const issues = data.issues
    
    
    
    for (const issue in issues) {
        //console.log(`${issue}: ${issues[issue].issueID}`)
        
        const issueBox = document.getElementById(`issue${issue}`)
        

        issueBox.addEventListener("click", function() {
            console.log(issues[issue].issueID) //re-route to individual issue here
            window.location.href = `/#issue?Issue=${issues[issue].issueID}`
        })
        

        
        issueBox.hidden = false

       
        
        const title = issueBox.children[0]
        const description = issueBox.children[1]
        const status = issueBox.children[2]
        
        issueBox.children[0].textContent  = issues[issue].title
        issueBox.children[1].textContent  = issues[issue].description
        issueBox.children[2].textContent  = issues[issue].status

        //set status colours
        if(issues[issue].status == 'new') issueBox.children[2].style.color = 'red'
        else if (issues[issue].status == 'verified') issueBox.children[2].style.color = 'Coral'
        else if (issues[issue].status == 'assigned') issueBox.children[2].style.color = 'DarkOrange'
        else if (issues[issue].status == 'resolved') issueBox.children[2].style.color = 'forestgreen'
        
    }
}


async function setupFooter(numberOfIssues) {
    numberOfIssues = 38
    console.log(`total issue number = ${numberOfIssues}`)
    const elementsPerPage = 6 //change depending on screen size
    let numberOfPages = numberOfIssues/elementsPerPage
    
    if(numberOfIssues%elementsPerPage != 0){
        numberOfPages = parseInt(numberOfPages) + 1 //truncate after decimal and add 
    }
    if(numberOfPages == 0){
        numberOfPages += 1
    }
    
    console.log(`total page number = ${numberOfPages}`)
}

