export default class StatusElement {
	createMessage({ imgSrc, title, description, className }) {
		const message = document.createElement('div');

		message.classList.add('message', className ? className : null);

		message.innerHTML = `
      <img class="message__img" src="${imgSrc}"/>
      <div class="message__info">
        <h3 class="message__title">${title}</h3>
        <p class="message__description">${description}</p>
      </div>
    `;

		return message;
	}

	createLoading() {
		const loader = document.createElement('div');
		const spinner = document.createElement('img');
		spinner.src = '../../assets/loader.gif';
		loader.classList.add('loader');

		loader.append(spinner);

		return loader;
	}
}
