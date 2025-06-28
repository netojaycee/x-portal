import LZString from 'lz-string';

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
    termName: "First Term"
};

// Test different encoding approaches
console.log('=== ENCODING COMPARISON TEST ===\n');

// 1. JSON + Base64 (original approach)
const jsonString = JSON.stringify(testContext);
const base64Encoded = btoa(jsonString);
console.log('1. JSON + Base64:');
console.log(`   Length: ${base64Encoded.length} characters`);
console.log(`   URL: ?context=${encodeURIComponent(base64Encoded)}`);
console.log(`   Total URL length: ${50 + encodeURIComponent(base64Encoded).length} characters\n`);

// 2. LZ-String compression
const lzCompressed = LZString.compressToEncodedURIComponent(jsonString);
console.log('2. LZ-String Compression:');
console.log(`   Length: ${lzCompressed.length} characters`);
console.log(`   URL: ?context=${lzCompressed}`);
console.log(`   Total URL length: ${50 + lzCompressed.length} characters\n`);

// 3. Test decompression
const decompressed = LZString.decompressFromEncodedURIComponent(lzCompressed);
const parsedContext = JSON.parse(decompressed);

console.log('3. Decompression Test:');
console.log('   Original subject name:', testContext.subjectName);
console.log('   Decompressed subject name:', parsedContext.subjectName);
console.log('   Match:', testContext.subjectName === parsedContext.subjectName);
console.log('   Full object match:', JSON.stringify(testContext) === JSON.stringify(parsedContext));

// 4. Compression ratio
const compressionRatio = ((base64Encoded.length - lzCompressed.length) / base64Encoded.length * 100).toFixed(1);
console.log(`\n4. Compression Results:`);
console.log(`   Size reduction: ${compressionRatio}% smaller than Base64`);
console.log(`   Space saved: ${base64Encoded.length - lzCompressed.length} characters`);

export { };
