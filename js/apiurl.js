/* apiurl.js */

//export const apiURL = 'https://short-panda-8080.codio-box.uk'
export const apiURL = 'https://calm-castle-89033.herokuapp.com'


export function getApiURL(){
    if( process.env.PORT){
        return 'https://calm-castle-89033.herokuapp.com'
    } else {
        return'https://short-panda-8080.codio-box.uk'
    }
}