'use client'
import { useState, useEffect } from 'react'
import { useToast } from '@/components/ui/Toast'

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const { addToast } = useToast()
  const defaultForm = { title:'',slug:'',category:'Sức khỏe',summary:'',content:'',thumbnail:'',metaTitle:'',metaDescription:'',published:false }
  const [form, setForm] = useState(defaultForm)

  const fetchPosts = async () => { setLoading(true); const r=await fetch('/api/admin/blog'); setPosts(await r.json()); setLoading(false) }
  useEffect(() => { fetchPosts() }, [])

  const genSlug = (n: string) => n.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').replace(/[^a-z0-9\s-]/g,'').replace(/\s+/g,'-').trim()

  const handleSave = async () => {
    const m=editing?'PUT':'POST'; const u=editing?`/api/admin/blog/${editing.id}`:'/api/admin/blog'
    const r=await fetch(u,{method:m,headers:{'Content-Type':'application/json'},body:JSON.stringify(form)})
    if(r.ok){addToast('success','Lưu thành công!');setShowForm(false);fetchPosts()}else addToast('error','Có lỗi')
  }

  const handleDelete = async (id: number) => { if(!confirm('Xoá bài viết?'))return; await fetch(`/api/admin/blog/${id}`,{method:'DELETE'}); addToast('success','Đã xoá'); fetchPosts() }

  const openEdit = (p: any) => { setForm({title:p.title,slug:p.slug,category:p.category,summary:p.summary,content:p.content,thumbnail:p.thumbnail||'',metaTitle:p.metaTitle||'',metaDescription:p.metaDescription||'',published:p.published}); setEditing(p); setShowForm(true) }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => { const f=e.target.files?.[0]; if(!f)return; const fd=new FormData(); fd.append('file',f); const r=await fetch('/api/upload',{method:'POST',body:fd}); const d=await r.json(); if(d.url) setForm(fm=>({...fm,thumbnail:d.url})) }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-h2 font-bold text-gray-800">Blog</h1>
        <button onClick={()=>{setForm(defaultForm);setEditing(null);setShowForm(true)}} className="btn-primary text-sm">+ Thêm bài viết</button>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b bg-gray-50">
            <th className="text-left py-3 px-4 text-muted font-medium">Tiêu đề</th>
            <th className="text-left py-3 px-4 text-muted font-medium">Danh mục</th>
            <th className="text-left py-3 px-4 text-muted font-medium">Trạng thái</th>
            <th className="text-left py-3 px-4 text-muted font-medium">Ngày</th>
            <th className="text-left py-3 px-4 text-muted font-medium">Thao tác</th>
          </tr></thead>
          <tbody>
            {loading?<tr><td colSpan={5} className="py-8 text-center text-muted">Đang tải...</td></tr>:
            posts.map(p=>(
              <tr key={p.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4 font-medium">{p.title}</td>
                <td className="py-3 px-4">{p.category}</td>
                <td className="py-3 px-4"><span className={`badge text-[11px] ${p.published?'bg-green-100 text-green-700':'bg-gray-100 text-gray-600'}`}>{p.published?'Đã đăng':'Nháp'}</span></td>
                <td className="py-3 px-4 text-muted text-xs">{new Date(p.createdAt).toLocaleDateString('vi-VN')}</td>
                <td className="py-3 px-4 flex gap-2">
                  <button onClick={()=>openEdit(p)} className="text-xs text-primary font-medium">Sửa</button>
                  <button onClick={()=>handleDelete(p.id)} className="text-xs text-red-500 font-medium">Xoá</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showForm&&(
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" onClick={()=>setShowForm(false)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6" onClick={e=>e.stopPropagation()}>
            <div className="flex justify-between mb-4"><h3 className="text-lg font-bold">{editing?'Sửa':'Thêm'} bài viết</h3><button onClick={()=>setShowForm(false)}>✕</button></div>
            <div className="space-y-3">
              <div><label className="text-sm font-medium">Tiêu đề *</label><input value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value,slug:genSlug(e.target.value)}))} className="input-field"/></div>
              <div><label className="text-sm font-medium">Slug</label><input value={form.slug} onChange={e=>setForm(f=>({...f,slug:e.target.value}))} className="input-field"/></div>
              <div><label className="text-sm font-medium">Danh mục</label><select value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))} className="input-field"><option>Sức khỏe</option><option>Dinh dưỡng</option><option>Tips</option><option>Sản phẩm</option></select></div>
              <div><label className="text-sm font-medium">Tóm tắt *</label><textarea value={form.summary} onChange={e=>setForm(f=>({...f,summary:e.target.value}))} className="input-field" rows={2}/></div>
              <div><label className="text-sm font-medium">Nội dung (HTML) *</label><textarea value={form.content} onChange={e=>setForm(f=>({...f,content:e.target.value}))} className="input-field font-mono text-xs" rows={10}/></div>
              <div><label className="text-sm font-medium">Ảnh thumbnail</label><input type="file" accept="image/*" onChange={handleUpload} className="text-sm"/>{form.thumbnail&&<img src={form.thumbnail} alt="" className="w-24 h-16 object-cover rounded mt-2"/>}</div>
              <div><label className="text-sm font-medium">Meta Title</label><input value={form.metaTitle} onChange={e=>setForm(f=>({...f,metaTitle:e.target.value}))} className="input-field"/></div>
              <div><label className="text-sm font-medium">Meta Description</label><input value={form.metaDescription} onChange={e=>setForm(f=>({...f,metaDescription:e.target.value}))} className="input-field"/></div>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.published} onChange={e=>setForm(f=>({...f,published:e.target.checked}))}/>Đăng công khai</label>
              <div className="flex justify-end gap-3 pt-2"><button onClick={()=>setShowForm(false)} className="btn-ghost">Huỷ</button><button onClick={handleSave} className="btn-primary">Lưu</button></div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
