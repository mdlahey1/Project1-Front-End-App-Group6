var posterContainer = document.querySelector('#poster')
var requestUrl = 'https://api.themoviedb.org/3/search/movie?api_key=a6091da1f77938caf706363106cf0289&query=Jaws&include_image_language';

function getApi(url) {
    fetch(url)
    .then(response => response.json())
    .then(response => displayPoster(response.results[0].poster_path))
    
    .catch(err => console.error(err));
};

function displayPoster(imagePath) {

    var card = document.createElement('div');
    var imageUrl = `https://image.tmdb.org/t/p/original${imagePath}`;
    var posterIcon = document.createElement('img');

    card.append(posterIcon);

    card.setAttribute('class', 'col-12');
    posterIcon.setAttribute('src', imageUrl);

    posterContainer.append(card);
}

getApi(requestUrl)
