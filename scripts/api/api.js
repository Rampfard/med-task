const BASE_URL = 'https://json.medrating.org';

export const fetchData = async (url) => {
	const response = await fetch(`${BASE_URL}/${url ? url : ''}`);

	return await response.json();
};

export const fetchUsers = async () => {
	return await fetchData('users');
};

export class Request {
	static BASE_URL = 'https://json.medrating.org';
	static state = {
		data: [],
		requestStatus: {
			loading: false,
			error: null,
			completed: false,
		},
	};

	static async fetchData(url) {
		this.state = {
			...this.state,
			requestStatus: {
				...this.state.requestStatus,
				loading: true,
			},
		};

		try {
			const response = await fetch(`${BASE_URL}/${url ? url : ''}`);

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.message || 'Could not fetch data.');
			}

			this.state = {
				...this.state,
				data,
				requestStatus: {
					...this.state.requestStatus,
					loading: false,
					completed: true,
				},
			};
		} catch (e) {
			this.state = {
				...this.state,
				requestStatus: {
					...this.state.requestStatus,
					completed: true,
					loading: false,
					error: e.message || "couldn't fetch data",
				},
			};
		}

		return this.state;
	}

	static async fetchUsers() {
		return await this.fetchData('users');
	}

	static async fetchAlbums(userId = 0) {
		return await this.fetchData(`albums?userId=${userId}`);
	}

	static async fetchPhotos(albumId = 0) {
		return await this.fetchData(`photos?albumId=${albumId}`);
	}
}
