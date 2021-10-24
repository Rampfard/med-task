import Component from './component.js';

export default class Header extends Component {
  constructor(headerSelector, changeUrlHandler) {
    super();
    this.header = document.querySelector(headerSelector);
    this.navList = this.header.querySelector('.nav-list');
    this.links = this.navList.querySelectorAll('.nav-link');

    this.activeRoute = window.location.hash;

    this.changeUrlHandler = changeUrlHandler;

    this.connectNavClickHandler();
    this.updateView();
  }

  removeActiveClasses(nodeList, activeClass) {
    nodeList.forEach((node) => node.classList.remove(activeClass));
  }

  changeActiveTab() {
    this.links.forEach((link) => {
      const parent = link.parentNode;
      parent.classList.remove('active');

      if (link.hash === window.location.hash) {
        parent.classList.add('active');
      }
    });
  }

  connectNavClickHandler() {
    this.links.forEach((link) =>
      link.addEventListener('click', (e) => {
        e.preventDefault();

        this.changeUrlHandler(e);
        this.changeActiveTab(e);
      })
    );
  }

  updateView() {
    this.links.forEach((link) => {
      if (link.hash === this.activeRoute) {
        link.parentNode.classList.add('active');
      } else {
        link.parentNode.classList.remove('active');
      }
    });
  }
}
