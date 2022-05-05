/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// If the loader is already loaded, just stop.
// @ts-expect-error ts-migrate(2339) FIXME: Property 'define' does not exist on type 'Window &... Remove this comment to see the full error message
if (!self.define) {
  let registry = {};

  // Used for `eval` and `importScripts` where we can't get script URL by other means.
  // In both cases, it's safe to use a global var because those functions are synchronous.
  let nextDefineUri: any;

  const singleRequire = (uri: any, parentUri: any) => {
    uri = new URL(uri + ".js", parentUri).href;
    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    return registry[uri] || (
      
        new Promise(resolve => {
          if ("document" in self) {
            const script = document.createElement("script");
            script.src = uri;
            script.onload = resolve;
            document.head.appendChild(script);
          } else {
            nextDefineUri = uri;
            importScripts(uri);
            // @ts-expect-error ts-migrate(2794) FIXME: Expected 1 arguments, but got 0. Did you forget to... Remove this comment to see the full error message
            resolve();
          }
        })
      
      .then(() => {
        // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        let promise = registry[uri];
        if (!promise) {
          throw new Error(`Module ${uri} didn’t register its module`);
        }
        return promise;
      })
    );
  };

  // @ts-expect-error ts-migrate(2339) FIXME: Property 'define' does not exist on type 'Window &... Remove this comment to see the full error message
  self.define = (depsNames: any, factory: any) => {
    // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
    const uri = nextDefineUri || ("document" in self ? document.currentScript.src : "") || location.href;
    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    if (registry[uri]) {
      // Module is already loading or loaded.
      return;
    }
    let exports = {};
    const require = (depUri: any) => singleRequire(depUri, uri);
    const specialDeps = {
      module: { uri },
      exports,
      require
    };
    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    registry[uri] = Promise.all(depsNames.map(
      // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      (depName: any) => specialDeps[depName] || require(depName)
    )).then(deps => {
      factory(...deps);
      return exports;
    });
  };
}
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'define'.
define(['./workbox-74d02f44'], (function (workbox: any) { 'use strict';

  /**
  * Welcome to your Workbox-powered service worker!
  *
  * You'll need to register this file in your web app.
  * See https://goo.gl/nhQhGp
  *
  * The rest of the code is auto-generated. Please don't update this file
  * directly; instead, make changes to your Workbox build configuration
  * and re-run your build process.
  * See https://goo.gl/2aRDsh
  */

  importScripts("fallback-development.js");
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'skipWaiting' does not exist on type 'Win... Remove this comment to see the full error message
  self.skipWaiting();
  workbox.clientsClaim();
  workbox.registerRoute("/", new workbox.NetworkFirst({
    "cacheName": "start-url",
    plugins: [{
      cacheWillUpdate: async ({
        request,
        response,
        event,
        state
      }: any) => {
        if (response && response.type === 'opaqueredirect') {
          return new Response(response.body, {
            status: 200,
            statusText: 'OK',
            headers: response.headers
          });
        }

        return response;
      }
    }, {
      handlerDidError: async ({
        request
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'fallback' does not exist on type 'Window... Remove this comment to see the full error message
      }: any) => self.fallback(request)
    }]
  }), 'GET');
  workbox.registerRoute(/.*/i, new workbox.NetworkOnly({
    "cacheName": "dev",
    plugins: [{
      handlerDidError: async ({
        request
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'fallback' does not exist on type 'Window... Remove this comment to see the full error message
      }: any) => self.fallback(request)
    }]
  }), 'GET');

}));
//# sourceMappingURL=sw.js.map
