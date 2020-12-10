
/* home.js */

import { getCookie, showMessage, apiURL} from '../js/core.js'


export async function setup(pageNumber) {
	if(getCookie('authorization')) {
		console.log('user is logged in')
        document.getElementById("loginOut").innerHTML  = "Logout" //change the nav to logout
	}
	try {
        document.getElementById("footer").hidden = false //show footer again
		console.log('MAIN SCRIPT')
		let url = `${apiURL}/v1/issue/recent/${pageNumber}`
		let json = await fetch(url)
		let data = await json.json()
        await setupIssues(data)
        
        url = `${apiURL}/v1/issue/all/total` //get total number of issues
        json= await fetch(url)
		const numberOfIssues = await json.json()
        
        url = `${apiURL}/v1/accounts/top10` //get top 10 users
        json = await fetch(url)
		const topTen = await json.json()
        
        
        await setupFooter(numberOfIssues.numberOfIssues)
        await setupTopTen(topTen.top10)
// 		document.querySelector('main p').innerText = data.msg
	} catch(err) {
		console.log(err)
	}
}

async function setupTopTen(topTen) {
    
  
     const orderedList = document.getElementsByTagName('ol')[0] //gets the pagination class from index.html
        
    
    console.log("havent loaded before")
    
     for (let user = 0; user < topTen.length; user++) {
          var pageElement = document.createElement('p') //append li to the ol element
          pageElement.innerHTML = `${topTen[user].username} : ${topTen[user].score}`
          pageElement.class = 'topTenUser'
          pageElement.style.display = "block"
          orderedList.appendChild(pageElement)
       }
}

async function setupIssues(data) { //sets up each of the issues 
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
    
    //need to check if footer is already setup:
    const paginationView = document.getElementsByClassName('pagination')[0] //gets the pagination class from index.html
    
    if(paginationView.childElementCount!=0){ //if there are elements present already
        return //then return - footer is already setup
    }
    
    
    
    
    
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
    
    //set up the pagination footer
    
    
                
    for (var pageNumber = 0; pageNumber < numberOfPages; pageNumber++) {
        var pageElement = document.createElement('a')
            
        var link = document.createTextNode(pageNumber + 1) //create the text node
                  
        // Append the text node to anchor element. 
        pageElement.appendChild(link)
            
        pageElement.href = `#home?page=${pageNumber + 1}` //set the href
        paginationView.appendChild(pageElement)
    }
        
   
    
   
}

