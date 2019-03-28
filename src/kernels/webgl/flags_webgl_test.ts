/**
 * @license
 * Copyright 2019 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */

import * as device_util from '../../device_util';
import {ENV} from '../../environment';
import {describeWithFlags, WEBGL_ENVS} from '../../jasmine_util';

describeWithFlags(
    'WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_RELIABLE', WEBGL_ENVS, () => {
      it('disjoint query timer disabled', () => {
        // const features:
        //     Flags = {'WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION': 0};

        // const env = new Environment(features);
        ENV.set('WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION', 0);

        expect(ENV.get('WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_RELIABLE'))
            .toBe(false);
      });

      it('disjoint query timer enabled, mobile', () => {
        // const flags:
        //     Flags = {'WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION': 1};
        ENV.set('WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION', 1);
        spyOn(device_util, 'isMobile').and.returnValue(true);

        // const env = new Environment(flags);

        expect(ENV.get('WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_RELIABLE'))
            .toBe(false);
      });

      it('disjoint query timer enabled, not mobile', () => {
        // const flags:
        //     Features = {'WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION': 1};
        ENV.set('WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION', 1);

        spyOn(device_util, 'isMobile').and.returnValue(false);

        // const env = new Environment(flags);

        expect(ENV.get('WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_RELIABLE'))
            .toBe(true);
      });
    });

describeWithFlags('max texture size', WEBGL_ENVS, () => {
  it('should not throw exception', () => {
    expect(() => ENV.get('WEBGL_MAX_TEXTURE_SIZE')).not.toThrow();
  });
});
