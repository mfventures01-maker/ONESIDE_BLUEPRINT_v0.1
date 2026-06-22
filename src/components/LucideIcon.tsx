/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import * as Icons from "lucide-react";

interface LucideIconProps {
  name: string;
  className?: string;
}

export function LucideIcon({ name, className = "w-5 h-5" }: LucideIconProps) {
  // Safe lookup for arbitrary Lucide Icon strings
  const IconComponent = (Icons as Record<string, React.ComponentType<any>>)[name];

  if (!IconComponent) {
    // Return a default icon in case of dynamic matching anomalies
    return <Icons.HelpCircle className={className} />;
  }

  return <IconComponent className={className} />;
}
