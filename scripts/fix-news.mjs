import fs from 'fs';
import path from 'path';

const fullPath = path.join(process.cwd(), 'src/app/admin/news/new/page.tsx');
if (fs.existsSync(fullPath)) {
  let content = fs.readFileSync(fullPath, 'utf8');
  
  // 1. Replace ContentLinksEditor with RichTextEditor
  content = content.replace('import ContentLinksEditor from "@/components/admin/ContentLinksEditor";', 'import RichTextEditor from "@/components/admin/RichTextEditor";');
  content = content.replace('<ContentLinksEditor name="content" label="Nội dung" rows={12} />', '<RichTextEditor name="content" label="Nội dung" />');

  // 2. Widen container
  content = content.replace('max-w-2xl', 'max-w-7xl');

  // 3. Add toast if missing
  if (!content.includes('import toast from "react-hot-toast"')) {
    content = content.replace(/"use client";\r?\n/, '"use client";\n\nimport toast from "react-hot-toast";\n');
  }
  if (!content.includes('toast.success("Đã lưu thành công!");')) {
    content = content.replace(/( *)router\.push\("\/admin\/news/g, '$1toast.success("Đã lưu thành công!");\n$1router.push("/admin/news');
  }

  fs.writeFileSync(fullPath, content, 'utf8');
  console.log('Updated new/page.tsx');
}
