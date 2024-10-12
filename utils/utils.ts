
export const copyToClipboard = async (dataUrl: string) => {
    try {
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      
      let pngBlob = blob;
      if (blob.type !== 'image/png') {
        const img = new Image();
        img.src = URL.createObjectURL(blob);
  
        // Create a promise that resolves when the image is loaded
        await new Promise((resolve) => {
          // @ts-ignore
          img.onload = () => resolve();
        });
  
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
  
          // Convert the canvas to a PNG blob
          pngBlob = await new Promise((resolve) => {
            canvas.toBlob((blob) => {
              // @ts-ignore
              resolve(blob);
            }, 'image/png');
          });
  
          if (!pngBlob) {
            throw new Error("Failed to convert image to PNG format.");
          }
        }
      }
  
      // Create a ClipboardItem and write it to the clipboard
      const clipboardItem = new ClipboardItem({ [pngBlob.type]: pngBlob });
      await navigator.clipboard.write([clipboardItem]);
  
      console.log("Image copied to clipboard");
    } catch (err) {
      console.error("Failed to copy image: ", err);
    }
  };