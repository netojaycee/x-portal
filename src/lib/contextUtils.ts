import LZString from 'lz-string';

export interface ScoreContext {
    subjectId: string;
    subjectName: string;
    sessionId: string;
    sessionName: string;
    classArmId: string;
    classArmName: string;
    classId: string;
    className: string;
    termId: string;
    termName: string;
}

export interface ClassScoreContext {
    sessionId: string;
    sessionName: string;
    classArmId: string;
    classArmName: string;
    classId: string;
    className: string;
    termId: string;
    termName: string;
}

/**
 * Encode context data using LZ-String compression for maximum compactness
 * This handles arbitrary user-generated strings reliably while keeping URLs short
 */
export function encodeScoreContext(context: ScoreContext): string {
    try {
        // Convert to JSON and compress with LZ-String for maximum compactness
        const json = JSON.stringify(context);
        const compressed = LZString.compressToEncodedURIComponent(json);
        return compressed;
    } catch (error) {
        console.error('Error encoding score context:', error);
        // Fallback to individual parameters
        return '';
    }
}

/**
 * Encode class score context data using LZ-String compression
 */
export function encodeClassScoreContext(context: ClassScoreContext): string {
    try {
        // Convert to JSON and compress with LZ-String for maximum compactness
        const json = JSON.stringify(context);
        const compressed = LZString.compressToEncodedURIComponent(json);
        return compressed;
    } catch (error) {
        console.error('Error encoding class score context:', error);
        // Fallback to individual parameters
        return '';
    }
}

/**
 * Decode context data from LZ-String compressed format
 * Provides robust handling of arbitrary string values
 */
export function decodeScoreContext(encoded: string): ScoreContext | ClassScoreContext | null {
    try {
        // Decompress with LZ-String and parse JSON
        const decompressed = LZString.decompressFromEncodedURIComponent(encoded);
        if (!decompressed) {
            console.error('Failed to decompress context data');
            return null;
        }

        const context = JSON.parse(decompressed);

        // Check if it's a subject-specific context (has subjectId and subjectName)
        if (context.subjectId && context.subjectName) {
            // Validate all required fields for subject context are present
            if (!context.sessionId || !context.sessionName ||
                !context.classArmId || !context.classArmName || !context.classId || !context.className ||
                !context.termId || !context.termName) {
                console.error('Missing required fields in subject context:', context);
                return null;
            }
            return context as ScoreContext;
        } else {
            // Assume it's a class context (no subject-specific fields)
            if (!context.sessionId || !context.sessionName ||
                !context.classArmId || !context.classArmName || !context.classId || !context.className ||
                !context.termId || !context.termName) {
                console.error('Missing required fields in class context:', context);
                return null;
            }
            return context as ClassScoreContext;
        }
    } catch (error) {
        console.error('Error decoding score context:', error);
        return null;
    }
}

/**
 * Generate display text for the subject card based on context
 */
export function generateSubjectCardTexts(context: ScoreContext | ClassScoreContext) {
    const topText = `${context.className}, ${context.classArmName}`;

    // Check if it's a subject-specific context
    const isSubjectContext = 'subjectId' in context && 'subjectName' in context;
    const subject = isSubjectContext ? context.subjectName : "Class Scores";
    const subText = `${context.termName}, ${context.sessionName} / ${isSubjectContext ? 'Subject scores input' : 'Score entry for all subjects'}`;

    return {
        topText,
        subject,
        subText
    };
}
