import {
	assert, fixture, html
} from '@open-wc/testing';
import { PolymerElement } from '@polymer/polymer/polymer-element';
import { CosmozViewInfo } from '../cosmoz-viewinfo.js';
import { viewInfoAware } from '../cosmoz-viewinfo-mixin.js';

const ViewInfoAware = viewInfoAware(PolymerElement);
customElements.define('viewinfo-aware', ViewInfoAware);

suite('basic', () => {
	test('it works', async () => {
		const mixin = document.createElement('viewinfo-aware'),
			el = await fixture(html`<cosmoz-viewinfo></cosmoz-viewinfo>`);
		el.appendChild(mixin);
		assert.instanceOf(el, CosmozViewInfo);
		assert.equal(el.querySelector('viewinfo-aware').viewInfo.width, el._currentViewInfo.width);
	});
});
