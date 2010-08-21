var ct = null;		//Current active tab
var c1, c2, c3;		//The three main containers
var helper;			//Extra helper atop main containers

// Self-remove
jQuery.fn.rm = function() {
	return this.each(function() {
		this.parentNode.removeChild(this);
	});
};

// For DIV.module to load content
jQuery.fn.loadContent = function(url) {
	return this.each(function() {
		u = (url || this.url);
		if (u == '') return;
		x = $(".moduleContent", this);
		x.load(u, function(){
			widgetize.apply(this);
			//Further processing can be applied here
		});
		this.loaded = true;
	});
};

// Retrieve current layout
function saveLayout() {
	return "[" + $(".module", "#main").map(function(){
		return "{i:'" + this.id + "',c:'" + this.parentNode.id + "',t:'" + this.tab +"'}";
	}).get().join(",") + "]";
};

// Load layout defined in modules.js
function loadLayout() {
	// Predefined layout from modules.js is used here, but you can use
	// dynamic script to load customized layout instead
	var l = _layout;

	$.each(l.reverse(), function(i,m) {
		if (m) {
			var x = _modules[m.i];
			if ($("#"+m.t).size() > 0)
				$("#"+m.c).addModule({id:m.i, title:x.t, url:x.l, tab:m.t, color:(x.c || null)});
		}
	});
};

// Activate modules preloaded in index.html
function loadStaticModules(){
	$(".module", "#main").each(function(){
		var p = this.id.split("#");	//e.g., m101#t1
		$.extend(this, {
			id: p[0],
			tab: p[1],
			url: _modules[p[0]].l,
			loaded: true
		});
		$("#header_tabs li#" + p[1])[0].modules[p[0]] = this;
		widgetize.apply(this)
	})
}

// Used on pre-formated <DIV><UL.tabsul><DIVs></DIV> section
jQuery.fn.Tabs = function() {
	return this.each(function() {
		var x = $(this);
		var targets = x.children("div").addClass("tabsdiv").hide();

		x.children(".tabsul").children("li").each(function(i) {
			this.target = targets[i];
			$(this).click(function() {
				if ($(this).is(".on")) return;

				var y = $(this).siblings(".on");
				y.add(this).toggleClass("on");
				if ((this.id) && (!this.loaded)) {
					$(this.target).load(_modules[this.id].l,widgetize);
					this.loaded = true;
				}
				$(this.target).add(y.size() > 0 ? y[0].target : null).toggle();
			});
		}).eq(0).click();
	});
};

// Used on pre-formated <DL> section
// Exclusive accordion, only one on at a time
jQuery.fn.Accordion = function() {
	return this.each(function () {
		$(this).children("dt").click(function(){
			var x = $(this);
			if (x.is(".on")) return;

			x.siblings(".on").andSelf().toggleClass("on");
			x.siblings("dd:visible").add(x.next()).slideToggle();
		}).eq(0).click();
	});
};

// Used on pre-formated <DL> section
// Mutiple accordions, individual on/off control
jQuery.fn.MAccordion = function() {
	return this.each(function () {
		var x = $(this);

		x.addClass("accordion").children("dd").slideDown();
		x.children("dt").addClass("on").click(function(){
			$(this).toggleClass("on").next().slideToggle();
		});
	});
};

jQuery.fn.NavIcon = function() {
	return this.each(function(i){
		var t = $(this).attr("title");
		$(this).wrap("<div class='navdiv'><a href=# id='" + this.id +"'></a></div>");
		var x = $(this.parentNode);
		x.append("<br/>"+t);
		x.click(ReplaceModule);
	});
};

// When a NavLi (or NavIcon) item is clicked, close all modules in column2 (c2)
// and add a new module designated by the NavLi's ID 
function ReplaceModule() {
	if (!this.id) return;
	var i = this.id;
	var x = $(".module:visible",c2);
	$(".action_close",x).mousedown();
	var m = _modules[i];
	c2.addModule({id:i,
				title:m.t || this.innerHTML,
				url:m.l,
				color:m.c||null});
	return false;
};

// Widgetize content of a new content block before showing
function widgetize(){
	$(".tabs", this).Tabs();
	$(".accordion", this).Accordion();
	$(".maccordion", this).MAccordion();
	$(".navicon > img", this).NavIcon();
	$(".navul > li", this).addClass('navli');
	$(".rssul a",this).addClass('rssli');
	$("a[href^=http], a[rel=new]", this).attr("target", "_blank");
	$("form.ajaxform1",this).AjaxForm1();
	$("form.ajaxform2",this).AjaxForm2();
};

// Some actions are enabled without explicit code
function LiveEvents() {
	$(".thickbox").live("click", TB);
	$("a.local").live("click", LocalLink);
	$("a.tab").live("click", TabLink);
	$(".navli").live("click", ReplaceModule);
	$(".rssli").live("click", LoadRSSModule);
	$(".action_refresh").live("mousedown", loadContent);
	$(".action_min").live("mousedown", minModule);
	$(".action_max").live("mousedown", maxModule);
	$(".action_close").live("mousedown", closeModule);
};

// When a RSSLi item is clicked, close all modules in column2 (c2)
// and add a new module with dynamic RSS content
function LoadRSSModule() {
	x = $(".module:visible",c2);
	$(".action_close",x).mousedown();
	c2.addModule({id:'m000',			//Module ID doesn't matter now
				title:$(this).text(),	//Link text as module title
				url:'rss.php?q='+encodeURIComponent(this.href)});	//Original link turn into proxy query
	return false;
};

