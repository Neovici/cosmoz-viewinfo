(function () {

	'use strict';

	window.Cosmoz = window.Cosmoz || {};

	const VIEW_INFO_INSTANCES = [],
		SHARED_VIEW_INFO = {
			desktop: false,
			effects: 10,
			height: 0,
			landscape: false,
			mobile: false,
			portrait: true,
			tablet: false,
			width: 0
		};

	/**
	 * Behavior to inherit the viewInfo property with device and viewport info.
	 *
	 @polymerBehavior
	 */
	Cosmoz.ViewInfoBehavior = {
		properties: {
			/**
			 * viewInfo object
			 * {
			 * 	desktop: Boolean,
			 * 	effects: Number (1-10),
			 * 	height: Number,
			 * 	landscape: Boolean,
			 * 	mobile: Boolean,
			 * 	portrait: Boolean,
			 * 	tablet: Boolean,
			 * 	width: Number
			 * }
			 */
			viewInfo: {
				type: Object,
				notify: true
			}
		},
		/**
		 * Add to view info instances and set the shared view info to the view info.
		 *
		 * @returns {void}
		 */
		attached() {
			VIEW_INFO_INSTANCES.push(this);
			// Needed to make template views trigger on load and not only on resize
			this.viewInfo = SHARED_VIEW_INFO;
		},
		/**
		 * Remove from view instances.
		 *
		 * @returns {void}
		 */
		detached() {
			const i = VIEW_INFO_INSTANCES.indexOf(this);
			if (i >= 0) {
				VIEW_INFO_INSTANCES.splice(i, 1);
			}
		}
	};

	class CosmozViewinfo extends Polymer.mixinBehaviors([Polymer.IronResizableBehavior], Polymer.Element) {
		/**
		 * Get component name.
		 *
		 * @returns {string} Name.
		 */
		static get is() {
			return 'cosmoz-viewinfo';
		}
		/**
		 * Get component properties.
		 *
		 * @returns {object} Properties.
		 */
		static get properties() {
			return {
				/**
				 * Level of effects to use (0-10). Not in use.
				 */
				effects: {
					type: Number,
					value: 10,
					observer: '_effectsChanged'
				},
				/**
				 * Width breakpoint for mobile.
				 * https://www.google.com/design/spec/layout/adaptive-ui.html#adaptive-ui-breakpoints
				 */
				mobileBreakpoint: {
					type: Number,
					value: 600
				},
				/**
				 * Width breakpoint for tablet.
				 * https://www.google.com/design/spec/layout/adaptive-ui.html#adaptive-ui-breakpoints
				 */
				tabletBreakpoint: {
					type: Number,
					value: 960
				},
				/**
				 * Minimum delay between each viewinfo-resize event (ms).
				 */
				throttleTimeout: {
					type: Number,
					value: 250
				}
			};
		}

		constructor(){
			super();
			this._boundOnResize = this._onResize.bind(this);
		}

		connectedCallback() {
			super.connectedCallback();
			this.addEventListener('iron-resize', this._boundOnResize);
		}

		disconnectedCallback() {
			super.disconnectedCallback();
			this.removeEventListener('iron-resize', this._boundOnResize);
			if (this._debouncer) {
				this._debouncer.cancel();
			}
		}
		/**
		 * Notify instances of effect changes.
		 *
		 * @param {object} newValue Changed effects.
		 * @returns {void}
		 */
		_effectsChanged(newValue) {
			this._notifyInstances({ effects: newValue });
		}
		/**
		* Loops over registered ViewInfoBehavior components and notify of
		* changes.
		 * TODO: Don't reset the viewInfo property, but rather notify specific
		 * properties.
		 *
		 * @param  {object} delta object with changes
		 * @returns {void}
		 */
		_notifyInstances(delta) {
			VIEW_INFO_INSTANCES.forEach(instance => {
				if (!instance) {
					return;
				}
				Object.keys(delta).forEach(key => {
					instance.notifyPath('viewInfo.' + key, delta[key]);
				});
			});
		}
		/**
		 * Called on `iron-resize`, throttles `viewinfo-resize` events.
		 * @returns {void}
		 */
		_onResize() {
			if (!Array.isArray(VIEW_INFO_INSTANCES) || VIEW_INFO_INSTANCES.length === 0) {
				return;
			}
			Polymer.enqueueDebouncer(
				this._debouncer = Polymer.Debouncer.debounce(this._debouncer,
					Polymer.Async.timeOut.after(this.throttleTimeout),
					() => {
						const update = this._updateViewSize();

						if (update == null) {
							return;
						}
						VIEW_INFO_INSTANCES.filter((el) => {
						// Only dispatch event on visible elements, offsetParent should be null for hidden
						// https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetParent
							return el.offsetParent !== null;
						}).forEach(element => {
							element.dispatchEvent(new CustomEvent(
								'viewinfo-resize',
								{
									bubbles: true,
									composed: true,
									detail: {
										bigger: update
									}
								}
							));
						});
					})
			);
		}
		/**
		 * Recalculates viewInfo and updated SHARED_VIEW_INFO accordingly.
		 *
		 * @returns {boolean}  returns true if SHARED_VIEW_INFO.width is lower the
		 * next width
		 */
		_updateViewSize() {
			const
				prevWidth = SHARED_VIEW_INFO.width,
				next = {
					height: this.clientHeight || this.offsetHeight || this.scrollHeight,
					width: this.clientWidth || this.offsetWidth || this.scrollWidth
				};

			next.portrait = next.height > next.width;
			next.landscape = !next.portrait;

			if (next.width <= this.mobileBreakpoint) {
				next.mobile = true;
				next.tablet = false;
			} else if (next.width <= this.tabletBreakpoint) {
				next.mobile = false;
				next.tablet = true;
			} else {
				next.mobile = false;
				next.tablet = false;
			}

			next.desktop = !next.mobile && !next.tablet;

			const delta = this._getDelta(SHARED_VIEW_INFO, next);

			Object.keys(delta).forEach(key => {
				SHARED_VIEW_INFO[key] = delta[key];
			});

			this._notifyInstances(delta);

			return prevWidth < next.width;
		}

		/**
		 ** Calculates the diff between two objects.
		 *
		 * @param  {object} prev First object.
		 * @param  {object} next Second object.
		 * @returns {object} Delta.
		 */
		_getDelta(prev, next) {
			return Object.keys(next).reduce((delta, key) => {
				const nextVal = next[key];
				if (prev[key] === undefined || prev[key] !== nextVal) {
					delta[key] = nextVal;
				}
				return delta;
			}, {});
		}
	}

	customElements.define(CosmozViewinfo.is, CosmozViewinfo);
}());
