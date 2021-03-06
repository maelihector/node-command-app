require('dotenv').config();
const request = require('request-promise');
const fs = require('fs-extra');


// Append output to log.txt
function append(output) {
  fs.appendFile("log.txt", `${output}
`, (error) => {
    /*console.log(error);*/
  });
}

// Fetch OMDB api key
const omdbApiKey = process.env.OMDB_API_KEY;

// Function for getting movie from IMDB
let getMovie = function (movie) {

  // If user did not enter movie after choosing 'get-movie', default to Mr. Nobody
  if (!movie) {
    movie = "Mr+Nobody";
  }
  // Run the call/request to the OMDB API with movie parameter
  request("http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=" + omdbApiKey)
    .then(data => {
      // Parse return data
      let movie = JSON.parse(data);

      // Grab Rotten Tomatoes Rating
      let tomatoesRating = movie.Ratings[1].Value;
      // Grab output and store in log
      let log = `
      ${movie.Title} was released in ${movie.Year}, was produced in ${movie.Country}, and was made in the ${movie.Language} language(s).
      Its IMDB rating is ${movie.imdbRating}/10, while its Rotten Tomatoes rating is ${tomatoesRating}.
      The main actors in ${movie.Title} are: ${movie.Actors}.
      The plot of ${movie.Title} is: ${movie.Plot}
      `;
      // Console log and call append() 
      console.log(log);
      append(log);
    }).catch(err => {
      if (err) {
        // If movie is not found, use default to Mr. Nobody
        console.log(`
        Oops, something went wrong, here's the movie Mr. Nobody instead!
        `);
        getMovie();
      }
    });
};

module.exports = getMovie;