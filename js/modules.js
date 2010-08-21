// Module ID & link definitions
// Format:
// moduleId:{l:"url_of_this_module",
// 			 t:"title_for_this_module",
// 			 c:"optional color definition for title bar"}
var _modules={
	m101:{l:"pages/Server_Management/serversstate.php",	t:"Servers State", c:"blue"},

	m201:{l:"m201.html",	t:"Module:m201"},
	m202:{l:"m202.html",	t:"Module:m202"},
	m203:{l:"m203.html",	t:"Module:m203"},
	m204:{l:"m204.html",	t:"Module:m204"},
	m205:{l:"m205.html",	t:"Module:m205"},
	m206:{l:"m206.html",	t:"Module:m206"},

	m301:{l:"m301.html",	t:"Module Definition (m301)"},
	m302:{l:"m302.html",	t:"Layout Definition (m302)"},
	m303:{l:"m303.html",	t:"Column Width Definition (m303)", c:"green"},

	m400:{l:"m400.html",	t:"Side Menu (m400)"},
	m401:{l:"m401.html",	t:"Tabs Control (m401)"},
	m402:{l:"m402.html",	t:"Accordion Control (m402)"},
	
	m500:{l:"m500.html",	t:"Some Goodies (m500)"},
	m501:{l:"m501.html",	t:"Local Link (m501)"},
	m502:{l:"m502.html",	t:"Ajax Forms (m502)"},
	m503:{l:"m503.html",	t:"Tab Link (m503)"},
	m504:{l:"m504.html",	t:"Thick Box (m504)"},

	m700:{l:"m700.html",	t:"RSSLi Menu (m700)"},
	m701:{l:"m701.html",	t:"RSS Reader (m701)"},
	m702:{l:"rss.php?q=http%3A%2F%2Frss.msnbc.msn.com%2Fid%2F3032091%2Fdevice%2Frss%2Frss.xml",	t:"MSNBC - Static RSS Module (m702)"},

	m801:{l:"m801.html",	t:"CNN.com US"},
	m802:{l:"m802.html",	t:"Alexa Widget Sample"},
	m803:{l:"m803.html",	t:"Soduku"},

	m601:{l:"m601.html",	t:"Resources & Credit"},
	m602:{l:"m602.html",	t:"License"}
};

// Layout definitions for each tab, aka, which modules go to which columns under which tab
// Format:
//	{i:"id_of_the_module	(refer to _modules)",
//	c:"column_it_belongs_to	(c1, c2, c3)"
//	t:"tab_it_belongs_to	(t1, t2, ...)"}
var _layout=[
	{i:'m101',c:'c1',t:'t1'},

	{i:'m201',c:'c1',t:'t2'},{i:'m202',c:'c2',t:'t2'},{i:'m203',c:'c3',t:'t2'},
	{i:'m204',c:'c1',t:'t2'},{i:'m206',c:'c2',t:'t2'},{i:'m205',c:'c3',t:'t2'},

	{i:'m301',c:'c1',t:'t3'},{i:'m302',c:'c2',t:'t3'},{i:'m303',c:'c3',t:'t3'},

	{i:'m400',c:'c1',t:'t4'},{i:'m401',c:'c2',t:'t4'},

	{i:'m500',c:'c1',t:'t5'},{i:'m501',c:'c2',t:'t5'},

	{i:'m700',c:'c1',t:'t7'},{i:'m701',c:'c2',t:'t7'},
							 {i:'m702',c:'c2',t:'t7'},
							 
	{i:'m801',c:'c1',t:'t8'},{i:'m802',c:'c2',t:'t8'},{i:'m803',c:'c3',t:'t8'},

	{i:'m601',c:'c1',t:'t6'},
	{i:'m602',c:'c1',t:'t6'}
];

// Column width definitions for each tab
// Valid values are pixel, % or auto
// Currently, "auto" is only valid on column2
// You can support more features by refining function HeaderTabClick()
var _tabs={
	t1:{c1:"100%",helper:true},
	t2:{c1:"33.3%",c2:"33.3%",c3:"33.3%",helper:true},
	t3:{c1:"50%",c2:"50%",c3:"100%",helper:true},
	t4:{c1:"270px",c2:"auto",c3:0,helper:true},
	t5:{c1:"270px",c2:"auto",c3:0,helper:true},
	t6:{c1:"100%",c2:0,c3:0},
	t7:{c1:"270px",c2:"auto",c3:0},
	t8:{c1:"33.3%",c2:"33.3%",c3:"33.3%",helper:true}
};