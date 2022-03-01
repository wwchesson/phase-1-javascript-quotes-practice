document.addEventListener("DOMContentLoaded", () => {
  let quotes = [];
  const quoteList = document.querySelector("#quote-list");
  const newQuoteForm = document.querySelector("#new-quote-form");
  const deleteButton = document.getElementsByClassName("btn-danger");

  function fetchQuotes() {
    fetch("http://localhost:3000/quotes?_embed=likes")
      .then((response) => response.json())
      .then((data) => {
        quotes = data;
        renderQuotes(quotes);
      });
  } //GET request ends

  function renderQuotes(quotes) {
    quoteList.innerHTML = quotes.map(renderQuote).join("");
  }

  function renderQuote(quote) {
    return `
        <li id='${quote.id}' class='quote-card' >
      <blockquote class="blockquote">
        <p class="mb-0">${quote.quote}</p>
        <footer class="blockquote-footer">${quote.author}</footer>
        <br>
        <button class='btn-success'>Likes: <span>${quote.likes.length}</span></button>
        <button class='btn-danger' name='delete-btn'>Delete</button>
      </blockquote>
    </li>
        `;
  }

  newQuoteForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let newQuote = e.target[0].value;
    let newAuthor = e.target[1].value;
    newQuoteForm.reset(); //Mykola

    fetch("http://localhost:3000/quotes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        quote: newQuote,
        author: newAuthor,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        fetchQuotes();
      });
  }); //eventListener ends

  document.addEventListener("click", (e) => {
    let neededId = e.path[2].id;
    if (e.target.name === "delete-btn") {
      e.path[2].remove();
      deleteQuote(neededId);
    } else if (e.target.className === "btn-success") {
      let likesNumber = e.path[2].querySelector("span");
      likesNumber.innerHTML = parseInt(likesNumber.innerHTML) + 1;
      fetchPost(neededId);
    }
  });

  function deleteQuote(neededId) {
    fetch(`http://localhost:3000/quotes/${neededId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => response.json());
  }

  function fetchPost(neededId) {
    fetch("http://localhost:3000/likes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        quoteId: neededId,
      }),
    })
      .then((response) => response.json())
      .then((data) => console.log(data));
  }

  fetchQuotes();
}); //code ends
