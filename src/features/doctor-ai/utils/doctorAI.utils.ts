export function composeUserText(userInput: string, desc: string): string {
  const blocks: string[] = [];
  if (desc?.trim()) blocks.push(`[MÔ TẢ CA BỆNH]\n${desc.trim()}`);
  if (userInput?.trim()) blocks.push(`[CÂU HỎI]\n${userInput.trim()}`);
  return blocks.join('\n\n');
}
