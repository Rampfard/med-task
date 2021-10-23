export const showFullImg = (imgId, fullImageSrc) => {
	const container = document.querySelector('.main');
	const elDetail = document.getElementById('detail');

	const image = document.querySelector(`[data-id="${imgId}"] img`);

	function flipImages(firstEl, lastEl, change) {
		const firstRect = firstEl.getBoundingClientRect();
		const lastRect = lastEl.getBoundingClientRect();

		const deltaX = firstRect.left - lastRect.left;
		const deltaY = firstRect.top - lastRect.top;
		const deltaW = firstRect.width / (lastRect.width || 600);
		const deltaH = firstRect.height / (lastRect.height || 600);

		change();

		lastEl.animate(
			[
				{
					transform: `translateX(${deltaX}px) translateY(${deltaY}px) scaleX(${deltaW}) scaleY(${deltaH})`,
				},
				{
					transform: 'none',
				},
			],
			{
				duration: 500,
				easing: 'cubic-bezier(.2, 0, .3, 1)',
			}
		);
	}

	elDetail.innerHTML = '';

	const fullImage = document.createElement('img');
	fullImage.src = fullImageSrc;
	elDetail.appendChild(fullImage);
	image.style.opacity = 0;

	flipImages(image, fullImage, () => {
		container.dataset.state = 'detail';
	});

	function revert() {
		flipImages(fullImage, image, () => {
			container.dataset.state = 'default';
			image.style.opacity = 1;
			elDetail.removeEventListener('click', revert);
		});
	}

	elDetail.addEventListener('click', revert);
};
