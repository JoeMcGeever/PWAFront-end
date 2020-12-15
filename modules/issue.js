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
        document.getElementById("footer").hidden = true //hide footer
		console.log('MAIN SCRIPT')
		const url = `${apiURL}/v1/issue/${issueID}`
		const json = await fetch(url)
		const data = await json.json()
		console.log(data.issue)
        await setupIssue(data.issue)
// 		document.querySelector('main p').innerText = data.msg
	} catch(err) {
		console.log(err)
	}
}


async function setupIssue(data){
    console.log("Called setup issue")
    
    document.getElementById('title').textContent = data.title
    
    document.getElementById('description').textContent = data.description
    
    document.getElementById('status').textContent = data.status
    
    if(data.image!=null){
        document.getElementById('image').src = data.image
    }
    
    //set status colours
        if(data.status == 'new') {
            document.getElementById('status').style.color = 'red'
            setupButton(['new', data.userID, data.workedOnBy, data.issueID]) //set up the button (which is depenant on the current status)
        }
        else if (data.status == 'verified'){
            document.getElementById('status').style.color = 'Coral'
            setupButton(['verified', data.userID, data.workedOnBy, data.issueID])
        } 
        else if (data.status == 'assigned'){
            document.getElementById('status').style.color = 'DarkOrange'
            setupButton(['assigned', data.userID, data.workedOnBy, data.issueID])
        }
        else if (data.status == 'resolved' || data.status == 'Resolved by Council'){
            document.getElementById('status').style.color = 'forestgreen'
            setupButton(['resolved', data.userID, data.workedOnBy, data.issueID])
        }
        
        
    
}

async function setupButton(data){
    console.log(`status is ${data[0]}`)
    console.log(`user who made issue is ${data[1]}`)
    console.log(`Currently being worked on by ${data[2]}`)
    console.log(`Issue ID is: ${data[3]}`)
    const loggedInUserId = getCookie('userID') 
    console.log(`logged in user is ${loggedInUserId}`)
    
    var buttonArea = document.getElementById('buttonArea')
    var button = document.createElement("BUTTON")
    var label = document.createElement("LABEL")
    
       
    if(loggedInUserId == data[1]){ //if the user is viewing his own issue
        console.log('The user is the one who created this issue')
        if(data[0] == 'assigned'){ //if the data is assigned, then the user should be able to resolve it
            button.textContent = 'Resolve'

            button.addEventListener('click', async event => await patchRequest(loggedInUserId, 'resolved', data[3]))
                        
            buttonArea.appendChild(button)
            
        }
        
        label.textContent = "This issue is an issue you have made" //alert the user they created this issue
        buttonArea.appendChild(document.createElement("br"))
        buttonArea.appendChild(label)

    } else{ //if the user is viewing another users issue
        console.log('The user did not create this issue')
        if(data[0] == 'new'){ //if the data is new, then the user should be able to verify it
            button.textContent = 'Verify this issue'

            button.addEventListener('click', async event => await patchRequest(loggedInUserId, 'verified', data[3]))
             
            buttonArea.appendChild(button)
            
            
        }
        
        if(data[0] == 'verified'){ //if the data is verified, then the user should be able to resolve it (this assigns it to them)
            button.textContent = 'Resolve this issue'

            button.addEventListener('click', async event => await patchRequest(loggedInUserId, 'assigned', data[3]))
 
            buttonArea.appendChild(button)
            
        }
        
        
    }
    
  
    
    
}




async function patchRequest(userID, status, issueID) {
    let url = `${apiURL}/v1/issue/patch`
    console.log('all the data needed:')
    console.log(userID)
    console.log(status)
    console.log(issueID)
    console.log(url)
                
    const dataToBeSent = {
          "issueID" : issueID,
          "status" : status,
          "userID" : userID
    }
    const token = getCookie('authorization')
    console.log(token)
    const options = { headers: { authorization: token}, method: 'PATCH', body: JSON.stringify(dataToBeSent) }

    const response = await fetch(url, options)
    try{
        const json = await response.json()
        
        console.log(typeof(json))
        console.log(json)
        console.log(json.status)

        if(response.status === 201) {
            showMessage("Success! Issue status has been updated")
            window.location.href = '/#home'
         } else {
             throw new Error(`${response.status}: ${json.err}`)
         }
        
    } catch(err) {
        console.log(err)
    }
    
    
}


