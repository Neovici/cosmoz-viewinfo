(function () {

	'use strict';

	window.Cosmoz = window.Cosmoz || {};

	const viewInfoInstances = [],
		sharedViewInfo = {
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
			viewInfoInstances.push(this);
			// Needed to make template views trigger on load and not only on resize
			this.viewInfo = sharedViewInfo;
		},
		/**
		 * Remove from view instances.
		 *
		 * @returns {void}
		 */
		detached() {
			const i = viewInfoInstances.indexOf(this);
			if (i >= 0) {
				viewInfoInstances.splice(i, 1);
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
			this.cancelDebouncer('_throttleResize');
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
			viewInfoInstances.forEach(instance => {
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
			if (!Array.isArray(viewInfoInstances) || viewInfoInstances.length === 0) {
				return;
			}

			this.debounce('_throttleResize', () => {
				const update = this._updateViewSize();

				if (update === undefined) {
					return;
				}
				viewInfoInstances.filter((el) => {
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
			}, this.throttleTimeout);
		}
		/**
		 * Recalculates viewInfo and updated sharedViewInfo accordingly.
		 *
		 * @returns {boolean}  returns true if sharedViewInfo.width is lower the
		 * next width
		 */
		_updateViewSize() {
			const
				prevWidth = sharedViewInfo.width,
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

			const delta = this._getDelta(sharedViewInfo, next);

			Object.keys(delta).forEach(key => {
				sharedViewInfo[key] = delta[key];
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
