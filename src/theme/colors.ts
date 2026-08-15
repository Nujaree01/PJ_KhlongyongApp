import { LandmarkCategory } from "../types";

export const COLORS = {
  routeRed: "#2FBB15",
  routeRedDark: "#1F8A0D",
  background: "#FFFFFF",
  surface: "#F7F5F0",
  textPrimary: "#2C2C2A",
  textSecondary: "#5F5E5A",
  border: "#E5E3DC",
};

export const CATEGORY_COLORS: Record<
  LandmarkCategory,
  { fill: string; text: string; icon: string }
> = {
  start: { fill: "#F7C1C1", text: "#791F1F", icon: "flag" },
  end: { fill: "#F7C1C1", text: "#791F1F", icon: "flag-checkered" },
  market: { fill: "#85B7EB", text: "#0C447C", icon: "sail-boat" },
  nature: { fill: "#97C459", text: "#27500A", icon: "leaf" },
  learning: { fill: "#FAC775", text: "#633806", icon: "school" },
  temple: { fill: "#F0997B", text: "#4A1B0C", icon: "church" },
  farm: { fill: "#5DCAA5", text: "#085041", icon: "flower" },
  university: { fill: "#AFA9EC", text: "#26215C", icon: "bank" },
  rest: { fill: "#B4B2A9", text: "#2C2C2A", icon: "coffee" },
};

export const CATEGORY_LABELS: Record<LandmarkCategory, string> = {
  start: "จุดเริ่มต้น",
  end: "จุดหมายปลายทาง",
  market: "ตลาดน้ำ",
  nature: "พื้นที่ธรรมชาติ",
  learning: "แหล่งเรียนรู้",
  temple: "วัด/ศาสนสถาน",
  farm: "สวนเกษตร",
  university: "สถาบันการศึกษา",
  rest: "จุดพักผ่อน",
};
