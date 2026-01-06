import { db } from "@/lib/firebaseAdmin";
import { evaluateEligibility } from "@/lib/eligibilityEngine";
import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(req) {
  const { project_code } = await req.json();

  const projectSnap = await db
    .collection("projects")
    .where("project_code", "==", project_code)
    .get();

  if (projectSnap.empty) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  const project = projectSnap.docs[0].data();

  const contributorsSnap = await db
    .collection("contributors")
    .where("project_code", "==", project_code)
    .get();

  const contributors = contributorsSnap.docs.map((d) => d.data());

  const result = evaluateEligibility(project, contributors);

  await db.collection("eligibility_status").add({
    project_code,
    ...result,
    rule_version: "core_v1.0",
    evaluated_at: FieldValue.serverTimestamp(),
  });

  return NextResponse.json(result);
}
