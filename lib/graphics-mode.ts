"use client";

import { useSyncExternalStore } from "react";
import { useMediaQuery } from "@/lib/motion-mode";

type DeviceNavigator = Navigator & {
  deviceMemory?: number;
  connection?: { saveData?: boolean; addEventListener?: (type: string, callback: () => void) => void; removeEventListener?: (type: string, callback: () => void) => void };
};

function readDeviceBudget() {
  const device = navigator as DeviceNavigator;
  return !device.connection?.saveData &&
    (device.deviceMemory === undefined || device.deviceMemory >= 4) &&
    (!device.hardwareConcurrency || device.hardwareConcurrency > 2);
}

function subscribeDeviceBudget(callback: () => void) {
  const connection = (navigator as DeviceNavigator).connection;
  connection?.addEventListener?.("change", callback);
  return () => connection?.removeEventListener?.("change", callback);
}

/** Mobile, touch, reduced motion and constrained devices keep the static artwork. */
export function useEnhancedGraphics() {
  const desktop = useMediaQuery("(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
  const budget = useSyncExternalStore(subscribeDeviceBudget, readDeviceBudget, () => false);
  return desktop && budget;
}
