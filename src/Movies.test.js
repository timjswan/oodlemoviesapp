/* React Testing using jest is only something I've recently looked at hence the bugs in the test. */

import React from "react";
import Movies from "./Movies";
import { shallow } from "enzyme";
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import testMovies from "./testmovies.json";

configure({ adapter: new Adapter() });

beforeAll(() => {
	global.fetch = jest.fn();
});

let container;

beforeEach(() => {
  container = shallow(<Movies />, { disableLifeCycleMethods: true });
});

afterEach(() => {
  container.unmount();
});

it("shows 5 movies after api call", (done) => {
	const spyMoviesCompDidMount = jest.spyOn(Movies.prototype, "componentDidMount");

	fetch.mockImplementation(() => {
		return Promise.resolve({
			status: 200,
			json: () => {
				return Promise.resolve({
					results: []
				});
			}
		});
	});

	const didMount = container.instance().componentDidMount();
	expect(spyMoviesCompDidMount).toHaveBeenCalled();

	didMount.then(() => {
		container.update();

		expect(container.find(".movie").length).toBe(5);

		spyMoviesCompDidMount.mockRestore();
		fetch.mockClear();
		done();
	});
});