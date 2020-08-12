import {
	assert, fixture, html
} from '@open-wc/testing';

import { CosmozViewInfo } from '../cosmoz-viewinfo.js';

suite('basic', () => {
	test('it works', async ()=>{
		assert.instanceOf( await fixture(html`<cosmoz-viewinfo></cosmoz-viewinfo>`), CosmozViewInfo)
	})
})
