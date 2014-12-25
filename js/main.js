/*global document, $, console */
/*jshint globalstrict: true*/
/* enable strict mode */
"use strict";


var buttons = {
		l: ['l2','l3','l4','l5','l6','l7'],
		m: ['m0','m1','m2','m3', 'm4'],
		d: ['d0','d1','d2'],
		n: ['n0','n1','n2','n3','n4']
	},
	cspine = {
		data: {
			l2: {},
			l3: {},
			l4: {},
			l5: {},
			l6: {},
			l7: {}
		},
		report: {
			l2: '',
			l3: '',
			l4: '',
			l5: '',
			l6: '',
			l7: ''
		},
		levels: buttons.l,
		types: ['m','d','n']
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
	};

$(document).ready(function() {

	cspine.update = function() {
		var i = 0, j, cdl = cspine.data[cspine.levels[i]];
		cspine.report = {l2: '',l3: '',l4: '',l5: '',l6: '',l7: ''};
		cspine.reportHTML = '';
		cspine.getData();

		// cycle through c-spine levels
		for (i = 0; i < cspine.levels.length; i++) {
			// cycle through SLIC injury components
			for (j = 0; j < cspine.types.length; j++) {
				if ( cspine.data[cspine.levels[i]][cspine.types[j]] ) {
					// add text to cspine report by level
					cspine.report[cspine.levels[i]] += text[cspine.data[cspine.levels[i]][cspine.types[j]]];
				}
			}

			// calculate SLIC score if all 3 components are reported
			if ( cspine.data[cspine.levels[i]].m && cspine.data[cspine.levels[i]].d && cspine.data[cspine.levels[i]].n ) {
				cdl.SLIC = ~~cdl.m[1] + ~~cdl.d[1] + ~~cdl.n[1];
				cspine.report[cspine.levels[i]] += 'The SLIC score is ' + cdl.SLIC + '. ';
			}
		}

		cspine.fixReport();

		$('#textareaReport').html(cspine.reportHTML);
	};

	// turn the report data into words
	cspine.fixReport = function() {
		var i;
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
			.replace(/(<br>)+/, '<br>');

		if (cspine.reportHTML === '<br>') {
			cspine.reportHTML = 'No cervical spine injury.';
		}

		// console.log(cspine.report);
	};

	// find out which level button is clicked
	cspine.getLevel = function() {
		var i, len = buttons.l.length;
		for (i = 0; i < len; i++) {
			if ( $('#' + buttons.l[i]).hasClass('levelClicked') ) {
				return buttons.l[i];
			}
		}
		return false;
	};

	// get clicked state of injury component buttons
	cspine.getData = function() {
		var i, j, len = cspine.types.length;
		for (i = 0; i < cspine.types.length; i++) {
			for (j = 0; j < buttons[ cspine.types[i] ].length; j++) {
				if ( $('#' + buttons[ cspine.types[i] ][j]).hasClass('buttonClicked') ) {
					cspine.data[cspine.getLevel()][ cspine.types[i] ] = buttons[ cspine.types[i] ][j];
				}
			}
		}
		return false;
	};

	// are there findings at the queried level?
	cspine.LevelPos = function(level) {
		var cdl = cspine.data[level];
		if (cdl.m || cdl.d || cdl.n) {
			return true;
		} else {
			return false;
		}
	};

	// clear all buttons in the desired line
	cspine.clearLine = function(line) {
		var i;
		for (i = 0; i < buttons[line].length; i++) {
			$('#' + buttons[line][i]).removeClass('buttonClicked');
		}
	};

	// restore clicked buttons
	cspine.loadLevel = function(level) {
		var i, cdl = cspine.data[level];
		for (i = 0; i < cspine.types.length; i++) {
			// clear the entire line first ...
			cspine.clearLine(cspine.types[i]);

			// ... then select the applicable button
			if (cdl[cspine.types[i]]) {
				$('#' + cdl[cspine.types[i]]).addClass('buttonClicked');
			}
		}
	};

	$('a').click(function() {
		var i, len;

		// add highlight to selected button
		if (this.id[0] === 'l') {
			$(this).addClass('levelClicked');
			cspine.loadLevel(this.id);
		} else {
			$(this).addClass('buttonClicked');
		}

		// remove highlight from other buttons within the group
		for (i = 0, len = buttons[this.id[0]].length; i < len; i++) {
			if (buttons[this.id[0]][i] !== this.id) {
				if (this.id[0] === 'l') {
					$('#' + buttons[this.id[0]][i]).removeClass('levelClicked');
				} else {
					$('#' + buttons[this.id[0]][i]).removeClass('buttonClicked');
				}
			}
		}

		// update level buttons according to filled status
		for (i = 0, len = cspine.levels.length; i < len; i++) {
			if (cspine.LevelPos(cspine.levels[i])) {
				if (cspine.levels[i] !== cspine.getLevel()) {
					$('#' + cspine.levels[i]).addClass('levelPos');
				} else {
					$('#' + cspine.levels[i]).removeClass('levelPos');
					// $('#' + cspine.levels[i]).addClass('levelClicked');
				}
			}
		}

		cspine.update();
	});

	// Initialization
	$('#l2').addClass('levelClicked');
	cspine.update();

});
