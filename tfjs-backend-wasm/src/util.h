/* Copyright 2019 Google Inc. All Rights Reserved.
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
 * ===========================================================================*/

#ifndef TFJS_WASM_UTIL_H_
#define TFJS_WASM_UTIL_H_

#include <vector>

namespace tfjs {
namespace util {

// Helper method to log values in a vector. Used for debugging.
template <class T>
inline void log_vector(const std::vector<T>& v) {
  printf("[");
  for (auto const& value : v) {
    printf("%d,", value);
  }
  printf("]\n");
}

// Returns the size of the vector, given its shape.
inline int size_from_shape(const std::vector<int>& shape) {
  int prod = 1;
  for (const auto& v : shape) {
    prod *= v;
  }
  return prod;
}

}  // namespace util
}  // namespace tfjs
#endif  // TFJS_WASM_UTIL_H_
