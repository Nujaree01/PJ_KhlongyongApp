// hooks/useLivePlaces.ts
// รวมข้อมูลสถานที่จาก data/places.ts (พิกัด/ลำดับ/หมวดหมู่ — คงที่ ไม่แก้ผ่านแอดมิน)
// เข้ากับข้อมูลที่แอดมินแก้ไขบน Firestore (ชื่อ/คำอธิบาย/รูป/เบอร์โทร ฯลฯ) แบบ real-time
// ถ้า Firestore ยังไม่มีข้อมูล override ของจุดไหน จะใช้ค่าตั้งต้นจาก places.ts แทนอัตโนมัติ

import { useEffect, useState } from "react";
import { PLACES, Place } from "../data/places";
import {
  subscribeToPlaceOverrides,
  PlaceOverridesMap,
} from "../services/placesRemote";

export function useLivePlaces(): { places: Place[]; loading: boolean } {
  const [overrides, setOverrides] = useState<PlaceOverridesMap>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToPlaceOverrides(
      (data) => {
        setOverrides(data);
        setLoading(false);
      },
      () => setLoading(false) // ถ้าเชื่อม Firestore ไม่ได้ ใช้ข้อมูล local แทน ไม่ค้างจอโหลด
    );
    return unsubscribe;
  }, []);

  const places: Place[] = PLACES.map((base) => {
    const o = overrides[base.id];
    if (!o) return base;

    return {
      ...base,
      name: o.name || base.name,
      nameEn: o.nameEn || base.nameEn,
      description: o.description || base.description,
      highlight: o.highlight || base.highlight,
      tips: o.tips && o.tips.length > 0 ? o.tips : base.tips,
      openHours: o.openHours || base.openHours,
      phone: o.phone || base.phone,
      // ถ้ามี imageUrl จาก Firestore ให้ใช้แทนรูป local ที่ผูกไว้ตอน build
      image: o.imageUrl ? { uri: o.imageUrl } : base.image,
    };
  });

  return { places, loading };
}
