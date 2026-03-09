import fs from 'fs'
import path from 'path'
import { format, parseISO } from 'date-fns'
import { OUT_DIR } from './config.ts'

export function escHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

export function formatDate(dateStr: string): string {
  try {
    return format(parseISO(dateStr), 'MMMM d, yyyy')
  } catch {
    return dateStr
  }
}

export function write(relPath: string, content: string): void {
  const fullPath = path.join(OUT_DIR, relPath)
  fs.mkdirSync(path.dirname(fullPath), { recursive: true })
  fs.writeFileSync(fullPath, content, 'utf8')
}

export function copyDir(src: string, dest: string): void {
  if (!fs.existsSync(src)) return
  fs.mkdirSync(dest, { recursive: true })
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath)
    } else {
      fs.copyFileSync(srcPath, destPath)
    }
  }
}
