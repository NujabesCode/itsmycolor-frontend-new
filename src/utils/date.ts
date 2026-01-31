export const formatDate = (date: string | Date | null | undefined) => {
  if (!date) return '-';
  try {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return '-';
    return dateObj.toISOString().split("T")[0];
  } catch (error) {
    return '-';
  }
};
