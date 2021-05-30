//ISSUE with displayed number of likes on created Quote, not sure how to display without re-rendering?

const quoteList = document.querySelector('#quote-list')
const submitForm = document.querySelector('#new-quote-form')

function getQuotes() {
    fetch('http://localhost:3000/quotes?_embed=likes')
    .then(resp => resp.json())
    .then(popQuoteList)
}

function popQuoteList(quoteArray) {
    quoteArray.forEach(renderQuote)
}

function renderQuote(quoteObj) {
    let li = document.createElement('blockquote')
    let h3 = document.createElement('h3')
    let pAuth = document.createElement('p')
    let likeButt = document.createElement('button')
    let pLikes = document.createElement('p')
    let delButt = document.createElement('button')

    li.id = quoteObj.id
    h3.textContent = quoteObj.quote
    pAuth.textContent = quoteObj.author
    likeButt.textContent = 'Like'
    likeButt.setAttribute('data', quoteObj.likes.length)
    //console.log(likeButt.getAttribute('data'))
    likeButt.addEventListener('click', function (event) { likeAction(event, quoteObj.id)})
    
    getLikes(quoteObj.id, pLikes)

    //pLikes.textContent = `Likes: ${quoteObj.likes.length}`
    delButt.textContent = 'Delete'
    delButt.addEventListener('click', function (event) { deleteAction(event, quoteObj.id)})

    li.append(h3, pAuth, likeButt, pLikes, delButt)

    quoteList.append(li)
}

function getLikes(id, pLikes) {
    fetch(`http://localhost:3000/likes?quoteId=${id}`)
    .then(resp => resp.json())
    .then(array => pLikes.textContent = `Likes: ${array.length}`)
}

function likeAction(event, id) {
    let newLike = {}

    newLike.quoteId = id
    newLike.createdAt = Date.now()

    fetch('http://localhost:3000/likes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newLike)
    })
    .then(resp => resp.json())
    .then(() => getLikes(id, event.target.nextSibling))
    //event.target.nextSibling.textContent =
}

function deleteAction(event, id) {
    fetch(`http://localhost:3000/quotes/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(resp => resp.json)
    .then(event.target.parentNode.remove())
}

function submitQuoteEvent() {
    submitForm.addEventListener('submit', submitQuote)
}

function submitQuote(event) {
    event.preventDefault()

    let newQuote = {}

    newQuote.author = event.target.author.value
    newQuote.quote = event.target.quote.value
    newQuote.likes = 0
    
    fetch('http://localhost:3000/quotes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newQuote)
    })
    .then(resp => resp.json())
    .then(renderQuote)
}


function init() {
    getQuotes()
    submitQuoteEvent()
}

document.addEventListener('DOMContentLoaded', init())