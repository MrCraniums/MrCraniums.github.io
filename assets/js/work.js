/* My Work — stats derived from the entries, staggered reveal, count-up when the panel opens */
(function() {

	var panel = document.getElementById('My_Work');

	if (!panel)
		return;

	var each = function(list, fn) { Array.prototype.forEach.call(list, fn); },
		reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	// Counts come from the lists, so adding an entry keeps every number correct.
		var counts = {
			disclosures: panel.querySelectorAll('#disclosures .r-item').length,
			cves: Array.prototype.filter.call(panel.querySelectorAll('#disclosures .r-id'), function(el) {
				return /^CVE-/.test(el.textContent.trim());
			}).length,
			writeups: panel.querySelectorAll('#writeups .r-item').length
		};

		each(panel.querySelectorAll('[data-stat]'), function(el) {
			el.textContent = counts[el.getAttribute('data-stat')];
		});

	// Staggered reveal (styles in work.css key off .r-anim + the template's .active).
		each(panel.querySelectorAll('.r-stats li, .r-heading, .r-item'), function(el, i) {
			el.classList.add('r-reveal');
			el.style.setProperty('--i', Math.min(i, 12));
		});

		panel.classList.add('r-anim');

	// Count-up on the stat tiles each time the panel opens.
		var countUp = function() {
			each(panel.querySelectorAll('.r-stats [data-stat]'), function(el) {
				var target = counts[el.getAttribute('data-stat')],
					start = null;

				if (reduceMotion || !window.requestAnimationFrame) {
					el.textContent = target;
					return;
				}

				el.textContent = '0';

				var step = function(ts) {
					if (start === null)
						start = ts;

					var p = Math.min((ts - start) / 420, 1);

					el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));

					if (p < 1)
						window.requestAnimationFrame(step);
				};

				window.requestAnimationFrame(step);

				// Guarantee the final value if frames get throttled (background tab, headless, etc.).
				window.setTimeout(function() { el.textContent = target; }, 550);
			});
		};

		var wasActive = false;

		new MutationObserver(function() {
			var isActive = panel.classList.contains('active');

			if (isActive && !wasActive)
				countUp();

			wasActive = isActive;
		}).observe(panel, { attributes: true, attributeFilter: ['class'] });

})();
