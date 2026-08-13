import fs from 'fs';
import path from 'path';

const files = [
  'src/app/admin/news/new/page.tsx',
  'src/app/admin/news/[id]/page.tsx'
];

for (const file of files) {
  const fullPath = path.join(process.cwd(), file);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // 1. Change max-w-4xl to max-w-7xl
    content = content.replace('max-w-4xl', 'max-w-7xl');

    // 2. Replace textarea excerpt with RichTextEditor
    content = content.replace(
      /<Field label="Mô tả ngắn">\s*<textarea name="excerpt"[^>]*>\s*<\/Field>/g,
      '<RichTextEditor\n          name="excerpt"\n          label="Mô tả ngắn"\n        />'
    );
    // For the [id] page which has defaultValue:
    content = content.replace(
      /<Field label="Mô tả ngắn">\s*<textarea name="excerpt" defaultValue={item.excerpt}[^>]*>\s*<\/Field>/g,
      '<RichTextEditor\n          name="excerpt"\n          label="Mô tả ngắn"\n          defaultValue={item.excerpt}\n        />'
    );

    // 3. Add toast.success before router.push("/admin/news")
    if (!content.includes('toast.success("Đã lưu thành công!");')) {
      content = content.replace(/( *)router\.push\("\/admin\/news/g, '$1toast.success("Đã lưu thành công!");\n$1router.push("/admin/news');
    }

    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`Updated ${file}`);
  }
}
