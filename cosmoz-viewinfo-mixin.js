import { dedupingMixin } from '@polymer/polymer/lib/utils/mixin';

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
	},

	/**
	 * Mixin to inherit the viewInfo property with device and viewport info.
	 *
	 * @polymer
	 * @mixinFunction
	 */
	viewInfoAware = dedupingMixin(base =>
		class extends base {
			static get properties() {
				return {
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
				};
			}

			/**
			 * Add to view info instances and set the shared view info to the view info.
			 *
			 * @returns {void}
			 */
			connectedCallback() {
				super.connectedCallback();
				VIEW_INFO_INSTANCES.push(this);
				// Needed to make template views trigger on load and not only on resize
				this.viewInfo = SHARED_VIEW_INFO;
			}

			/**
			 * Remove from view instances.
			 *
			 * @returns {void}
			 */
			disconnectedCallback() {
				super.disconnectedCallback();
				const i = VIEW_INFO_INSTANCES.indexOf(this);
				if (i >= 0) {
					VIEW_INFO_INSTANCES.splice(i, 1);
				}
			}
		}
	);

export {
	VIEW_INFO_INSTANCES,
	SHARED_VIEW_INFO,
	viewInfoAware
};
