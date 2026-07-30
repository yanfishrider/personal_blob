export function renderMarkdown(text: string): string {
  let html = text
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre style="background:#111;color:#d4d4d4;padding:10px;border-radius:6px;font-size:12px;overflow-x:auto;margin:8px 0;">$2</pre>')
    .replace(/`([^`]+)`/g, '<code style="background:#333;color:#ff7b42;padding:1px 5px;border-radius:3px;font-size:13px;">$1</code>')
    .replace(/\*\*(.+?)\*\*/g, '<strong style="color:#fff;">$1</strong>')
    .replace(/^### (.+)$/gm, '<h4 style="color:#ff7b42;font-size:14px;margin:12px 0 6px;">$1</h4>')
    .replace(/^## (.+)$/gm, '<h3 style="color:#ff7b42;font-size:15px;margin:14px 0 8px;">$1</h3>')
    .replace(/^- (.+)$/gm, '<li style="margin:2px 0 2px 12px;color:#bbb;">$1</li>')
    .replace(/^\|(.+)\|$/gm, (match) => {
      if (match.includes('---')) return '';
      const cells = match.split('|').filter(c => c.trim());
      const row = cells.map(c => `<td style="padding:4px 10px;border:1px solid #333;font-size:12px;color:#bbb;">${c.trim()}</td>`).join('');
      return `<tr>${row}</tr>`;
    })
    .replace(/\n/g, '<br>');

  html = html.replace(/(<tr>[\s\S]*?<\/tr>)+/g, '<table style="border-collapse:collapse;margin:8px 0;width:100%;"><tbody>$&</tbody></table>');
  html = html.replace(/(<li>[\s\S]*?<\/li>)+/g, '<ul style="list-style:disc;margin:4px 0;padding-left:8px;">$&</ul>');
  return html;
}
