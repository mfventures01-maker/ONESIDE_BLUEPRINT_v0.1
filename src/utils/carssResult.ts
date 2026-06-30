/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import { CarssResult } from "../types";

export function createCarssSuccess<T>(
  data: T,
  message = "Operation completed successfully",
  status = 200,
  requestId = `req-${Date.now()}-${Math.floor(Math.random() * 1000)}`
): CarssResult<T> {
  return {
    success: true,
    status,
    message,
    requestId,
    timestamp: new Date().toISOString(),
    data,
    errors: null
  };
}

export function createCarssError<T>(
  errors: string[],
  message = "Operation failed",
  status = 400,
  requestId = `req-${Date.now()}-${Math.floor(Math.random() * 1000)}`
): CarssResult<T> {
  return {
    success: false,
    status,
    message,
    requestId,
    timestamp: new Date().toISOString(),
    data: null,
    errors
  };
}
