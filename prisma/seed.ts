import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create admin
  const hashedPassword = await bcrypt.hash('admin123', 12)
  await prisma.admin.upsert({
    where: { email: 'admin@dosusupplements.com' },
    update: {},
    create: { email: 'admin@dosusupplements.com', password: hashedPassword, name: 'Admin' },
  })
  console.log('✅ Admin created: admin@dosusupplements.com / admin123')

  // Create categories
  const categories = [
    { name: 'Vitamin & Khoáng chất', slug: 'vitamin' },
    { name: 'Collagen & Đẹp da', slug: 'collagen' },
    { name: 'Hỗ trợ giảm cân', slug: 'giam-can' },
    { name: 'Tăng cường sức khỏe', slug: 'tang-cuong-suc-khoe' },
    { name: 'Bổ não & Trí nhớ', slug: 'bo-nao' },
    { name: 'Tiêu hóa', slug: 'tieu-hoa' },
  ]

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    })
  }
  console.log('✅ Categories created')

  // Create sample products
  const vitaminCat = await prisma.category.findUnique({ where: { slug: 'vitamin' } })
  const collagenCat = await prisma.category.findUnique({ where: { slug: 'collagen' } })
  const giamCanCat = await prisma.category.findUnique({ where: { slug: 'giam-can' } })
  const sucKhoeCat = await prisma.category.findUnique({ where: { slug: 'tang-cuong-suc-khoe' } })

  if (vitaminCat && collagenCat && giamCanCat && sucKhoeCat) {
    const products = [
      {
        name: 'Vitamin D3 5000 IU - Kirkland',
        slug: 'vitamin-d3-5000-iu-kirkland',
        categoryId: vitaminCat.id,
        description: 'Vitamin D3 5000 IU của Kirkland giúp tăng cường hấp thu canxi, hỗ trợ xương chắc khỏe và tăng cường hệ miễn dịch.',
        ingredients: 'Vitamin D3 (Cholecalciferol) 5000 IU, dầu đậu nành, gelatin, glycerin.',
        usage: 'Uống 1 viên/ngày cùng bữa ăn. Nên uống vào bữa sáng hoặc bữa trưa.',
        benefits: 'Tăng cường hấp thu canxi, hỗ trợ xương chắc khỏe, tăng cường miễn dịch, cải thiện tâm trạng.',
        warning: 'Không dùng quá liều khuyến cáo. Bảo quản nơi khô ráo, thoáng mát.',
        price: 350000, salePrice: 299000, stock: 50, unit: 'lọ', brand: 'Kirkland',
        images: ['/uploads/placeholder.jpg'],
        isFeatured: true, isNew: true, isBestSeller: true,
      },
      {
        name: 'Collagen Youtheory Type 1, 2 & 3',
        slug: 'collagen-youtheory-type-1-2-3',
        categoryId: collagenCat.id,
        description: 'Collagen Youtheory bổ sung collagen type 1, 2, 3 giúp da sáng mịn, tóc chắc khỏe, móng tay đẹp.',
        ingredients: 'Collagen Type 1, 2, 3 (6000mg), Vitamin C (60mg), Biotin.',
        usage: 'Uống 6 viên/ngày chia 2 lần (sáng và tối), uống trước bữa ăn 30 phút.',
        benefits: 'Da sáng mịn, giảm nếp nhăn, tóc và móng chắc khỏe, hỗ trợ khớp linh hoạt.',
        warning: 'Phụ nữ mang thai và cho con bú nên tham khảo ý kiến bác sĩ.',
        price: 550000, salePrice: 450000, stock: 30, unit: 'hộp', brand: 'Youtheory',
        images: ['/uploads/placeholder.jpg'],
        isFeatured: true, isNew: false, isBestSeller: true,
      },
      {
        name: 'Omega-3 Fish Oil 1000mg - Nature Made',
        slug: 'omega-3-fish-oil-1000mg-nature-made',
        categoryId: sucKhoeCat.id,
        description: 'Dầu cá Omega-3 Nature Made 1000mg cung cấp EPA và DHA hỗ trợ sức khỏe tim mạch, não bộ.',
        ingredients: 'Fish Oil 1000mg (EPA 180mg, DHA 120mg), Vitamin E.',
        usage: 'Uống 2 viên/ngày cùng bữa ăn.',
        benefits: 'Hỗ trợ tim mạch, cải thiện trí nhớ, giảm viêm khớp, tốt cho mắt.',
        warning: 'Người dị ứng hải sản nên tham khảo bác sĩ trước khi sử dụng.',
        price: 420000, stock: 45, unit: 'lọ', brand: 'Nature Made',
        images: ['/uploads/placeholder.jpg'],
        isFeatured: true, isNew: true, isBestSeller: false,
      },
      {
        name: 'Vitamin C 1000mg - Now Foods',
        slug: 'vitamin-c-1000mg-now-foods',
        categoryId: vitaminCat.id,
        description: 'Vitamin C 1000mg của Now Foods giúp tăng cường đề kháng, chống oxy hóa, bảo vệ sức khỏe.',
        ingredients: 'Vitamin C (Ascorbic Acid) 1000mg, Rose Hips.',
        usage: 'Uống 1 viên/ngày sau bữa ăn.',
        benefits: 'Tăng cường miễn dịch, chống oxy hóa, hỗ trợ sản sinh collagen, sáng da.',
        warning: 'Không dùng quá 2000mg/ngày. Bảo quản nơi khô ráo.',
        price: 280000, salePrice: 239000, stock: 80, unit: 'lọ', brand: 'Now Foods',
        images: ['/uploads/placeholder.jpg'],
        isFeatured: true, isNew: false, isBestSeller: true,
      },
      {
        name: 'Garcinia Cambogia - Hỗ trợ giảm cân',
        slug: 'garcinia-cambogia-ho-tro-giam-can',
        categoryId: giamCanCat.id,
        description: 'Garcinia Cambogia chiết xuất tự nhiên giúp kiểm soát cân nặng, giảm thèm ăn hiệu quả.',
        ingredients: 'Garcinia Cambogia Extract 1500mg (60% HCA), Calcium, Chromium.',
        usage: 'Uống 2 viên/ngày trước bữa ăn 30 phút.',
        benefits: 'Kiểm soát cân nặng, giảm thèm ăn, ngăn tích tụ mỡ, tăng chuyển hóa.',
        warning: 'Không dành cho phụ nữ mang thai. Kết hợp chế độ ăn và tập luyện.',
        price: 380000, salePrice: 320000, stock: 25, unit: 'hộp', brand: 'Nature Wise',
        images: ['/uploads/placeholder.jpg'],
        isFeatured: true, isNew: true, isBestSeller: false,
      },
      {
        name: 'Multivitamin Daily - Centrum',
        slug: 'multivitamin-daily-centrum',
        categoryId: vitaminCat.id,
        description: 'Centrum Multivitamin cung cấp đầy đủ vitamin và khoáng chất thiết yếu cho cơ thể mỗi ngày.',
        ingredients: 'Vitamin A, B1, B2, B6, B12, C, D, E, K, Sắt, Canxi, Kẽm, Magie...',
        usage: 'Uống 1 viên/ngày sau bữa ăn sáng.',
        benefits: 'Bổ sung dinh dưỡng toàn diện, tăng năng lượng, hỗ trợ miễn dịch.',
        warning: 'Bảo quản nơi khô ráo, tránh ánh nắng trực tiếp.',
        price: 450000, stock: 60, unit: 'hộp', brand: 'Centrum',
        images: ['/uploads/placeholder.jpg'],
        isFeatured: true, isNew: false, isBestSeller: true,
      },
      {
        name: 'Glucosamine Chondroitin - Move Free',
        slug: 'glucosamine-chondroitin-move-free',
        categoryId: sucKhoeCat.id,
        description: 'Move Free Glucosamine Chondroitin hỗ trợ khớp linh hoạt, giảm đau nhức xương khớp.',
        ingredients: 'Glucosamine HCl 1500mg, Chondroitin Sulfate 200mg, MSM.',
        usage: 'Uống 2 viên/ngày cùng bữa ăn.',
        benefits: 'Hỗ trợ khớp linh hoạt, giảm đau xương khớp, tái tạo sụn khớp.',
        warning: 'Người dị ứng hải sản cần thận trọng khi sử dụng.',
        price: 520000, salePrice: 459000, stock: 35, unit: 'hộp', brand: 'Move Free',
        images: ['/uploads/placeholder.jpg'],
        isFeatured: true, isNew: false, isBestSeller: false,
      },
      {
        name: 'Biotin 10000mcg - Natrol',
        slug: 'biotin-10000mcg-natrol',
        categoryId: collagenCat.id,
        description: 'Biotin Natrol 10000mcg giúp tóc mọc nhanh, giảm rụng tóc, móng tay chắc khỏe.',
        ingredients: 'Biotin (D-Biotin) 10000mcg, Calcium.',
        usage: 'Uống 1 viên/ngày cùng bữa ăn.',
        benefits: 'Giảm rụng tóc, tóc dày mượt, móng tay chắc khỏe, cải thiện da.',
        warning: 'Bảo quản nơi khô ráo, nhiệt độ phòng.',
        price: 260000, stock: 70, unit: 'lọ', brand: 'Natrol',
        images: ['/uploads/placeholder.jpg'],
        isFeatured: true, isNew: true, isBestSeller: false,
      },
    ]

    for (const prod of products) {
      await prisma.product.upsert({
        where: { slug: prod.slug },
        update: {},
        create: prod,
      })
    }
    console.log('✅ Sample products created')
  }

  // Create sample blog posts
  const blogPosts = [
    {
      title: '5 Loại Vitamin Thiết Yếu Cho Sức Khỏe Mỗi Ngày',
      slug: '5-loai-vitamin-thiet-yeu',
      category: 'Dinh dưỡng',
      summary: 'Tìm hiểu về 5 loại vitamin quan trọng nhất mà cơ thể bạn cần bổ sung hàng ngày để duy trì sức khỏe tốt nhất.',
      content: '<h2>Vitamin D - Vitamin Ánh Nắng</h2><p>Vitamin D đóng vai trò quan trọng trong việc hấp thu canxi và hỗ trợ hệ miễn dịch. Thiếu vitamin D có thể gây ra nhiều vấn đề sức khỏe nghiêm trọng.</p><h2>Vitamin C - Tăng Cường Đề Kháng</h2><p>Vitamin C là chất chống oxy hóa mạnh mẽ, giúp bảo vệ tế bào khỏi tổn thương và tăng cường hệ miễn dịch.</p><h2>Vitamin B12 - Năng Lượng Sống</h2><p>Vitamin B12 cần thiết cho sản xuất hồng cầu và chức năng thần kinh. Thiếu B12 có thể gây mệt mỏi và thiếu máu.</p>',
      thumbnail: '/uploads/placeholder.jpg',
      published: true,
    },
    {
      title: 'Collagen - Bí Quyết Cho Làn Da Trẻ Đẹp',
      slug: 'collagen-bi-quyet-da-tre-dep',
      category: 'Sức khỏe',
      summary: 'Collagen là protein quan trọng nhất cho làn da. Tìm hiểu cách bổ sung collagen đúng cách để có làn da trẻ trung.',
      content: '<h2>Collagen Là Gì?</h2><p>Collagen là protein chiếm khoảng 75% cấu trúc da, giúp da săn chắc, đàn hồi và mịn màng. Sau tuổi 25, cơ thể bắt đầu giảm sản xuất collagen.</p><h2>Khi Nào Cần Bổ Sung?</h2><p>Từ tuổi 25-30, bạn nên bắt đầu bổ sung collagen. Dấu hiệu thiếu collagen: da khô, nếp nhăn, tóc và móng yếu.</p>',
      thumbnail: '/uploads/placeholder.jpg',
      published: true,
    },
    {
      title: 'Omega-3: Tại Sao Dầu Cá Quan Trọng?',
      slug: 'omega-3-tai-sao-dau-ca-quan-trong',
      category: 'Sức khỏe',
      summary: 'Tìm hiểu về lợi ích sức khỏe của Omega-3 và cách chọn sản phẩm dầu cá chất lượng.',
      content: '<h2>Lợi Ích Của Omega-3</h2><p>Omega-3 là axit béo thiết yếu mà cơ thể không tự tổng hợp được. EPA và DHA trong dầu cá mang lại nhiều lợi ích cho tim mạch, não bộ và khớp.</p>',
      thumbnail: '/uploads/placeholder.jpg',
      published: true,
    },
  ]

  for (const post of blogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {},
      create: post,
    })
  }
  console.log('✅ Blog posts created')

  console.log('🎉 Seed completed!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
