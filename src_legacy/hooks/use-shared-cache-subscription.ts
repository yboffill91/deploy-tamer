// src/hooks/useSharedCacheSubscription.ts
"use client";

import { useEffect } from "react";
import { listenForegroundMessages } from "@/lib/firebase";
import { cacheService } from "@/lib/cache";
import type { GeneralResponse, CRMResponse, Customer } from "@/lib/api/types";

// ---- utilidades de merge ----
function deepMerge<T extends object>(target: T, source: Partial<T>): T {
  return {
    ...target,
    ...Object.keys(source).reduce((acc, key) => {
      const k = key as keyof T;
      if (typeof source[k] === "object" && !Array.isArray(source[k]) && source[k] !== null) {
        acc[k] = deepMerge((target[k] as object) || {}, source[k] as object) as T[keyof T];
      } else {
        acc[k] = source[k] as T[keyof T];
      }
      return acc;
    }, {} as Partial<T>),
  } as T;
}

// ---- helpers de clasificación ----
function classifyUpdate<T extends object>(update: Partial<T>, fullKeys: string[]): "add" | "partial" | "full" {
  if (!(update as any)._id) return "partial"; // 🔹 cambiar id -> _id

  const keys = Object.keys(update);
  const coverage = keys.filter((k) => fullKeys.includes(k)).length;
  const ratio = coverage / fullKeys.length;

  if (ratio > 0.7) return "full";
  if (coverage === 1) return "partial";
  return "add";
}

function mergeEntities<T extends { _id: string }>(
  existing: T[] = [],
  incoming: Partial<T> | Partial<T>[],
  fullKeys: string[],
): T[] {
  const updates = Array.isArray(incoming) ? incoming : [incoming];
  const map = new Map(existing.map((c) => [c._id, c]));

  updates.forEach((upd) => {
    if (!upd._id) return;

    const prev = map.get(upd._id);
    const kind = classifyUpdate(upd, fullKeys);

    if (!prev && kind === "add") {
      map.set(upd._id, upd as T);
    } else if (prev && kind === "partial") {
      map.set(upd._id, { ...prev, ...upd } as T);
    } else if (prev && kind === "full") {
      map.set(upd._id, upd as T);
    }
  });

  return Array.from(map.values());
}

// ---- hook principal ----
export function useSharedCacheSubscription() {
  useEffect(() => {
    console.log("🔔 Suscribiéndose a notificaciones FCM...");

    const unsubscribe = listenForegroundMessages((payload) => {
      console.log("📦 Mensaje FCM recibido:", payload);

      try {
        if (!payload.data?.type) {
          console.log("⚠️ Mensaje sin tipo");
          return;
        }

        const { type, action, payload: raw } = payload.data;
        console.log("🔍 Tipo:", type, "Acción:", action, "Datos crudos:", raw);

        if (!raw) {
          console.log("⚠️ Mensaje sin datos");
          return;
        }

        const newData = JSON.parse(raw);
        console.log("📊 Datos parseados:", newData);

        // ---- GENERAL ----
        if (type === "general") {
          const prev = cacheService.get<GeneralResponse>("admin_general") || {};
          if (action === "update") {
            cacheService.set("admin_general", deepMerge(prev, newData));
          } else if (action === "add") {
            cacheService.set("admin_general", { ...prev, ...newData });
          } else if (action === "refresh") {
            // aquí puedes decidir: refetch() manual
            cacheService.clear("admin_general");
          }
        }

        // ---- CRM ----
        if (type === "crm") {
          const prev = cacheService.get<CRMResponse>("admin_crm") || {};
          if (action === "update") {
            cacheService.set("admin_crm", deepMerge(prev, newData));
          } else if (action === "add") {
            cacheService.set("admin_crm", { ...prev, ...newData });
          } else if (action === "refresh") {
            cacheService.clear("admin_crm");
          }
        }

        // ---- CUSTOMERS ----
        if (type === "customers") {
          const prev = cacheService.get<Customer[]>("customers") || [];

          const merged = mergeEntities(prev, newData, [
            "_id",
            "username",
            "email",
            "name",
            "plan",
            "planStatus",
            "deliveryStatus",
            "createdAt",
            "lastLogin",
            "revenue",
            "multilinkViews",
            "multilinkData",
          ]);

          // 🔹 Map _id -> id para UI
          const normalized = merged.map((c) => ({ ...c, id: c._id }));

          if (action === "update" || action === "add") {
            cacheService.set("customers", normalized);
          } else if (action === "refresh") {
            cacheService.clear("customers");
          }
        }

        console.log("✅ Cache actualizado para tipo:", type, "acción:", action);
      } catch (err) {
        console.error("❌ Error procesando mensaje FCM:", err);
      }
    });

    return () => {
      console.log("🧹 Limpiando suscripción FCM");
      unsubscribe();
    };
  }, []);
}
