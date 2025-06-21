// Utility function for converting and resizing images to base64
export interface ImageProcessingOptions {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    outputFormat?: 'jpeg' | 'png' | 'webp';
}

export const convertImageToBase64 = (
    file: File,
    options: ImageProcessingOptions = {}
): Promise<string> => {
    return new Promise((resolve, reject) => {
        const {
            maxWidth = 800,
            maxHeight = 600,
            quality = 0.8,
            outputFormat = 'jpeg'
        } = options;

        // Create an image element to use for resizing
        const img = document.createElement('img');

        img.onload = () => {
            // Create a canvas to resize the image
            const canvas = document.createElement("canvas");

            let width = img.width;
            let height = img.height;

            // Calculate new dimensions while maintaining aspect ratio
            if (width > height) {
                if (width > maxWidth) {
                    height *= maxWidth / width;
                    width = maxWidth;
                }
            } else {
                if (height > maxHeight) {
                    width *= maxHeight / height;
                    height = maxHeight;
                }
            }

            canvas.width = width;
            canvas.height = height;

            // Draw resized image to canvas
            const ctx = canvas.getContext("2d");
            if (!ctx) {
                reject(new Error("Could not get canvas context"));
                return;
            }

            ctx.drawImage(img, 0, 0, width, height);

            // Get compressed base64 string
            const mimeType = `image/${outputFormat}`;
            const base64String = canvas.toDataURL(mimeType, quality);

            resolve(base64String);
        };

        img.onerror = () => {
            reject(new Error("Failed to load image"));
        };

        // Load the image
        img.src = URL.createObjectURL(file);
    });
};

// Hook for easier usage in React components
export const useImageConverter = () => {
    const convertImage = async (
        file: File,
        options?: ImageProcessingOptions
    ): Promise<string> => {
        try {
            return await convertImageToBase64(file, options);
        } catch (error) {
            console.error("Image conversion failed:", error);
            throw error;
        }
    };

    return { convertImage };
};
