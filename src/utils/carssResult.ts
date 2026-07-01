/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import { CarssResult } from "../types";

export function createCarssSuccess<T>(
  data: T,
  message?: string,
  status?: number,
  requestId?: string
): CarssResult<T> {
  return {
    success: true,
    data,
    errors: null
  };
}

export function createCarssError<T>(
  errors: string[],
  message?: string,
  status?: number,
  requestId?: string
): CarssResult<T> {
  return {
    success: false,
    data: null,
    errors
  };
}

export function enrichWithContext<T>(
  result: CarssResult<T>,
  message = "Operation completed successfully",
  status = 200,
  requestId = `req-${Date.now()}-${Math.floor(Math.random() * 1000)}`
): Required<CarssResult<T>> {
  return {
    success: result.success,
    status: result.success ? status : 400,
    message: result.success ? message : "Operation failed",
    requestId,
    timestamp: new Date().toISOString(),
    data: result.data as any,
    errors: result.errors
  };
}
