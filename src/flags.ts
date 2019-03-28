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
import {ENV} from './environment';

/**
 * This file contains environment-related flag registrations.
 */

/** Whether to enable debug mode. */
ENV.registerFlag('DEBUG', () => false);

/** Whether we are in a browser (as versus, say, node.js) environment. */
ENV.registerFlag('IS_BROWSER', () => typeof window !== 'undefined');

/** Whether we are in a browser (as versus, say, node.js) environment. */
ENV.registerFlag(
    'IS_NODE',
    () => (typeof process !== 'undefined') &&
        (typeof process.versions !== 'undefined') &&
        (typeof process.versions.node !== 'undefined'));

/** Whether this browser is Chrome. */
ENV.registerFlag(
    'IS_CHROME',
    () => typeof navigator !== 'undefined' && navigator != null &&
        navigator.userAgent != null && /Chrome/.test(navigator.userAgent) &&
        /Google Inc/.test(navigator.vendor));

/**
 * True when the environment is "production" where we disable safety checks
 * to gain performance.
 */
ENV.registerFlag('PROD', () => false);

/**
 * Whether to do sanity checks when inferring a shape from user-provided
 * values, used when creating a new tensor.
 */
ENV.registerFlag('TENSORLIKE_CHECK_SHAPE_CONSISTENCY', () => !ENV.get('PROD'));

/** Whether deprecation warnings are enabled. */
ENV.registerFlag('DEPRECATION_WARNINGS_ENABLED', () => true);

/** True if running unit tests. */
ENV.registerFlag('IS_TEST', () => false);
