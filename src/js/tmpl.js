/**
 * Simple JavaScript Templating
 * John Resig - http://ejohn.org/blog/javascript-micro-templating/ - MIT Licensed
 * @name iddqd.utils.tmpl
 * @method
 * @param {String} str ID of the template script element
 * @param {Object} [data] A callback function for when the file is loaded.
 * @example
 *<script type="text/html" id="user_tmpl">
 *	<% for ( var i = 0; i < users.length; i++ ) { %>
 *		<li><a href="<%=users[i].url%>"><%=users[i].name%></a></li>
 *	<% } %>
 *</script>
 *<script type="text/html" id="item_tmpl">
 *  <div id="<%=id%>" class="<%=(i % 2 == 1 ? " even" : "")%>">
 *    <div class="grid_1 alpha right">
 *      <img class="righted" src="<%=profile_image_url%>"/>
 *    </div>
 *    <div class="grid_6 omega contents">
 *      <p><b><a href="/<%=from_user%>"><%=from_user%></a>:</b> <%=text%></p>
 *    </div>
 *  </div>
 *</script>
 */
var oTmplCache = {};
export default function tmpl(str, data){
  /* jshint -W054 */
  // Figure out if we're getting a template, or if we need to
  // load the template - and be sure to cache the result.
  var fn = !/\W/.test(str) ?
    oTmplCache[str] = oTmplCache[str] ||
    tmpl(document.getElementById(str).innerHTML) :
    // Generate a reusable function that will serve as a template
    // generator (and which will be cached).
    new Function("obj",
    "var p=[],print=function(){p.push.apply(p,arguments);};" +
    // Introduce the data as local variables using with(){}
    "with(obj){p.push('" +
    // Convert the template into pure JavaScript
    str
      .replace(/[\r\t\n]/g, " ")
      .split("<%").join("\t")
      .replace(/((^|%>)[^\t]*)'/g, "$1\r")
      .replace(/\t=(.*?)%>/g, "',$1,'")
      .split("\t").join("');")
      .split("%>").join("p.push('")
      .split("\r").join("\\'")
    + "');}return p.join('');");
  // Provide some basic currying to the user
  return data ? fn( data ) : fn;
};