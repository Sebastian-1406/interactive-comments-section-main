import {data} from './data.js'
const contenedor = document.getElementById("contenedor")
let save = undefined
let click = [true, true]
let info = true

const listOfCurrentUser = () => {
    cargarPublicaciones(data.comments)
}
// <------
const cargarPublicaciones = (data) => {
    data.forEach(({user, content, createdAt, replies, score}) => {
        const {username, image} = user
        const {png} = image
        contenedor.innerHTML += `
            <section>

                ${Comments({png, username, content, score, createdAt})}    
                ${replies.length > 0 ? `<div class="caja__comentarios">${cargarComentarios({replies})}</div>` : ""}                                

            </section>
        `
    })
}
const cargarComentarios = ({replies}) => {
    return replies.map(({user, content, createdAt, score}) => {
        const {username, image} = user
        const {png} = image
        return Comments({png, username, content, score, createdAt}, "false")
    }).join("")
}
const Comments = ({png, username, content, score, createdAt}) => {

    return `<div class="publicacion">
        <div class="publicacion__user"> 
            <img src=${png} class="img-usuario"/> 
            <p class="usuario">${username}</p>
            <p>${createdAt}</p>
            ${username === "juliusomo" ? `<p class="you__publicacion">You</p>` : ""}
        </div>
        <p>${content}</p>
        <div class="publicacion__score">
            <img src="./images/icon-plus.svg" alt="icon-plus" class="like"/>
                <button>${score}</button>
            <img src="./images/icon-minus.svg" alt="icon-minus" class="desLike"/>
        </div>
        <div class="publicacion__reply">
            ${username === "juliusomo" ? `
            <button class="btn__delete">                        
                <svg width="12" height="14" xmlns="http://www.w3.org/2000/svg"><path d="M1.167 12.448c0 .854.7 1.552 1.555 1.552h6.222c.856 0 1.556-.698 1.556-1.552V3.5H1.167v8.948Zm10.5-11.281H8.75L7.773 0h-3.88l-.976 1.167H0v1.166h11.667V1.167Z" fill="#ED6368"/></svg>
                Delete
            </button>
            <button class="btn__edit">                            
                <svg width="14" height="14" xmlns="http://www.w3.org/2000/svg"><path d="M13.479 2.872 11.08.474a1.75 1.75 0 0 0-2.327-.06L.879 8.287a1.75 1.75 0 0 0-.5 1.06l-.375 3.648a.875.875 0 0 0 .875.954h.078l3.65-.333c.399-.04.773-.216 1.058-.499l7.875-7.875a1.68 1.68 0 0 0-.061-2.371Zm-2.975 2.923L8.159 3.449 9.865 1.7l2.389 2.39-1.75 1.706Z" fill="#5357B6"/></svg>
                Edit
            </button>` 
            :`<button class="btn__reply">
                <svg width="14" height="13" xmlns="http://www.w3.org/2000/svg"><path d="M.227 4.316 5.04.16a.657.657 0 0 1 1.085.497v2.189c4.392.05 7.875.93 7.875 5.093 0 1.68-1.082 3.344-2.279 4.214-.373.272-.905-.07-.767-.51 1.24-3.964-.588-5.017-4.829-5.078v2.404c0 .566-.664.86-1.085.496L.227 5.31a.657.657 0 0 1 0-.993Z" fill="#5357B6"/></svg>
                Reply
            </button>`}
        </div>
    </div>`
}
// ----->

