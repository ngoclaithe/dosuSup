'use client'
import { useState, useEffect } from 'react'
import { formatPrice } from '@/lib/utils'
import { useToast } from '@/components/ui/Toast'

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const { addToast } = useToast()
  const defaultForm = { name:'',slug:'',categoryId:0,description:'',ingredients:'',usage:'',benefits:'',warning:'',price:0,salePrice:null as number|null,stock:0,unit:'hộp',brand:'',images:[] as string[],isFeatured:false,isNew:false,isBestSeller:false }
  const [form, setForm] = useState(defaultForm)

  const fetchProducts = async () => { setLoading(true); const r = await fetch('/api/admin/products'); setProducts(await r.json()); setLoading(false) }
  useEffect(() => { fetchProducts() }, [])

  const genSlug = (n: string) => n.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').replace(/[^a-z0-9\s-]/g,'').replace(/\s+/g,'-').trim()

  const handleSave = async () => {
    const m = editing ? 'PUT' : 'POST'
    const u = editing ? `/api/admin/products/${editing.id}` : '/api/admin/products'
    const r = await fetch(u, { method: m, headers:{'Content-Type':'application/json'}, body: JSON.stringify({...form, categoryId:Number(form.categoryId), price:Number(form.price), salePrice:form.salePrice?Number(form.salePrice):null, stock:Number(form.stock)}) })
    if(r.ok) { addToast('success','Lưu thành công!'); setShowForm(false); fetchProducts() } else addToast('error','Có lỗi')
  }

  const handleDelete = async (id: number) => { if(!confirm('Ẩn sản phẩm?')) return; await fetch(`/api/admin/products/${id}`,{method:'DELETE'}); addToast('success','Đã ẩn'); fetchProducts() }

  const openEdit = (p: any) => { setForm({name:p.name,slug:p.slug,categoryId:p.categoryId,description:p.description||'',ingredients:p.ingredients||'',usage:p.usage||'',benefits:p.benefits||'',warning:p.warning||'',price:p.price,salePrice:p.salePrice,stock:p.stock,unit:p.unit,brand:p.brand||'',images:p.images||[],isFeatured:p.isFeatured,isNew:p.isNew,isBestSeller:p.isBestSeller}); setEditing(p); setShowForm(true) }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => { const f=e.target.files?.[0]; if(!f)return; const fd=new FormData(); fd.append('file',f); const r=await fetch('/api/upload',{method:'POST',body:fd}); const d=await r.json(); if(d.url) setForm(fm=>({...fm,images:[...fm.images,d.url]})) }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-h2 font-bold text-gray-800">Sản phẩm</h1>
        <button onClick={()=>{setForm(defaultForm);setEditing(null);setShowForm(true)}} className="btn-primary text-sm">+ Thêm</button>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b bg-gray-50">
            <th className="text-left py-3 px-4 text-muted font-medium">Tên</th>
            <th className="text-left py-3 px-4 text-muted font-medium">Giá</th>
            <th className="text-left py-3 px-4 text-muted font-medium">Kho</th>
            <th className="text-left py-3 px-4 text-muted font-medium">Thao tác</th>
          </tr></thead>
          <tbody>
            {loading?<tr><td colSpan={4} className="py-8 text-center text-muted">Đang tải...</td></tr>:
            products.map(p=>(
              <tr key={p.id} className={`border-b hover:bg-gray-50 ${p.isDeleted?'opacity-50':''}`}>
                <td className="py-3 px-4 font-medium">{p.name}{p.isDeleted&&<span className="ml-2 text-xs text-red-500">(Đã ẩn)</span>}</td>
                <td className="py-3 px-4">{formatPrice(p.salePrice||p.price)}</td>
                <td className="py-3 px-4"><span className={p.stock<=5?'text-warning font-medium':''}>{p.stock}</span></td>
                <td className="py-3 px-4 flex gap-2">
                  <button onClick={()=>openEdit(p)} className="text-xs text-primary font-medium">Sửa</button>
                  {!p.isDeleted&&<button onClick={()=>handleDelete(p.id)} className="text-xs text-red-500 font-medium">Ẩn</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showForm&&(
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" onClick={()=>setShowForm(false)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6" onClick={e=>e.stopPropagation()}>
            <div className="flex justify-between mb-4"><h3 className="text-lg font-bold">{editing?'Sửa':'Thêm'} sản phẩm</h3><button onClick={()=>setShowForm(false)}>✕</button></div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-sm font-medium">Tên *</label><input value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value,slug:genSlug(e.target.value)}))} className="input-field"/></div>
                <div><label className="text-sm font-medium">Slug</label><input value={form.slug} onChange={e=>setForm(f=>({...f,slug:e.target.value}))} className="input-field"/></div>
                <div><label className="text-sm font-medium">Giá *</label><input type="number" value={form.price} onChange={e=>setForm(f=>({...f,price:+e.target.value}))} className="input-field"/></div>
                <div><label className="text-sm font-medium">Giá sale</label><input type="number" value={form.salePrice||''} onChange={e=>setForm(f=>({...f,salePrice:e.target.value?+e.target.value:null}))} className="input-field"/></div>
                <div><label className="text-sm font-medium">Tồn kho *</label><input type="number" value={form.stock} onChange={e=>setForm(f=>({...f,stock:+e.target.value}))} className="input-field"/></div>
                <div><label className="text-sm font-medium">Đơn vị</label><select value={form.unit} onChange={e=>setForm(f=>({...f,unit:e.target.value}))} className="input-field"><option>hộp</option><option>gói</option><option>lọ</option><option>chai</option></select></div>
                <div><label className="text-sm font-medium">Thương hiệu</label><input value={form.brand} onChange={e=>setForm(f=>({...f,brand:e.target.value}))} className="input-field"/></div>
                <div><label className="text-sm font-medium">Category ID</label><input type="number" value={form.categoryId} onChange={e=>setForm(f=>({...f,categoryId:+e.target.value}))} className="input-field"/></div>
              </div>
              <div><label className="text-sm font-medium">Mô tả</label><textarea value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} className="input-field" rows={3}/></div>
              <div><label className="text-sm font-medium">Thành phần</label><textarea value={form.ingredients} onChange={e=>setForm(f=>({...f,ingredients:e.target.value}))} className="input-field" rows={2}/></div>
              <div><label className="text-sm font-medium">Ảnh</label><input type="file" accept="image/*" onChange={handleUpload} className="text-sm"/><div className="flex gap-2 mt-2">{form.images.map((img,i)=><div key={i} className="relative w-14 h-14 rounded border"><img src={img} alt="" className="w-full h-full object-cover"/><button onClick={()=>setForm(f=>({...f,images:f.images.filter((_,j)=>j!==i)}))} className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full">✕</button></div>)}</div></div>
              <div className="flex gap-4"><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isFeatured} onChange={e=>setForm(f=>({...f,isFeatured:e.target.checked}))}/>Nổi bật</label><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isNew} onChange={e=>setForm(f=>({...f,isNew:e.target.checked}))}/>Mới</label><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isBestSeller} onChange={e=>setForm(f=>({...f,isBestSeller:e.target.checked}))}/>Bán chạy</label></div>
              <div className="flex justify-end gap-3 pt-2"><button onClick={()=>setShowForm(false)} className="btn-ghost">Huỷ</button><button onClick={handleSave} className="btn-primary">Lưu</button></div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
