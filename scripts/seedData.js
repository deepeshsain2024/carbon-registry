import { FieldValue } from "firebase-admin/firestore";
import { db } from "../lib/firebaseAdmin.js";

async function seed() {
  // Cleanup
  const collections = [
    "projects",
    "contributors",
    "actions",
    "impact_logs",
    "eligibility_status",
  ];

  for (const col of collections) {
    const snap = await db.collection(col).get();
    snap.forEach((doc) => doc.ref.delete());
  }

  const testCases = [
    {
      code: "CR-IND-001",
      baseline: "grid",
      ownership: "single_owner",
      commission: "2024-03-15",
      scale: "standalone",
      share: 100,
      impact: 12.5,
    },
    {
      code: "CR-IND-002",
      baseline: "fossil",
      ownership: "single_owner",
      commission: "2024-01-10",
      scale: "standalone",
      share: 100,
      impact: null,
    },
    {
      code: "CR-IND-003",
      baseline: "grid",
      ownership: "shared",
      commission: "2024-02-01",
      scale: "standalone",
      share: 100,
      impact: 9.2,
    },
    {
      code: "CR-IND-004",
      baseline: "grid",
      ownership: "single_owner",
      commission: null,
      scale: "standalone",
      share: 100,
      impact: null,
    },
    {
      code: "CR-IND-005",
      baseline: "grid",
      ownership: "single_owner",
      commission: "2024-03-01",
      scale: "standalone",
      share: 60,
      impact: 7.1,
    },
  ];

  for (const t of testCases) {
    // Project
    const projectRef = await db.collection("projects").add({
      project_code: t.code,
      sector: "renewable_energy",
      ownership: t.ownership,
      baseline_type: t.baseline,
      commissioning_date: t.commission,
      scale_flag: t.scale,
      status: "draft",
      created_at: FieldValue.serverTimestamp(),
    });

    // Contributor
    await db.collection("contributors").add({
      project_id: projectRef.id,
      entity_role: "project_owner",
      share_percentage: t.share,
    });

    // Action
    const actionRef = await db.collection("actions").add({
      project_id: projectRef.id,
      action_category: "solar_pv",
      technology: "rooftop_pv",
      capacity_value: 100,
      capacity_unit: "kW",
      start_date: "2024-04-01",
    });

    // Impact log (only where appropriate)
    if (t.impact !== null) {
      await db.collection("impact_logs").add({
        project_id: projectRef.id,
        action_id: actionRef.id,
        metric: "tCO2e_reduced",
        value: t.impact,
        calculation_standard: "rule_based_v1",
        created_at: FieldValue.serverTimestamp(),
      });
    }
  }

  console.log("Data seeded successfully");
}

seed().then(() => process.exit());
