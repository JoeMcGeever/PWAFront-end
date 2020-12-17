
/* home.js */

import { getCookie, showMessage, apiURL, getLocation, currentCoordinates} from '../js/core.js'


export async function setup(pageNumber) {
	if(getCookie('authorization')) {
		console.log('user is logged in')
        document.getElementById("loginOut").innerHTML  = "Logout" //change the nav to logout
	}
	try {
        
        //council can see issues sorted by how close they are
        
        
        if(getCookie('isCouncil')=='yes'){ 
            console.log("is a council member")
            console.log(currentCoordinates)
            if(currentCoordinates!=null){ //if the location is available
                document.getElementById("councilButton").style.display = 'block' //display the button
                document.getElementById("councilButton").addEventListener('click', async event => await toggleView())
            }
        } else {
            console.log("is not a council member")
            document.getElementById("councilButton").style.display = 'none'
        }
        
        
        
        window.onscroll = function(ev) { //hides the footer if close to the bottom (so everthing displays correctly)
    if ((window.innerHeight + window.pageYOffset) >= document.body.scrollHeight-75) {
         console.log("at bottom of page - hide the footer")
        document.getElementById('footer').style.display = 'none'
    } else {
        document.getElementById('footer').style.display = 'block'
    }
}
        
        
               
        
        
        document.getElementById('footer').style.display = 'block' //show footer again
		console.log('MAIN SCRIPT')
        let url
        let json
        let data
        if(document.getElementById("councilButton").textContent == 'View issues by recently added' && currentCoordinates[0]!=0){ //if on distance page
            //url = `${apiURL}/v1/issue/distance/${pageNumber}` //set url to be distance
            let url = `${apiURL}/v1/issue/distance/${pageNumber}/${currentCoordinates[0]}/${currentCoordinates[1]}`
            json = await fetch(url)
            data = await json.json()
            await setupIssues(data)
            
        } else{
            url = `${apiURL}/v1/issue/recent/${pageNumber}` //otherwise show recent
            json = await fetch(url)
            data = await json.json()
            await setupIssues(data)
        }
        
//         window.addEventListener("resize", () => {//if the screen size changes
//             console.log('screen size change')
//             await setupIssues(data) //setup the issues data again (so hidden elements stay hidden)
//         })

        
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




async function toggleView(){
    const currentButton = document.getElementById("councilButton")
    console.log(currentCoordinates)
    if(currentButton.textContent == 'View issues closest to you'){ //then need to call api to setup the view for seeing issues closest to you
        console.log("Now seeing closest to you")
        
        let url = `${apiURL}/v1/issue/distance/1/${currentCoordinates[0]}/${currentCoordinates[1]}`
		let json = await fetch(url)
		
        let data = await json.json()
        
        if(json.status == 404){
            showMessage('Unable to load resource')
        } else{
            
            
            console.log("Distance endpoint reached")
            console.log(data)
            
            await setupIssues(data)
        
            currentButton.textContent = 'View issues by recently added'
        }

    } else {
        console.log("Now seeing recently added")
        
        let url = `${apiURL}/v1/issue/recent/${1}`
		let json = await fetch(url)
		let data = await json.json()
        await setupIssues(data)
        
        currentButton.textContent = 'View issues closest to you'
    }
}




async function setupTopTen(topTen) {
    
  
     const orderedList = document.getElementById('topTenList')//gets the list element 
        
    
     for (let user = 0; user < topTen.length; user++) {
          var pageElement = document.createElement('p') //append li to the ol element
          pageElement.innerHTML = `${topTen[user].username} : ${topTen[user].score}`
          pageElement.class = 'topTenUser'
          pageElement.name = 'topTenUser'
          pageElement.style.display = "block"
          orderedList.appendChild(pageElement)
       }
}






async function setupIssues(data) { //sets up each of the issues 
    const issues = data.issues
    
    console.log(issues)
    
    
    for (const issue in issues) {
        console.log(`${issue}: ${issues[issue].issueID}`)
        
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
        else if (issues[issue].status == 'resolved' || issues[issue].status == 'Resolved by Council') issueBox.children[2].style.color = 'forestgreen'
        
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

