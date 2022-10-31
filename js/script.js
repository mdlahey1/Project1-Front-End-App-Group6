var posterContainer = document.querySelector('#poster')
var requestUrl = 'https://api.themoviedb.org/3/search/movie?api_key=a6091da1f77938caf706363106cf0289&query=Jaws&include_image_language';
var ottKey = '62e4d11a06msh5de2a416a1456c1p1475fajsn6107c95aedbc';

// var fetchProv = "https://api.themoviedb.org/3/movie/578/watch/providers?api_key=a6091da1f77938caf706363106cf0289"


function getApi(url) {
    fetch(url)
    .then(response => response.json())
    .then(response => displayPoster(response.results))
    .catch(err => console.error(err));
};

function displayPoster(theseResults) {

    for (let i = 0; i < theseResults.length; i++){

        var imagePath = theseResults[i].poster_path

        var card = document.createElement('div');
        var imageUrl = `https://image.tmdb.org/t/p/original${imagePath}`;
        var posterIcon = document.createElement('img');

        card.append(posterIcon);

        card.setAttribute('class', 'col-12');
        posterIcon.setAttribute('src', imageUrl);

        posterContainer.append(card);
    }

    
}

getApi(requestUrl)
