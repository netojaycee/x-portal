const LZString = require("lz-string");

// Test data with realistic school names
const testContext = {
  subjectId: "subj_672f4d2b8e1f234567890123",
  subjectName: "Advanced Mathematics and Statistics",
  sessionId: "sess_672f4d2b8e1f234567890124",
  sessionName: "2024/2025 Academic Session",
  classArmId: "arm_672f4d2b8e1f234567890125",
  classArmName: "Diamond Class Arm",
  classId: "cls_672f4d2b8e1f234567890126",
  className: "Senior Secondary School 3",
  termId: "term_672f4d2b8e1f234567890127",
  termName: "First Term",
};

// Test different encoding approaches
console.log("=== ENCODING COMPARISON TEST ===\n");

// 1. JSON + Base64 (original approach)
const jsonString = JSON.stringify(testContext);
const base64Encoded = Buffer.from(jsonString).toString("base64");
console.log("1. JSON + Base64:");
console.log(`   Length: ${base64Encoded.length} characters`);
console.log(`   URL: ?context=${encodeURIComponent(base64Encoded)}`);
console.log(
  `   Total URL length: ${
    50 + encodeURIComponent(base64Encoded).length
  } characters\n`
);

// 2. LZ-String compression
const lzCompressed = LZString.compressToEncodedURIComponent(jsonString);
console.log("2. LZ-String Compression:");
console.log(`   Length: ${lzCompressed.length} characters`);
console.log(`   URL: ?context=${lzCompressed}`);
console.log(`   Total URL length: ${50 + lzCompressed.length} characters\n`);

// 3. Test decompression
const decompressed = LZString.decompressFromEncodedURIComponent(lzCompressed);
const parsedContext = JSON.parse(decompressed);

console.log("3. Decompression Test:");
console.log("   Original subject name:", testContext.subjectName);
console.log("   Decompressed subject name:", parsedContext.subjectName);
console.log("   Match:", testContext.subjectName === parsedContext.subjectName);
console.log(
  "   Full object match:",
  JSON.stringify(testContext) === JSON.stringify(parsedContext)
);

// 4. Compression ratio
const compressionRatio = (
  ((base64Encoded.length - lzCompressed.length) / base64Encoded.length) *
  100
).toFixed(1);
console.log(`\n4. Compression Results:`);
console.log(`   Size reduction: ${compressionRatio}% smaller than Base64`);
console.log(
  `   Space saved: ${base64Encoded.length - lzCompressed.length} characters`
);

// 5. Test with longer names (worst case scenario)
const worstCaseContext = {
  subjectId: "subj_672f4d2b8e1f234567890123456789012345",
  subjectName:
    "Advanced Mathematics, Statistics, and Applied Numerical Analysis with Computer Programming",
  sessionId: "sess_672f4d2b8e1f234567890124456789012345",
  sessionName:
    "2024/2025 Full Academic Session for Science and Technology Students",
  classArmId: "arm_672f4d2b8e1f234567890125456789012345",
  classArmName: "Diamond Premium Advanced Class Arm for Exceptional Students",
  classId: "cls_672f4d2b8e1f234567890126456789012345",
  className:
    "Senior Secondary School Class 3 Advanced Science and Technology Track",
  termId: "term_672f4d2b8e1f234567890127456789012345",
  termName: "First Term of the Academic Session",
};

const worstCaseJson = JSON.stringify(worstCaseContext);
const worstCaseBase64 = Buffer.from(worstCaseJson).toString("base64");
const worstCaseLZ = LZString.compressToEncodedURIComponent(worstCaseJson);

console.log(`\n5. Worst Case Scenario (Very Long Names):`);
console.log(`   Base64 length: ${worstCaseBase64.length} characters`);
console.log(`   LZ-String length: ${worstCaseLZ.length} characters`);
console.log(
  `   Size reduction: ${(
    ((worstCaseBase64.length - worstCaseLZ.length) / worstCaseBase64.length) *
    100
  ).toFixed(1)}%`
);
