const express = require("express");
const app = express();
const { initializeDatabase } = require("./db/db.connect");
const Movie = require("./models/movie.models");
app.use(express.json());
initializeDatabase();



// 1 find a movie a perticular title
async function readMovieByTitle(movieTitle) {
  try {
    const movie = await Movie.findOne({ title: movieTitle });
    return movie;
  } catch (error) {
    throw error;
  }
}
// readMovieByTitle('Dilwale Dulhania Le Jayenge')

app.get("/movies/:title", async (req, res) => {
  try {
    const movie = await readMovieByTitle(req.params.title);
    if (movie) {
      res.json(movie);
    } else {
      res.status(404).json({ error: "Movie not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch movie." });
  }
});

// 3 find All movies
async function readAllMovies() {
  try {
    const allMovie = await Movie.find();
    return allMovie;
  } catch (error) {
    console.log(error);
  }
}
// readAllMovies();

app.get("/movies", async (req, res) => {
  try {
    const movies = await readAllMovies();
    if (movies.length != 0) {
      res.json(movies);
    } else {
      res.json(404).json({ error: "No movies found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch movies." });
  }
});

//  find movie by director
async function readMovieByDirector(directorName) {
  try {
    const moviedirectorName = await Movie.find({ director: directorName });
   return moviedirectorName;
  } catch (error) {
    throw error;
  }
}
// readMovieByDirector('Kabir Khan')
app.get("/movies/director/:directorName", async (req, res) => {
  try {
    const movies = await readMovieByDirector(req.params.directorName);
    if (movies.length != 0) {
      res.json(movies);
    } else {
      res.status(500).json({ error: "No movies found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch movies." });
  }
});

async function readMovieByGenre(genreName){
    try {
        const movieByGenre = await Movie.find({ genre: genreName})
        return movieByGenre
    } catch (error) {
       console.log(error) 
    }
}


app.get('/movies/genres/:genreName', async (req, res) => {
    try{
        const movies = await readMovieByGenre(req.params.genreName)
        if(movies.length != 0){
            res.json(movies)
        }else{
            res.status(404).json({error: 'Failed to fetch movies.'})
        }
    } catch (error) {
        res.status(500).json({error: 'Failed to fetch movies.'})
    }
})

// 1 add new movie object
async function createMovie(newMovie) {
  try {
    const movie = new Movie(newMovie);
    const saveMovie = await movie.save();
    console.log("New movie data", saveMovie);
  } catch (error) {
    throw error;
  }
}
app.post("/movies", async (req, res) => {
  try {
    const savedMovie = await createMovie(req.body);
    res
      .status(201)
      .json({ message: "Movie added successfully.", movie: savedMovie });
  } catch (error) {
    res.status(500).json({ error: "Failed to add movie." });
  }
});


async function updateMovie(movieId, dataToUpdate) {
  try {
    const updatedMovie = await Movie.findByIdAndUpdate(movieId, dataToUpdate, {
      new: true,
    });
    return updatedMovie;
  } catch (error) {
    console.log("Error in updateing Movie.", error);
  }
}

app.post("/movies/:movieId", async (req, res) => {
  try {
    const updatedMovie = await updateMovie(req.params.movieId, req.body);
    if (updatedMovie) {
      res
        .status(200)
        .json({
          message: "Movie updated successfully.",
          updateMovie: updatedMovie,
        });
    } else {
      res.status(404).json({ error: "Movie not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update movie." });
  }
});

async function deleteMovie(movieId) {
  try {
    const deletedMovie = await Movie.findByIdAndDelete(movieId);
    return deletedMovie;
  } catch (error) {
    console.log(error);
  }
}

app.delete("/movies/:movieId", async (req, res) => {
  try {
    const deletedMovie = await deleteMovie(req.params.movieId);
    if (deletedMovie) {
      res.status(200).json({ message: "Movie deleted successfully." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete movie." });
  }
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
