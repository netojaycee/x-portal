import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface PDFGenerationOptions {
    filename?: string;
    quality?: number;
    scale?: number;
    useCORS?: boolean;
}

/**
 * Generates a PDF from HTML elements with each element on a separate page
 * @param elements Array of HTML elements to convert to PDF
 * @param options PDF generation options
 */
export const generatePDF = async (
    elements: HTMLElement[],
    options: PDFGenerationOptions = {}
): Promise<void> => {
    const {
        filename = 'report-cards.pdf',
        quality = 1.0,
        scale = 2,
        useCORS = true,
    } = options;

    if (elements.length === 0) {
        throw new Error('No elements provided for PDF generation');
    }

    // A4 dimensions in mm
    const a4Width = 210;
    const a4Height = 297;

    // Create new PDF document
    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
    });

    // Remove the default first page
    pdf.deletePage(1);

    for (let i = 0; i < elements.length; i++) {
        const element = elements[i];

        try {
            // Ensure element is visible and has content
            if (!element || element.offsetWidth === 0 || element.offsetHeight === 0) {
                throw new Error(`Element ${i} is not visible or has no content`);
            }

            console.log(`Processing element ${i + 1}...`);

            // Create canvas from HTML element with improved settings
            const canvas = await html2canvas(element, {
                scale: scale,
                useCORS: useCORS,
                allowTaint: false,
                backgroundColor: '#ffffff',
                logging: false,
                width: element.scrollWidth || 1200,
                height: element.scrollHeight || 1600,
                windowWidth: 1400,
                windowHeight: 1800,
                ignoreElements: (element) => {
                    // Ignore elements that might cause color parsing issues
                    const htmlElement = element as HTMLElement;
                    return element.classList.contains('no-pdf') ||
                        htmlElement.style.color?.includes('oklch') ||
                        htmlElement.style.backgroundColor?.includes('oklch');
                },
                onclone: (clonedDoc) => {
                    // First, apply color sanitization
                    sanitizeColors(clonedDoc);

                    // Apply styles to cloned document and fix color issues
                    const clonedElements = clonedDoc.querySelectorAll('[data-report-card]');
                    clonedElements.forEach((clonedElement) => {
                        const elem = clonedElement as HTMLElement;
                        elem.style.transform = 'none';
                        elem.style.position = 'relative';
                        elem.style.width = '1200px';
                        elem.style.minHeight = '1600px';
                        elem.style.padding = '60px';
                        elem.style.boxSizing = 'border-box';
                        elem.style.background = 'white';
                        elem.style.backgroundColor = '#ffffff';
                        elem.style.color = '#000000';
                    });

                    // Fix any remaining problematic color functions in the cloned document
                    const allElements = clonedDoc.querySelectorAll('*');
                    allElements.forEach((el) => {
                        const htmlEl = el as HTMLElement;
                        try {
                            const computedStyle = window.getComputedStyle(htmlEl);

                            // Convert oklch and other problematic colors to safe hex values
                            if (computedStyle.color?.includes('oklch') ||
                                computedStyle.color?.includes('color(')) {
                                htmlEl.style.color = '#000000';
                            }

                            if (computedStyle.backgroundColor?.includes('oklch') ||
                                computedStyle.backgroundColor?.includes('color(')) {
                                htmlEl.style.backgroundColor = 'transparent';
                            }

                            if (computedStyle.borderColor?.includes('oklch') ||
                                computedStyle.borderColor?.includes('color(')) {
                                htmlEl.style.borderColor = '#d1d5db';
                            }
                        } catch (error) {
                            // Ignore style computation errors
                            console.warn('Could not compute styles for element:', error);
                        }
                    });
                }
            });

            // Validate canvas was created successfully
            if (!canvas || canvas.width === 0 || canvas.height === 0) {
                throw new Error(`Failed to create canvas for element ${i}`);
            }            // Add new page for each report card
            pdf.addPage();

            // Calculate dimensions to fit A4 properly
            const canvasAspectRatio = canvas.width / canvas.height;
            const a4AspectRatio = a4Width / a4Height;

            let imgWidth = a4Width - 20; // 10mm margin on each side
            let imgHeight = a4Height - 20; // 10mm margin on top and bottom

            // Maintain aspect ratio
            if (canvasAspectRatio > a4AspectRatio) {
                // Canvas is wider, fit to width
                imgHeight = imgWidth / canvasAspectRatio;
            } else {
                // Canvas is taller, fit to height
                imgWidth = imgHeight * canvasAspectRatio;
            }

            // Center the content on the page
            const xOffset = (a4Width - imgWidth) / 2;
            const yOffset = (a4Height - imgHeight) / 2;

            // Convert canvas to image and add to PDF
            const imgData = canvas.toDataURL('image/png', quality);
            pdf.addImage(
                imgData,
                'PNG',
                xOffset,
                yOffset,
                imgWidth,
                imgHeight,
                undefined,
                'FAST'
            );

        } catch (error) {
            console.error(`Error processing element ${i + 1}:`, error);
            console.error('Element details:', {
                tagName: element.tagName,
                className: element.className,
                offsetWidth: element.offsetWidth,
                offsetHeight: element.offsetHeight,
                scrollWidth: element.scrollWidth,
                scrollHeight: element.scrollHeight
            });

            // Add a blank page with error message
            pdf.addPage();
            pdf.setFontSize(16);
            pdf.text(`Error generating page ${i + 1}`, 20, 50);
            pdf.setFontSize(12);
            pdf.text(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`, 20, 70);
        }
    }

    // Save the PDF
    pdf.save(filename);
};

/**
 * Prepares report card elements for PDF generation
 * @param containerSelector CSS selector for the container holding report cards
 */
export const prepareReportCardsForPDF = (containerSelector: string): HTMLElement[] => {
    const container = document.querySelector(containerSelector);
    if (!container) {
        console.error(`Container with selector "${containerSelector}" not found`);
        throw new Error(`Container with selector "${containerSelector}" not found`);
    }

    // Find all report card elements
    const reportCards = container.querySelectorAll('[data-report-card]');
    console.log(`Found ${reportCards.length} report cards in container`);

    if (reportCards.length === 0) {
        console.error('No report cards found with [data-report-card] attribute');
        throw new Error('No report cards found with [data-report-card] attribute');
    }

    const elements = Array.from(reportCards) as HTMLElement[];

    // Validate each element
    elements.forEach((element, index) => {
        console.log(`Report card ${index + 1}:`, {
            offsetWidth: element.offsetWidth,
            offsetHeight: element.offsetHeight,
            scrollWidth: element.scrollWidth,
            scrollHeight: element.scrollHeight,
            visible: element.offsetParent !== null
        });
    });

    return elements;
};

/**
 * Generates PDF for all report cards
 * @param containerSelector CSS selector for the container holding report cards
 * @param filename Optional filename for the PDF
 */
export const generateReportCardsPDF = async (
    containerSelector: string,
    filename?: string
): Promise<void> => {
    try {
        // Validate browser support
        if (typeof window === 'undefined') {
            throw new Error('PDF generation is only available in browser environment');
        }

        const elements = prepareReportCardsForPDF(containerSelector);

        if (elements.length === 0) {
            throw new Error('No report cards found. Please ensure the page has loaded completely.');
        }

        console.log(`Generating PDF with ${elements.length} report cards...`);

        // Add temporary PDF-optimized styles
        const style = document.createElement('style');
        style.id = 'pdf-generation-styles';
        style.textContent = `
      [data-report-card] {
        width: 1200px !important;
        min-height: 1600px !important;
        padding: 60px !important;
        margin: 0 !important;
        box-sizing: border-box !important;
        background: white !important;
        background-color: #ffffff !important;
        color: #000000 !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif !important;
        transform: scale(1) !important;
        position: relative !important;
        page-break-inside: avoid !important;
        display: block !important;
        overflow: visible !important;
      }
      
      [data-report-card] .max-w-4xl {
        max-width: none !important;
        width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
      }
      
      [data-report-card] .w-full {
        width: 100% !important;
      }
      
      [data-report-card] img {
        max-width: 100% !important;
        height: auto !important;
        display: block !important;
      }
      
      [data-report-card] table {
        page-break-inside: avoid !important;
        width: 100% !important;
        border-collapse: collapse !important;
        font-size: 14px !important;
        color: #000000 !important;
        background-color: #ffffff !important;
        table-layout: auto !important;
      }
      
      [data-report-card] .text-xs {
        font-size: 12px !important;
        color: #000000 !important;
      }
      
      [data-report-card] .text-sm {
        font-size: 14px !important;
        color: #000000 !important;
      }
      
      [data-report-card] .text-2xl {
        font-size: 24px !important;
        color: #000000 !important;
      }
      
      [data-report-card] .text-3xl {
        font-size: 28px !important;
        color: #000000 !important;
      }
      
      [data-report-card] * {
        box-sizing: border-box !important;
        color: inherit !important;
      }
      
      /* Override any problematic color functions */
      [data-report-card] .text-gray-900 {
        color: #111827 !important;
      }
      
      [data-report-card] .text-gray-700 {
        color: #374151 !important;
      }
      
      [data-report-card] .text-gray-600 {
        color: #4b5563 !important;
      }
      
      [data-report-card] .text-gray-500 {
        color: #6b7280 !important;
      }
      
      [data-report-card] .text-gray-400 {
        color: #9ca3af !important;
      }
      
      [data-report-card] .text-black {
        color: #000000 !important;
      }
      
      [data-report-card] .text-white {
        color: #ffffff !important;
      }
      
      [data-report-card] .bg-white {
        background-color: #ffffff !important;
      }
      
      [data-report-card] .bg-gray-50 {
        background-color: #f9fafb !important;
      }
      
      [data-report-card] .bg-gray-100 {
        background-color: #f3f4f6 !important;
      }
      
      [data-report-card] .bg-gray-200 {
        background-color: #e5e7eb !important;
      }
      
      [data-report-card] .bg-blue-100 {
        background-color: #dbeafe !important;
      }
      
      [data-report-card] .border-gray-300 {
        border-color: #d1d5db !important;
      }
      
      [data-report-card] .border-gray-400 {
        border-color: #9ca3af !important;
      }
      
      [data-report-card] .border-gray-500 {
        border-color: #6b7280 !important;
      }
    `;
        document.head.appendChild(style);

        // Wait a moment for styles to apply and images to load
        await new Promise(resolve => setTimeout(resolve, 500));

        // Ensure all images are loaded
        const images = document.querySelectorAll('#report-cards-container img');
        const imagePromises = Array.from(images).map((img) => {
            const image = img as HTMLImageElement;
            if (image.complete) {
                return Promise.resolve();
            }
            return new Promise((resolve) => {
                image.onload = () => resolve(undefined);
                image.onerror = () => resolve(undefined); // Continue even if image fails
                // Timeout after 3 seconds
                setTimeout(() => resolve(undefined), 3000);
            });
        });

        await Promise.all(imagePromises);
        console.log('All images loaded, starting PDF generation...');

        await generatePDF(elements, {
            filename: filename || `report-cards-${new Date().getTime()}.pdf`,
            quality: 0.95,
            scale: 1.0,
        });

        console.log('PDF generated successfully!');

    } catch (error) {
        console.error('Error generating PDF:', error);
        throw new Error(`Failed to generate PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
        // Always remove temporary styles
        const existingStyle = document.getElementById('pdf-generation-styles');
        if (existingStyle) {
            document.head.removeChild(existingStyle);
        }
    }
};

/**
 * Sanitizes CSS colors to prevent html2canvas parsing errors
 * Converts problematic color functions to safe hex values
 */
const sanitizeColors = (doc: Document): void => {
    const style = doc.createElement('style');
    style.textContent = `
        /* Override any CSS custom properties that might use oklch */
        * {
            color: inherit !important;
            background-color: inherit !important;
            border-color: inherit !important;
        }
        
        /* Reset common Tailwind colors to safe hex values */
        .text-gray-900 { color: #111827 !important; }
        .text-gray-800 { color: #1f2937 !important; }
        .text-gray-700 { color: #374151 !important; }
        .text-gray-600 { color: #4b5563 !important; }
        .text-gray-500 { color: #6b7280 !important; }
        .text-gray-400 { color: #9ca3af !important; }
        .text-gray-300 { color: #d1d5db !important; }
        .text-gray-200 { color: #e5e7eb !important; }
        .text-gray-100 { color: #f3f4f6 !important; }
        .text-gray-50 { color: #f9fafb !important; }
        .text-black { color: #000000 !important; }
        .text-white { color: #ffffff !important; }
        
        .bg-gray-50 { background-color: #f9fafb !important; }
        .bg-gray-100 { background-color: #f3f4f6 !important; }
        .bg-gray-200 { background-color: #e5e7eb !important; }
        .bg-blue-100 { background-color: #dbeafe !important; }
        .bg-white { background-color: #ffffff !important; }
        
        .border-gray-300 { border-color: #d1d5db !important; }
        .border-gray-400 { border-color: #9ca3af !important; }
        .border-gray-500 { border-color: #6b7280 !important; }
    `;
    doc.head.appendChild(style);
};

/**
 * Test function to validate PDF generation setup
 * Call this from the browser console to debug issues
 */
export const testPDFGeneration = (): void => {
    console.log('=== PDF Generation Test ===');

    // Check if required libraries are available
    console.log('jsPDF available:', typeof jsPDF !== 'undefined');
    console.log('html2canvas available:', typeof html2canvas !== 'undefined');

    // Check if container exists
    const container = document.querySelector('#report-cards-container');
    console.log('Container found:', !!container);

    if (container) {
        const containerElement = container as HTMLElement;
        console.log('Container details:', {
            children: container.children.length,
            offsetWidth: containerElement.offsetWidth,
            offsetHeight: containerElement.offsetHeight
        });

        // Check report cards
        const reportCards = container.querySelectorAll('[data-report-card]');
        console.log(`Report cards found: ${reportCards.length}`);

        reportCards.forEach((card, index) => {
            const element = card as HTMLElement;
            console.log(`Report card ${index + 1}:`, {
                offsetWidth: element.offsetWidth,
                offsetHeight: element.offsetHeight,
                scrollWidth: element.scrollWidth,
                scrollHeight: element.scrollHeight,
                visible: element.offsetParent !== null,
                hasDataAttribute: element.hasAttribute('data-report-card')
            });
        });
    }

    console.log('=== End Test ===');
};
