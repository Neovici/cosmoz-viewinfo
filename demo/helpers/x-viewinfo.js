import { PolymerElement } from '@polymer/polymer/polymer-element';
import { html } from '@polymer/polymer/lib/utils/html-tag';

import { viewInfoAware } from '../../cosmoz-viewinfo-mixin';

class XViewInfo extends viewInfoAware(PolymerElement) {
	static get is() {
		return 'x-viewinfo';
	}

	static get template() {
		return html`
			<slot></slot>
			<span>Mobile: </span><span>{{ viewInfo.mobile }}</span><br>
			<span>Tablet: </span><span>{{ viewInfo.tablet }}</span><br>
			<span>Desktop: </span><span>{{ viewInfo.desktop }}</span><br>
			<span>Portrait: </span><span>{{ viewInfo.portrait }}</span><br>
			<span>Landscape: </span><span>{{ viewInfo.landscape }}</span><br>
			<span>Effects: </span><span>{{ viewInfo.effects }}</span><br>
			<span>Height: </span><span>{{ viewInfo.height }}</span><br>
			<span>Width: </span><span>{{ viewInfo.width }}</span><br>
		`;
	}

	static get properties() {
		return {
			label: {
				type: String
			}
		};
	}

	connectedCallback() {
		super.connectedCallback();
		this.addEventListener('viewinfo-resize', this._viewInfoResize);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this.removeEventListener('viewinfo-resize', this._viewInfoResize);
	}

	_viewInfoResize() {
		// eslint-disable-next-line no-console
		console.log('x-viewinfo ' + this.label + ' resize!');
	}
}

customElements.define(XViewInfo.is, XViewInfo);
