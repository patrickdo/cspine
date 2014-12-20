/*global document, $, console */
/*jshint globalstrict: true*/
/* enable strict mode */
"use strict";


var buttons = {
		l: ['l2','l3','l4','l5','l6','l7'],
		m: ['m0','m1','m2','m3'],
		d: ['d0','d1','d2'],
		n: ['n0','n1','n2','n3','n4']
	},
	cspine = {
		data: {},
		report: 'No fracture or dislocation in the cervical spine.'
	};

$(document).ready(function() {

	// var buttons = {
	// 	m: ['#m0','#m1','#m2','#m3'],
	// 	d: ['#d0','#d1','#d2'],
	// 	n: ['#n0','#n1','#n2','#n3','#n4']
	// };


	var m_btn = ['#m0','#m1','#m2','#m3'],
		d_btn = ['#d0','#d1','#d2'],
		n_btn = ['#n0','#n1','#n2','#n3','#n4'];

	cspine.update = function(level) {

		$('#textareaReport').html(cspine.report);
	};

	cspine.getLevel = function() {

	};




	// $('button').click(function() {
	// 	var i, len;

	// 	// highlight clicked button
	// 	$(this)
	// 		.css('border-color', '#eee')
	// 		// .css('border-color', '#2b3e50')
	// 		.css('font-weight', 'bold')
	// 		.css('text-shadow', '-1px -1px 0 #485563, 1px -1px 0 #485563, -1px 1px 0 #485563, 1px 1px 0 #485563');
	// 	if (this.id[0] === 'l') {
	// 		$(this)
	// 			.css('border-color', '#ec971f')
	// 			.css('background-color', '#c9302c');
	// 	}

	// 	// remove highlight from other buttons within the group
	// 	for (i = 0, len = buttons[this.id[0]].length; i < len; i++) {
	// 		if (buttons[this.id[0]][i] !== this.id) {
	// 			$('#' + buttons[this.id[0]][i])
	// 				.css('border-color', 'transparent')
	// 				.css('font-weight', '300')
	// 				.css('text-shadow', 'none');

	// 			if (this.id[0] === 'l') {
	// 				$('#' + buttons[this.id[0]][i])
	// 					.css('background-color', '#4e5d6c');
	// 			}
	// 		}
	// 	}

	// 	cspine.update(3);

	// });

	$('a').click(function() {
		var i, len;

		// add highlight to selected button
		if (this.id[0] === 'l') {
			$(this).addClass('levelClicked');
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
	});











});
