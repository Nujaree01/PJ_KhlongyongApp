const admin = require("firebase-admin");
const fs = require("fs");

const serviceAccount = require("./service-account.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function exportData() {
  console.log("เริ่มการส่งออกข้อมูล...");

  const collections = ["places", "visitStats"];

  for (const colName of collections) {
    console.log(`กำลังดึงข้อมูลจาก collection: ${colName}...`);
    const snapshot = await db.collection(colName).get();
    const data = {};

    snapshot.forEach((doc) => {
      data[doc.id] = doc.data();
    });

    fs.writeFileSync(`${colName}_backup.json`, JSON.stringify(data, null, 2));
    console.log(`ส่งออกข้อมูล ${colName} สำเร็จแล้ว!`);
  }
}

exportData().catch((err) => {
  console.error("เกิดข้อผิดพลาด:", err);
});
