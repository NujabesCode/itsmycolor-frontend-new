export const isBase64Image = (base64: string) => {
    return base64.includes('data:image/');
};

export const base64ToFile = (base64: string) => {
    const [, base64Data] = base64.split(',');
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const file = new File([byteArray], 'image.png', { type: 'image/png' });
    (file as any).originalname = 'image.png';
    return file;
};