contenedor.addEventListener("click", evt => {
    
    if(evt.target.parentElement.classList.contains("publicacion__reply") && !evt.target.parentElement.parentElement.parentElement.classList.contains("caja__comentarios") && evt.target.classList.contains("btn__reply")){
        // contenedor Publicacion 
        let nodo = evt.target.parentElement.parentNode
        
        let seccion = nodo.parentNode
        
        if(info){
            info = false
            seccion.innerHTML += formComments("send")
        }else {
            let formulario = document.querySelector(".form__comentario")
            if(formulario){
                formulario.outerHTML = " "
                info = true
            }else {
                seccion.innerHTML += formComments("send")
            }
            
        }
        
        

    }
    else if(evt.target.parentElement.parentElement.parentElement.classList.contains("caja__comentarios") && evt.target.parentElement.classList.contains("publicacion__reply") && evt.target.classList.contains("btn__reply")){
        let nodo = evt.target.parentElement.parentElement
        let nodoHTMl = evt.target.parentElement.parentElement.outerHTML
        save = nodoHTMl
        if(info === true){
            info = false
            nodo.outerHTML = `
            <section>
                ${save}
                ${formComments("Send")}
            </section>`
        }else {
            let formulario = document.querySelector(".form__comentario")
            formulario.outerHTML = ""
            info = true
        }
        

    }
    else if(evt.target.parentElement.classList.contains("publicacion__reply") && evt.target.classList.contains("btn__delete")){
        let publicacion = evt.target.parentElement
        console.log(publicacion);
        let body = document.querySelector("body")
        let seccion = document.createElement("section")
        body.classList.add("overflow")
        seccion.classList.add("alert")
        body.appendChild(seccion);
        let alerta = document.querySelector(".alert")
        let altura = window.innerHeight
        window.scrollTo(0, altura / 5)
        alerta.style.top = `${altura / 2}px`

        seccion.innerHTML = `
        <h2>Delete comment</h2>
        <p>Are you sure you want to delete this comment? This will remove the comment and can't be undone.</p>
        <div class="alert__confirmar">
            <button value="cancelar">No, Cancel</button>
            <button value="eliminar">Yes, Delete</button>
        </div>
        `
        alerta.addEventListener("click", (evt) => {
            if(evt.target.value === "cancelar"){
                evt.target.parentElement.parentElement.outerHTML = ""
                body.classList.remove("overflow")
            }
            else if(evt.target.value === "eliminar"){
                if(publicacion.parentElement.parentElement.children.length == 1){
                    publicacion.parentElement.parentElement.outerHTML = ""
                }
                publicacion.parentElement.outerHTML = ""
                evt.target.parentElement.parentElement.outerHTML = ""
                body.classList.remove("overflow")
            }
        })
    }
    else if((evt.target.parentElement.classList.contains("publicacion__reply") && evt.target.classList.contains("btn__edit"))){
        let content = evt.target.parentElement.parentElement.children[1]

        let nodo = evt.target.parentElement.parentElement
        save = nodo.outerHTML
        nodo.classList.remove("publicacion")
        nodo.classList.add("publicacion__edit")

        nodo.innerHTML = ""
        nodo.innerHTML += `${save}`

        if(info === true){
            info = false
            nodo.innerHTML += `
            <form class="form__edit">
                <textarea  placeholder="Add a comment">${content.textContent}</textarea>
                <img src="./images/avatars/image-juliusomo.png" alt="image/juliusomo" class="img-usuario"/> 
                <input type="submit" value="SEND" />
            </form>
        `  
        }else {
            let formulario = document.querySelector(".form__edit")
            formulario.outerHTML = ""
            info = true

        }
        
        save = parseInt(nodo.children[0].children[2].outerText)
    }
    

    if (evt.target.tagName == "IMG"){
        let likeValue = evt.target.parentElement.children[1]
        let likes = parseInt(likeValue.textContent)

        if(evt.target.classList.contains("like")){
            if(click[0]) {
                likeValue.innerHTML = `${likes + 1}`
                click[0] = false
                click[1] = true
            }
        }
        else if(evt.target.classList.contains("desLike")){
            if(click[1]){
                likeValue.innerHTML = `${likes - 1}`
                click[0] = true
                click[1] = false
            }
        }
    }
})

const comentar = (form ,nodo , comentario) => {
    const user = {
        png : "./images/avatars/image-juliusomo.png", 
        username : "juliusomo",
        content : comentario,
        score : save,
        createdAt : "recient"
    }

    form.outerHTML = ""
    
    let div = document.createElement("div")
    

    if(nodo.childNodes[3] === undefined && form.classList.contains("form__comentario")){
        div.classList.add("caja__comentarios")
        nodo.appendChild(div)
        user.score = 0
        div.innerHTML += Comments(user)

    }
    else if(form.classList.contains("form__edit")){
        nodo.classList.remove("publicacion__edit")
        user.score = save
        nodo.innerHTML = Comments(user)
    }
    else {
        user.score = 0
        nodo.childNodes[3].innerHTML += Comments(user)
    }

    
}
const formComments = (button) => {
    return (
        `<form class="form__comentario">
            <textarea  placeholder="Add a comment"></textarea>
            <img src="./images/avatars/image-juliusomo.png" alt="image/juliusomo" class="img-usuario"/> 
            <input type="submit" value=${button} />
        </form>`
    )
}
contenedor.addEventListener("submit", evt => {
    evt.preventDefault()
    if(evt.target.tagName === "FORM" && evt.target.classList.contains("form__comentario")){
        let form = evt.target
        let input  = evt.target.children[0].value
        comentar(form ,evt.target.parentElement, input)
    }
    else if(evt.target.classList.contains("form__edit")){
        let form = evt.target
        let input  = evt.target.children[0].value
        comentar(form ,evt.target.parentElement, input)
        
    }
})

listOfCurrentUser()