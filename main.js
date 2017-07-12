class Viewer {
  constructor() {
    this.container = document.getElementById("container");
    this.gallery = document.getElementById("gallery");
    this.article = document.getElementById("article");
    this.button = document.getElementById("home-button");
    this.articles = [];
  }
  init() {
    this._handleEvents();
    this._fetchData();
  }
  _fetchData() {
    fetch("article.json")
      .then(response => {
        return response.json();
      })
      .then(data => {
        this.articles = data;
        this._renderArticles();
      })
      .catch(function(err) {
        console.log(err);
      });
  }
  _renderArticles() {
    let html = "";
    this.articles.forEach(element => {
      html += `
        <div class="col-xs-6">
          <div class="thumbnail">
            <img src="${element.cover}" alt="article${element.id}" />
            <div class="caption">
              <h2>${element.title}</h2>
              <a href="/article/${element.id}" data-id="${element.id}" class="btn btn-primary">View Article</a>
            </div>
          </div>
        </div>
      `;
    });
    this.gallery.innerHTML = html;
  }
  _renderArticle(element) {
    let content = "";
    element.body.forEach(item => {
      switch (item.type) {
        case "plaintext":
          content += `<p>${item.body}</p>`;
          break;
        case "h2":
          content += `<h2>${item.body}</h2>`;
          break;
        case "pull_quote":
          content += `<blockquote><p>${item.body}</p></blockquote>`;
          break;
        default:
          content += `<div>${item.body}</div>`;
      }
    });
    const articleHtml = `
  <div>
    <h1>${element.title}</h1>
    ${content}
    <div class="thumbnail"><img src="${element.cover}" alt="article${element.id}" /></div>
  </div>
  `;
    this.article.innerHTML = articleHtml;
  }
  _handleEvents() {
    this.gallery.onclick = e => {
      if (e.target.getAttribute("data-id")) {
        e.preventDefault();
        const id = e.target.getAttribute("data-id");
        const url = e.target.getAttribute("href");
        const element = this.articles[id];
        history.pushState({ element: element }, null, url);
        this.container.classList.toggle("single");
        this._renderArticle(element);
        window.scrollTo(0, 0);
      }
      e.stopPropagation();
    };
    this.button.onclick = e => {
      e.stopPropagation();
      window.history.back();
      this.container.classList.toggle("single");
    };
    window.onpopstate = e => {
      if (e.state && e.state.element) {
        this.container.classList.add("single");
        this._renderArticle(e.state.element);
      } else {
        this.container.classList.remove("single");
      }
    };
  }
}
const app = new Viewer();
app.init();
