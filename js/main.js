/*global document, $, console */
/*jshint globalstrict: true*/
/* enable strict mode */
"use strict";


var buttons = {
		l: ['c2','c3','c4','c5','c6','c7'],
		m: ['m0','m1','m2','m3', 'm4'],
		d: ['d0','d1','d2'],
		n: ['n0','n1','n2','n3','n4']
	},
	cspine = {
		levels: buttons.l,
		types: ['m','d','n'],
		data: {c2:{},c3:{},c4:{},c5:{},c6:{},c7:{}}
	},
	text = {
		m0: 'There is no morphologic abnormality of ~~~',
		m1: 'There is a compression injury of ~~~',
		m2: 'There is a burst fracture of ~~~',
		m3: 'There is a distraction injury of ~~~',
		m4: 'There is a translation/rotation injury of ~~~',
		d0: 'The disco-ligamentous complex (DLC) at !!! is intact. ',
		d1: 'The disco-ligamentous complex (DLC) at !!! is indeterminate. ',
		d2: 'The disco-ligamentous complex (DLC) at !!! is disrupted. ',
		n0: 'Normal neurologic function. ',
		n1: 'Root injury. ',
		n2: 'Complete cord injury. ',
		n3: 'Incomplete cord injury. ',
		n4: 'Continuous cord compression. '
	},
	hints = {};


