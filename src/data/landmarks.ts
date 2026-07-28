import { Landmark } from "../types";

/**
 * พิกัดที่ทำเครื่องหมาย isCoordinateApproximate: true ยังเป็นค่าประมาณ
 * ควรเปิด Google Maps เทียบตำแหน่งจริงแล้วแก้ไขให้แม่นยำก่อนใช้งานจริง
 * (พิกัดของ อุทยานพุทธมณฑล และ ตลาดน้ำดอนหวาย อ้างอิงจากตำแหน่งสาธารณะที่รู้จักทั่วไป)
 */
export const LANDMARKS: Landmark[] = [
  {
    id: "start-phutthamonthon",
    order: 1,
    name: "อุทยานพุทธมณฑล",
    nameEn: "Phutthamonthon Park",
    category: "start",
    description:
      "จุดเริ่มต้นเส้นทาง ถนนอุทยาน (Utthayan Road) พื้นที่ประวัติศาสตร์และศาสนสถานสำคัญของจังหวัดนครปฐม เป็นจุดตั้งต้นก่อนมุ่งหน้าสู่พื้นที่ชุมชนคลองโยง",
    coordinate: { latitude: 13.7975, longitude: 100.3323 },
    distanceFromStartKm: 0,
  },
  {
    id: "don-wai-market",
    order: 2,
    name: "ตลาดน้ำดอนหวาย",
    nameEn: "Don Wai Floating Market",
    category: "market",
    description:
      "ตลาดริมน้ำเก่าแก่ มีสินค้าเกษตรและของกินพื้นถิ่น เป็นจุดแวะพักและเรียนรู้วิถีชุมชนริมคลอง",
    coordinate: { latitude: 13.821, longitude: 100.319 },
    isCoordinateApproximate: true,
    distanceFromStartKm: 4,
  },
  {
    id: "khok-nong-na",
    order: 3,
    name: "ศูนย์เรียนรู้โคกหนองนา โมเดล",
    nameEn: "Khok Nong Na Learning Center",
    category: "learning",
    description:
      "ศูนย์เรียนรู้เกษตรทฤษฎีใหม่ตามแนวพระราชดำริ สาธิตการจัดการพื้นที่แบบโคก หนอง นา เพื่อความยั่งยืน",
    coordinate: { latitude: 13.845, longitude: 100.295 },
    isCoordinateApproximate: true,
    distanceFromStartKm: 10,
  },
  {
    id: "air-orchids-farm",
    order: 4,
    name: "สวนกล้วยไม้แอร์ออร์คิดส์",
    nameEn: "Air Orchids Farm",
    category: "farm",
    description:
      "ฟาร์มกล้วยไม้ตัดดอกและกล้วยไม้กระถาง เปิดให้เข้าชมและเลือกซื้อผลผลิตจากเกษตรกรในพื้นที่คลองโยง",
    coordinate: { latitude: 13.865, longitude: 100.27 },
    isCoordinateApproximate: true,
    distanceFromStartKm: 14,
  },
  {
    id: "wat-makluea",
    order: 5,
    name: "วัดมะเกลือ",
    nameEn: "Wat Makluea",
    category: "temple",
    description:
      "วัดเก่าแก่ประจำชุมชน เป็นศูนย์รวมจิตใจและจุดพักผ่อนระหว่างเส้นทาง เหมาะสำหรับสักการะและพักระหว่างทาง",
    coordinate: { latitude: 13.885, longitude: 100.245 },
    isCoordinateApproximate: true,
    distanceFromStartKm: 18,
  },
  {
    id: "lemon-mee-farm",
    order: 6,
    name: "เลมอนมีฟาร์ม",
    nameEn: "Lemon Mee Farm",
    category: "farm",
    description:
      "ฟาร์มมะนาวและผลไม้ตามฤดูกาล เปิดให้เยี่ยมชมสวนและเลือกซื้อผลผลิตสดจากต้นโดยตรง",
    coordinate: { latitude: 13.905, longitude: 100.215 },
    isCoordinateApproximate: true,
    distanceFromStartKm: 22,
  },
  {
    id: "ssru-nakhon-pathom",
    order: 7,
    name: "มหาวิทยาลัยราชภัฏสวนสุนันทา วิทยาเขตนครปฐม",
    nameEn: "SSRU Nakhon Pathom Campus",
    category: "university",
    description:
      "วิทยาเขตของมหาวิทยาลัยราชภัฏสวนสุนันทา พื้นที่การศึกษาและกิจกรรมของชุมชนใกล้เคียง",
    coordinate: { latitude: 13.915, longitude: 100.185 },
    isCoordinateApproximate: true,
    distanceFromStartKm: 26,
  },
  {
    id: "end-lam-phaya-market",
    order: 8,
    name: "ตลาดน้ำวัดลำพญา",
    nameEn: "Wat Lam Phaya Floating Market",
    category: "end",
    description:
      "จุดหมายปลายทางของเส้นทาง ตลาดน้ำริมคลองที่ยังคงวิถีชีวิตริมน้ำแบบดั้งเดิม มีอาหารและของกินท้องถิ่นให้เลือกซื้อ",
    coordinate: { latitude: 13.935, longitude: 100.155 },
    isCoordinateApproximate: true,
    distanceFromStartKm: 29,
  },
];

export const TOTAL_ROUTE_DISTANCE_KM = 29;

export const START_LANDMARK = LANDMARKS[0];
export const END_LANDMARK = LANDMARKS[LANDMARKS.length - 1];
export const WAYPOINT_LANDMARKS = LANDMARKS.slice(1, LANDMARKS.length - 1);
