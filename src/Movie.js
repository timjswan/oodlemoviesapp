import React, { Component } from 'react';

class Movie extends Component {
	constructor(props){
		super(props);		

		this.state = {
			movie: []
		}
	}

	render(){
		const { movie } = this.props.movieData,
				imgSrc = "https://image.tmdb.org/t/p/w500/" + movie.poster_path;

		/* Build all the movie data into the HTML we want */
		return(
			<div className="movie" data-testid="movie" style={{ animation: "fadeIn 1s" }}>
				{movie == null ? (
					<p>Movie doesn't exist</p>
				) : (
					<React.Fragment>
						<img className="poster" src={imgSrc} alt={movie.title} />
						<div className="movie-info">
							<h4>{movie.title}</h4>
							<p>{movie.overview}</p>
						</div>
					</React.Fragment>
				)}
			</div>
		);
	}
}

export default Movie;