//Used on DIV.main_container only, 'tab' is used only when loading layouts
//When 'tab' is omitted, ct (current tab) is used instead
jQuery.fn.addModule = function(settings) { //id, title, url, tab
	return this.each(function() {
		var options = $.extend({
			title	: null,
			tab		: null,
			color	: null
		}, settings);

		var tx;

		if (options.tab) {
			tx = document.getElementById(options.tab);
			if (tx.modules[options.id]) return;	//Return if module already exists
		} else tx = ct;

		if (!options.tab && (m = ct.modules[options.id])) {
			$(m).fadeTo('fast', 0.5).fadeTo('fast', 1);
			return; //Disable duplicate in a same tab
		}

		var y = $("#module_template").clone();
		var x = y[0];
		x.loaded = false;
		x.url = options.url;
		x.tab = tx.id;
		x.id = options.id;

		tx.modules[x.id] = x;

		if (options.title) $(".moduleTitle", x).text(options.title);
		else $(".moduleHeader",x).rm();

		if (options.color) $(x).addClass(options.color);

		$(this).prepend(x);
		if (tx === ct) $(x).show().loadContent();
	});
};

// Actions taken when you click a header tab
function HeaderTabClick(){
	if (this === ct) return;	//Return if click on current active tab

	$(this).siblings(".on").andSelf().toggleClass("on");

	//Hide last tab's modules
	$(".module:visible").hide();
	helper.hide();

	ct = this;
	var x = _tabs[ct.id];

	// Load an extra helper content block if defined
	// with a file name default to current tab's id
	if (x.helper) helper.load(x.helper == true ? this.id+".html" : x[helper], widgetize).show();

	//Ajust column widths
	c1.css({width:x.c1});
	c2.css({width:x.c2});
	if (x.c2 == "auto") {
		c2.css({'float':"none", marginLeft:x.c1});
	} else {
		c2.css({'float':"left", marginLeft:0});
	}
	c3.css({width:(x.c3 || 0)});

	location.hash = '#' + this.id;
	//Load content and show module
	$.each(this.modules, function(i,m){
		// Lazy loading when the tab is activated
		if(!m.loaded) $(m).loadContent();
		$(m).fadeIn();
	});
};

$(function(){
	c1 = $("#c1");
	c2 = $("#c2");
	c3 = $("#c3");
	helper = $("#helper");
	$("#loading").ajaxStart(function(){
		$(this).show();
	}).ajaxStop(function(){
		$(this).hide();
	});

	LiveEvents();

	$("#header_tabs li").each(function(){
		// During initialization, attach a "modules" array to each tab
		this.modules = {};
		$(this).click(HeaderTabClick);
	});

	$(".main_containers").sortable({
		connectWith: ['.main_containers'],
		handle: '.moduleHeader',
		revert: true,
		tolerance: 'pointer'
	});

	// Load module definitions for each tab
	loadStaticModules();
	loadLayout();

	$("#expd").click(showAll);
	$("#clps").click(hideAll);
	//Make all external links open in new window
	$("a[href^=http]").attr("target","_blank");
	//Make all links with rel=new attribute to open in new window
	$("a[rel=new]").attr("target","_blank");

	t = location.hash.slice(1).match(/[a-zA-Z][\w]*/);
	t = $("#header_tabs li#"+t);
	if (t.size() != 1) t = $("#header_tabs li:first");

	setTimeout("t.click()", 20);
});

// Container Actions, apply on modules
function showAll() {
	$(".moduleContent").show();
	$(".action_min").show();
	$(".action_max").hide();
	$("#expd").hide();
	$("#clps").show();
};

function hideAll() {
	$(".moduleContent").hide();
	$(".action_max").show();	
	$(".action_min").hide();	
	$("#expd").show();
	$("#clps").hide();
};

// Module Actions, apply on current module
function loadContent() {
	$(this).parents(".module").loadContent();
};

function minModule() {
	$(this).hide().parents(".moduleFrame").children(".moduleContent").hide();
	$(this).siblings(".action_max").show();
};

function maxModule() {
	$(this).hide().parents(".moduleFrame").children(".moduleContent").show();
	$(this).siblings(".action_min").show();
};

function closeModule() {
	var m = $(this).parents(".module");
	delete ct.modules[m[0].id];
	m.rm();
};

// ----------------------------------------------------
//    Extra Methods for More Dynamic Content Loading
// ----------------------------------------------------

// Used on A.local to change the content of current module
function LocalLink() {
	$(this).parents(".module").loadContent(this.href);
	return false;
};

// Used on A.tab to switch to another Tab
function TabLink() {
	$("#header_tabs li" + "#" + this.id).click();
	return false;
};

// Used on FORM.ajaxform1, replace Form's parent DIV.moduleContent with response from Ajax submit
jQuery.fn.AjaxForm1 = function() {
	return this.each(function(){
		var x = this;
		var result = $(this).parents(".moduleContent");
		$(x).submit(function(){
			$.post(x.action, $(x).serialize(), function(data){result.html(data);widgetize.apply(result[0])});
			return false;
		});
	});
};

// Used on FORM.ajaxform2, replace Form > div.result with response from Ajax submit
jQuery.fn.AjaxForm2 = function() {
	return this.each(function(){
		var x = this;
		var result = $(".result",this);
		$(x).submit(function(){
			$.post(x.action, $(x).serialize(), function(data){result.html(data);widgetize.apply(result[0])});
			return false;
		});
	});
};
