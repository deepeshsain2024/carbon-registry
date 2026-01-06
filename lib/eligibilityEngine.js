export function evaluateEligibility(project, contributors) {
  let eligibility_flag = "yes";
  const reasons = [];

  if (!project.commissioning_date) {
    return { eligibility_flag: "no", reasons: ["Missing commissioning date"] };
  }

  if (project.baseline_type === "fossil") {
    return { eligibility_flag: "no", reasons: ["Fossil baseline not allowed"] };
  }

  if (project.ownership === "shared" && project.scale_flag === "standalone") {
    eligibility_flag = "conditional";
    reasons.push("Shared ownership requires basketed scale");
  }

  const totalShare = contributors.reduce(
    (sum, c) => sum + c.share_percentage,
    0
  );

  if (totalShare !== 100) {
    eligibility_flag = "conditional";
    reasons.push("Contributor shares must total 100%");
  }

  return { eligibility_flag, reasons };
}
