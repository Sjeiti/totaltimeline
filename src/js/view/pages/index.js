import Signal from 'signals'

/**
 * todo: document
 * @namespace totaltimeline.pages
 */

const sgPagesLoaded = new Signal()
  ,pages = {
    getData: getData
    ,length: 0
    ,loaded: sgPagesLoaded
    ,getEntryBySlug: getEntryBySlug
  }
;

// todo: document
function getData(model){
  totaltimeline.spreadsheetproxy.getData(model.spreadsheetKey,3,handleGetData);
}

// todo: document
function handleGetData(pages){
  pages.forEach(function(page,i){
    page.slug = totaltimeline.util.slug(page.name);
    //
    //
    /*global markdown*/
    page.explanation = markdown.toHTML(page.copy);
    //
    //
    pages[i] = page;
    pages.length++;
  });
  sgPagesLoaded.dispatch(pages);
}

// todo: document
function getEntryBySlug(slug){
  for (var i=0,l=pages.length;i<l;i++) {
    var oPage = pages[i]
      ,sSlug = oPage.slug;
    if (slug===sSlug) return oPage;
  }
}

export default pages