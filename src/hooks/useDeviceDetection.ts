"use client"

import { useEffect, useState } from "react"

type DeviceType = "mobile" | "tablet" | "desktop"

export function useDeviceDetection() {
  const [device, setDevice] = useState<DeviceType>("desktop")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const detectDevice = () => {
      const width = window.innerWidth

      if (width < 768) {
        setDevice("mobile")
      } else if (width < 1024) {
        setDevice("tablet")
      } else {
        setDevice("desktop")
      }
    }

    setMounted(true)
    detectDevice()

    window.addEventListener("resize", detectDevice)
    return () => window.removeEventListener("resize", detectDevice)
  }, [])

  return { device, isMobile: device === "mobile", isTablet: device === "tablet", mounted }
}
