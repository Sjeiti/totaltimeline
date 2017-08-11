import {create} from './component'

create(
  'data-header'
  ,{
    init(){
      const nav = this.element.querySelector('nav')
        ,ul = nav.querySelector('ul')
		  // pages.loaded.add(handlePagesLoaded);
      // todo: document
      /*function handlePagesLoaded() {
        emptyElement(ul);
        const fragment = document.createDocumentFragment();
        for (let i=1,l=pages.length;i<l;i++) { // first page not in menu
          const oPage = pages[i];
          fragment.appendChild(zen('li>a[href=#'+oPage.slug+']{'+oPage.name+'}').pop());
        }
        ul.appendChild(fragment);
      }*/
    }
  }
)