$(document).ready(function() {

// main report generation
cspine.update = function() {
	var i = 0, j;
	cspine.report = {c2: '',c3: '',c4: '',c5: '',c6: '',c7: ''};

	cspine.getData();

	// quit if no level is selected
	if (!$('#divLevel button.active').attr('id')) return false;

	// for each level
	for (i = 0; i < cspine.levels.length; i++) {
		var	morph = cspine.data[cspine.levels[i]].m,
			DLC = cspine.data[cspine.levels[i]].d,
			neuro = cspine.data[cspine.levels[i]].n;

		// add a sentence for each selection
		cspine.report[cspine.levels[i]] =
			(text[cspine.data[cspine.levels[i]].m] || '') +
			(text[cspine.data[cspine.levels[i]].d] || '') +
			(text[cspine.data[cspine.levels[i]].n] || '');

		// add SLIC score if all 3 pathologies are inputted
		if (morph && DLC && neuro) {
			cspine.report[cspine.levels[i]] +=
				'The SLIC score is ' +
				(~~morph[1] + ~~DLC[1] + ~~neuro[1]) + '.';
		}
	}

	cspine.fixReport();

	$('#textareaReport').html(cspine.reportHTML);
};

// get clicked state of each pathology
cspine.getData = function() {
	var level = $('#divLevel button.active').attr('id');

	if (!level) return false;

	cspine.data[level].m = $('#divMorph button.active').attr('id') || '';
	cspine.data[level].d = $('#divDLC button.active').attr('id') || '';
	cspine.data[level].n = $('#divNeuro button.active').attr('id') || '';
};

// turn the report data into words
cspine.fixReport = function() {
	var i;
	cspine.reportHTML = '';

	for (i = 0; i < cspine.levels.length; i++) {
		// add spinal levels
		cspine.report[cspine.levels[i]] = cspine.report[cspine.levels[i]]
			.replace(/(.*? )~~~/, '$1C' + (i+2) + '. ')
			.replace(/(.*? )!!!/, '$1C' + (i+2) + '-C' + (i+3))
			.replace(/C8/, 'T1');
	}

	// join each level's text into a single HTML snippet
	for (i = 0; i < cspine.levels.length; i++) {
		cspine.reportHTML += cspine.report[cspine.levels[i]] + '<br>';
	}

	// trim excess newlines from unused levels
	cspine.reportHTML = cspine.reportHTML
		.replace(/(<br>)+/g, '<br>')
		.replace(/^<br>/, '');

	if (cspine.reportHTML === '<br>' || cspine.reportHTML === '') {
		cspine.reportHTML = 'No cervical spine injury.';
	}

	// console.log(cspine.report);
};

// clear all buttons in the desired line
cspine.clearLine = function(line) {
	var i;
	for (i = 0; i < buttons[line].length; i++) {
		$('#' + buttons[line][i]).removeClass('active');
	}
};

// restore clicked buttons
cspine.loadLevel = function(level) {
	var i, cdl = cspine.data[level];

	for (i = 0; i < cspine.types.length; i++) {
		cspine.clearLine(cspine.types[i]);
		if (cdl[cspine.types[i]]) {
			$('#' + cdl[cspine.types[i]]).addClass('active').siblings().removeClass('active');
		}
	}
};

// [boolean] is there at least 1 finding at the queried level?
cspine.LevelPos = function(level) {
	var cdl = cspine.data[level];
	if (cdl.m || cdl.d || cdl.n) {
		return true;
	} else {
		return false;
	}
};

// manually replicating bootstrap functionality to avoid race condition
$('button').click(function() {
	$(this).addClass('active').siblings().removeClass('active');
	$(this).blur();

	if (this.id[0] === 'c') {
		cspine.loadLevel(this.id);
		$(this).addClass('curLevel').siblings().removeClass('curLevel');
	}

	for (var i = 0; i < cspine.levels.length; i++) {
		if (cspine.LevelPos(cspine.levels[i])) {
			if (cspine.levels[i] !== $('#divLevel button.active').attr('id')) {
				$('#' + cspine.levels[i]).addClass('levelPos');
			} else {
				$('#' + cspine.levels[i]).removeClass('levelPos');
			}
		}
	}

	cspine.update();
});

// show popovers on hover
$('button[type="radio"]').hover(function() {
	if ($('#cbHints').is(':checked')) {
		$(this).popover('show');
	} else {
		return;
	}
}, function() {
	$(this).popover('hide');
});

// initialize hints popovers
cspine.initHints = function() {
	var i;
	hints = {
		m0: {
			title: '<b>No morphologic abnormality</b> [0 pts]',
			content: 'No spinal column disruption'
		},
		m1: {
			title: '<b>Compression fracture</b> [1 pt]',
			content:
				'Visible loss of height through part of or an entire vertebral body, or endplate disruption<br>' +
				'<i>e.g. flexion "tear-drop" fracture</i>'
		},
		m2: {
			title: '<b>Burst fracture</b> [2 pts]',
			content: 'A type of compression fracture which results in disruption of the posterior vertebral body cortex with retropulsion into the spinal canal'
		},
		m3: {
			title: '<b>Distraction injury</b> [3 pts]',
			content:
				'Anatomic dissociation in the vertical axis<br>' +
				'<u>Flexion</u>: disruption of the strong capsular and bony constraint of facet articulation<br>' +
				'<u>Extension</u>: disruption of the strong tensile properties of the anterior longitudinal ligament (ALL), intervertebral disc, vertebral body'
		},
		m4: {
			title: '<b>Translation/rotation injury</b> [4 pts]',
			content:
				'Horizontal displacement of one part of the subaxial cervical spine with respect to the other<br>' +
				'<li>Relative angulation > 11&deg;<br>' +
				'<i>e.g. unilateral/bilateral facet fracture-dislocations, fracture separation of the lateral mass, bilateral pedicle fractures</i>'
		},
		d0: {
			title: '<b>Intact disco-ligamentous complex (DLC)</b> [0 pts]',
			content: 'No disruption of the disco-ligamentous complex (DLC)'
		},
		d1: {
			title: '<b>Indeterminate disco-ligamentous complex (DLC)</b> [1 pt]',
			content: 'Indeterminate competence of the disco-ligamentous complex (DLC)'
		},
		d2: {
			title: '<b>Disrupted disco-ligamentous complex (DLC)</b> [2 pts]',
			content:
				'Abnormal bony relationships' +
				'<ul><li>widened interspace space' +
				'<li>dislocation or separation of facet joints' +
				'<li>subluxation of vertebral bodies' +
				'<li>widened disc space</ul>'
		},
		n0: {
			title: '<b>Intact neurologic status</b> [0 pts]',
			content: 'No clinical neurologic injury'
		},
		n1: {
			title: '<b>Root injury</b> [1 pt]',
			content: 'Nerve root compression'
		},
		n2: {
			title: '<b>Complete spinal cord injury</b> [2 pts]',
			content: '<i>e.g. ASIA A</i>'
		},
		n3: {
			title: '<b>Incomplete spinal cord injury</b> [3 pts]',
			content: 'Incomplete spinal cord injury (SCI) generally requires more urgent treatment than complete SCI'
		},
		n4: {
			title: '<b>Continuous cord compression</b> [+1 pt]',
			content: 'Ongoing cord compression in the setting of neurologic deficit'
		}
	};
	buttons.p = buttons.m.concat(buttons.d, buttons.n);

	$('button[type="radio"]').popover({
		container: 'body',
		placement: 'top',
		html: true,
		trigger: 'manual'
	});

	for (i = 0; i < buttons.p.length; i++) {
		var po = $('#'+buttons.p[i]).data('bs.popover');
		po.options.title = hints[buttons.p[i]].title;
		po.options.content = hints[buttons.p[i]].content;
	}
};

// initialization - preselect C2-3
$('#c2').addClass('curLevel active');
cspine.initHints();
cspine.update();


});
