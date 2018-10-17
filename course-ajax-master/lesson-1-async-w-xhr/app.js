(function () {
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');
    let searchedForText;
    const responseContainer = document.querySelector('#response-container');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        responseContainer.innerHTML = '';
        searchedForText = searchField.value;

        const unsplashRequest = new XMLHttpRequest();

        unsplashRequest.open('GET', `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`);
        unsplashRequest.onload = addImage;
        unsplashRequest.setRequestHeader('Authorization', 'Client-ID 0ef0c655b7c75244ad4b6b51e753869f5e3f798a122c3228c7ecd78e52992b1e');
        unsplashRequest.send();

        const articleRequest = new XMLHttpRequest();
        articleRequest.onload = addArticles;
        articleRequest.open('GET', `http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=fc97a5f7684a423a83ccba3a524e05d5`);
        articleRequest.send();

        function addImage() {
            let htmlContent = '';
            const data = JSON.parse(this.responseText);

            if (data && data.results && data.results[0]) {
                const firstImage = data.results[0];
                htmlContent = `<figure>
                    <img src="${firstImage.urls.regular}" alt="${searchedForText}">
                    <figcaption>${searchedForText} by ${firstImage.user.name}</figcaption>
                  </figure>`
            }
            responseContainer.insertAdjacentHTML('afterbegin', htmlContent);
        }

        function addArticles () {
          let htmlContent = '';
          const data = JSON.parse(this.responseText);

          if (data && data.response.docs && data.response.docs[0]) {
              const firstArticle = data.response.docs[0];
              htmlContent = `<ul> ${data.response.docs.map(article => `<li class="article">
                             <h2><a href="${article.web_url}">${article.headline.main}</a></h2>
                             <p>${article.snippet}</p>
                             </li>`).join('')}</ul>`
          } else {
            htmlContent = `<div class="error-no-articles">No articles available</div>`
          }
          responseContainer.insertAdjacentHTML('beforeend', htmlContent);
        }
    });
})();










































// const searchedForText = 'hippos';


// function addArticles () {}
// const articleRequest = new XMLHttpRequest();
// articleRequest.onload = addArticles;
// articleRequest.open('GET', `http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=<your-API-key-goes-here>`);
// articleRequest.send();
